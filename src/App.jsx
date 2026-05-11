import { useState, useEffect } from 'react'
import HabitCard from './components/HabitCard'
import AddHabit from './components/AddHabit'
import StatsPage from './components/StatsPage'
import { today, uid } from './utils'
import styles from './App.module.css'

const STORAGE_KEY = 'habit-tracker-v1'
const THEME_KEY = 'habit-tracker-theme'

function migrate(habits) {
  return habits.map(h => ({
    ...h,
    completions: h.completions.map(c =>
      typeof c === 'string' ? { date: c, time: '00:00', duration: 0 } : c
    ),
  }))
}

function load() {
  try {
    return migrate(JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [])
  } catch {
    return []
  }
}

export default function App() {
  const [habits, setHabits] = useState(load)
  const [view, setView] = useState('habits')
  const [dark, setDark] = useState(() => localStorage.getItem(THEME_KEY) === 'dark')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits))
  }, [habits])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : '')
    localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light')
  }, [dark])

  function addHabit(name) {
    setHabits(prev => [...prev, { id: uid(), name, createdAt: today(), completions: [] }])
  }

  function logHabit(id, entry) {
    setHabits(prev => prev.map(h => {
      if (h.id !== id) return h
      const rest = h.completions.filter(c => c.date !== entry.date)
      return { ...h, completions: [...rest, entry] }
    }))
  }

  function removeLog(id, date) {
    setHabits(prev => prev.map(h => {
      if (h.id !== id) return h
      return { ...h, completions: h.completions.filter(c => c.date !== date) }
    }))
  }

  function deleteHabit(id) {
    setHabits(prev => prev.filter(h => h.id !== id))
  }

  const todayStr = today()
  const doneCount = habits.filter(h => h.completions.some(c => c.date === todayStr)).length

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.topBar}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>✦</span>
            Habit Tracker
          </div>
          <div className={styles.controls}>
            <button
              className={`${styles.navBtn} ${view === 'habits' ? styles.active : ''}`}
              onClick={() => setView('habits')}
            >
              Habits
            </button>
            <button
              className={`${styles.navBtn} ${view === 'stats' ? styles.active : ''}`}
              onClick={() => setView('stats')}
            >
              Stats
            </button>
            <button
              className={styles.darkToggle}
              onClick={() => setDark(d => !d)}
              aria-label="Toggle dark mode"
            >
              {dark ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        {view === 'habits' && habits.length > 0 && (
          <div className={styles.progress}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${(doneCount / habits.length) * 100}%` }}
              />
            </div>
            <span className={styles.progressLabel}>{doneCount} / {habits.length} today</span>
          </div>
        )}
      </header>

      <main className={styles.main}>
        {view === 'stats' ? (
          <StatsPage habits={habits} />
        ) : (
          <>
            {habits.length === 0 && (
              <div className={styles.empty}>
                <div className={styles.emptyIcon}>🌱</div>
                <p>No habits yet. Add your first one below!</p>
              </div>
            )}

            <div className={styles.list}>
              {habits.map(habit => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onLog={logHabit}
                  onRemove={removeLog}
                  onDelete={deleteHabit}
                />
              ))}
            </div>

            <AddHabit onAdd={addHabit} />
          </>
        )}
      </main>
    </div>
  )
}

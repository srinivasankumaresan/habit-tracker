import { useState, useEffect } from 'react'
import HabitCard from './components/HabitCard'
import AddHabit from './components/AddHabit'
import { today, uid } from './utils'
import styles from './App.module.css'

const STORAGE_KEY = 'habit-tracker-v1'

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []
  } catch {
    return []
  }
}

export default function App() {
  const [habits, setHabits] = useState(load)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits))
  }, [habits])

  function addHabit(name) {
    setHabits(prev => [...prev, { id: uid(), name, createdAt: today(), completions: [] }])
  }

  function toggleHabit(id) {
    const todayStr = today()
    setHabits(prev => prev.map(h => {
      if (h.id !== id) return h
      const done = h.completions.includes(todayStr)
      return {
        ...h,
        completions: done
          ? h.completions.filter(d => d !== todayStr)
          : [...h.completions, todayStr],
      }
    }))
  }

  function deleteHabit(id) {
    setHabits(prev => prev.filter(h => h.id !== id))
  }

  const doneCount = habits.filter(h => h.completions.includes(today())).length

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>✦</span>
          Habit Tracker
        </div>
        {habits.length > 0 && (
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
              onToggle={toggleHabit}
              onDelete={deleteHabit}
            />
          ))}
        </div>

        <AddHabit onAdd={addHabit} />
      </main>
    </div>
  )
}

import { useState } from 'react'
import { today, calcStreak, lastNDays } from '../utils'
import LogModal from './LogModal'
import styles from './HabitCard.module.css'

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const WEEK = lastNDays(7)
const CHEERS = ['👍', '🎉', '⭐', '💪', '✨', '🏆', '🙌']

export default function HabitCard({ habit, onLog, onRemove, onDelete }) {
  const [modal, setModal] = useState(null)
  const [cheer, setCheer] = useState(null)

  const todayStr = today()
  const dates = habit.completions.map(c => c.date)
  const done = dates.includes(todayStr)
  const streak = calcStreak(dates)
  const byDate = Object.fromEntries(habit.completions.map(c => [c.date, c]))

  function openModal(date) {
    setModal({ date, existing: byDate[date] ?? null })
  }

  function handleCheckboxClick() {
    if (done) {
      onRemove(habit.id, todayStr)
    } else {
      openModal(todayStr)
    }
  }

  function triggerCheer() {
    const emoji = CHEERS[Math.floor(Math.random() * CHEERS.length)]
    setCheer({ emoji, key: Date.now() })
    setTimeout(() => setCheer(null), 1100)
  }

  function handleSave(entry) {
    const isNew = !byDate[entry.date]
    onLog(habit.id, entry)
    setModal(null)
    if (isNew) triggerCheer()
  }

  function handleRemove(date) {
    onRemove(habit.id, date)
    setModal(null)
  }

  return (
    <>
      <div className={`${styles.card} ${done ? styles.done : ''}`}>
        {cheer && (
          <span key={cheer.key} className={styles.cheer}>
            {cheer.emoji}
          </span>
        )}

        <div className={styles.top}>
          <button
            className={`${styles.checkbox} ${done ? styles.checked : ''}`}
            onClick={handleCheckboxClick}
            aria-label={done ? 'Mark incomplete' : 'Log today'}
          >
            {done && <CheckIcon />}
          </button>

          <div className={styles.info}>
            <span className={styles.name}>{habit.name}</span>
            {streak > 0 && (
              <span className={styles.streak} title={`${streak}-day streak`}>
                🔥 {streak} day{streak !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          <button
            className={styles.delete}
            onClick={() => onDelete(habit.id)}
            aria-label="Delete habit"
          >
            <TrashIcon />
          </button>
        </div>

        <div className={styles.calendar}>
          {WEEK.map((date) => {
            const dayOfWeek = new Date(date + 'T00:00:00').getDay()
            const entry = byDate[date]
            const completed = Boolean(entry)
            const isToday = date === todayStr
            return (
              <div key={date} className={styles.dayCol}>
                <span className={styles.dayLabel}>{DAY_LABELS[dayOfWeek]}</span>
                <button
                  className={`${styles.dot} ${completed ? styles.dotDone : ''} ${isToday ? styles.dotToday : ''}`}
                  onClick={() => openModal(date)}
                  aria-label={`${completed ? 'Edit' : 'Log'} ${date}`}
                  title={entry ? `${entry.duration ? entry.duration + 'min · ' : ''}${entry.time}` : date}
                />
                {entry?.duration > 0 && (
                  <span className={styles.dotDuration}>{entry.duration}m</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {modal && (
        <LogModal
          date={modal.date}
          existing={modal.existing}
          onSave={handleSave}
          onRemove={handleRemove}
          onCancel={() => setModal(null)}
        />
      )}
    </>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 7l3.5 3.5L12 3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

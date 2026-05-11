import { today, calcStreak } from '../utils'
import styles from './HabitCard.module.css'

export default function HabitCard({ habit, onToggle, onDelete }) {
  const todayStr = today()
  const done = habit.completions.includes(todayStr)
  const streak = calcStreak(habit.completions)

  return (
    <div className={`${styles.card} ${done ? styles.done : ''}`}>
      <button
        className={`${styles.checkbox} ${done ? styles.checked : ''}`}
        onClick={() => onToggle(habit.id)}
        aria-label={done ? 'Mark incomplete' : 'Mark complete'}
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

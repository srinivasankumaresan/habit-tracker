import { today, calcStreak, lastNDays } from '../utils'
import styles from './HabitCard.module.css'

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const WEEK = lastNDays(7)

export default function HabitCard({ habit, onToggle, onDelete }) {
  const todayStr = today()
  const done = habit.completions.includes(todayStr)
  const streak = calcStreak(habit.completions)
  const set = new Set(habit.completions)

  return (
    <div className={`${styles.card} ${done ? styles.done : ''}`}>
      <div className={styles.top}>
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

      <div className={styles.calendar}>
        {WEEK.map((date) => {
          const dayOfWeek = new Date(date + 'T00:00:00').getDay()
          const completed = set.has(date)
          const isToday = date === todayStr
          return (
            <div key={date} className={styles.dayCol}>
              <span className={styles.dayLabel}>{DAY_LABELS[dayOfWeek]}</span>
              <button
                className={`${styles.dot} ${completed ? styles.dotDone : ''} ${isToday ? styles.dotToday : ''}`}
                onClick={() => onToggle(habit.id, date)}
                aria-label={`${completed ? 'Unmark' : 'Mark'} ${date}`}
                title={date}
              />
            </div>
          )
        })}
      </div>
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

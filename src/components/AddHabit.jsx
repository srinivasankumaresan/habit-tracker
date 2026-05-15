import { useState } from 'react'
import { today } from '../utils'
import styles from './AddHabit.module.css'

function nowTime() {
  return new Date().toTimeString().slice(0, 5)
}

export default function AddHabit({ onAdd }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [date, setDate] = useState(today())
  const [time, setTime] = useState(nowTime())
  const [duration, setDuration] = useState('')

  function submit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onAdd(trimmed, { date, time, duration: Number(duration) || 0 })
    reset()
  }

  function reset() {
    setName('')
    setDate(today())
    setTime(nowTime())
    setDuration('')
    setOpen(false)
  }

  if (!open) {
    return (
      <button className={styles.trigger} onClick={() => setOpen(true)}>
        <span className={styles.plus}>+</span>
        Add a habit
      </button>
    )
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <input
        className={styles.input}
        autoFocus
        placeholder="Habit name, e.g. Read 30 minutes…"
        value={name}
        onChange={e => setName(e.target.value)}
        maxLength={60}
      />

      <div className={styles.divider}>
        <span>First entry</span>
      </div>

      <div className={styles.row}>
        <label className={styles.field}>
          <span className={styles.label}>Date</span>
          <input
            className={styles.input}
            type="date"
            value={date}
            max={today()}
            onChange={e => setDate(e.target.value)}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Time</span>
          <input
            className={styles.input}
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
          />
        </label>
      </div>

      <label className={styles.field}>
        <span className={styles.label}>Duration <span className={styles.optional}>(optional)</span></span>
        <div className={styles.durationRow}>
          <input
            className={styles.input}
            type="number"
            min="1"
            max="1440"
            placeholder="e.g. 30"
            value={duration}
            onChange={e => setDuration(e.target.value)}
          />
          <span className={styles.unit}>minutes</span>
        </div>
      </label>

      <div className={styles.actions}>
        <button type="submit" className={styles.add}>Add habit</button>
        <button type="button" className={styles.cancel} onClick={reset}>Cancel</button>
      </div>
    </form>
  )
}

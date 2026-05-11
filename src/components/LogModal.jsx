import { useState } from 'react'
import { today } from '../utils'
import styles from './LogModal.module.css'

function nowTime() {
  const d = new Date()
  return d.toTimeString().slice(0, 5)
}

export default function LogModal({ date, existing, onSave, onRemove, onCancel }) {
  const [selectedDate, setSelectedDate] = useState(date)
  const [time, setTime] = useState(existing?.time || nowTime())
  const [duration, setDuration] = useState(existing?.duration || '')

  function handleSubmit(e) {
    e.preventDefault()
    onSave({ date: selectedDate, time, duration: Number(duration) || 0 })
  }

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h3 className={styles.title}>{existing ? 'Edit log' : 'Log activity'}</h3>

        <form onSubmit={handleSubmit}>
          <div className={styles.fields}>
            <label className={styles.field}>
              <span className={styles.label}>Date</span>
              <input
                className={styles.input}
                type="date"
                value={selectedDate}
                max={today()}
                onChange={e => setSelectedDate(e.target.value)}
                required
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Time</span>
              <input
                className={styles.input}
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                required
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Duration (minutes)</span>
              <input
                className={styles.input}
                type="number"
                min="1"
                max="1440"
                placeholder="e.g. 30"
                value={duration}
                onChange={e => setDuration(e.target.value)}
              />
            </label>
          </div>

          <div className={styles.actions}>
            {existing && (
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => onRemove(existing.date)}
              >
                Remove
              </button>
            )}
            <button type="button" className={styles.cancelBtn} onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className={styles.saveBtn}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

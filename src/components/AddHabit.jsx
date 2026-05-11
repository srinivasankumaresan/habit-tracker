import { useState } from 'react'
import styles from './AddHabit.module.css'

export default function AddHabit({ onAdd }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')

  function submit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setName('')
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
        placeholder="e.g. Read 30 minutes…"
        value={name}
        onChange={e => setName(e.target.value)}
        maxLength={60}
      />
      <div className={styles.actions}>
        <button type="submit" className={styles.add}>Add</button>
        <button type="button" className={styles.cancel} onClick={() => { setOpen(false); setName('') }}>
          Cancel
        </button>
      </div>
    </form>
  )
}

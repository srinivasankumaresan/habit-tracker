import { today, lastNDays, calcStreak, calcLongestStreak, calcCompletionRate } from '../utils'
import styles from './StatsPage.module.css'

const LAST_7 = lastNDays(7)
const LAST_30 = lastNDays(30)

function formatTime(minutes) {
  if (!minutes) return '—'
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m ? `${h}h ${m}m` : `${h}h`
}

export default function StatsPage({ habits }) {
  if (habits.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>📊</div>
        <p>Add some habits to see your stats!</p>
      </div>
    )
  }

  const todayStr = today()
  const todayDone = habits.filter(h => h.completions.some(c => c.date === todayStr)).length
  const todayRate = Math.round((todayDone / habits.length) * 100)

  const overallRate30 = Math.round(
    habits.reduce((sum, h) => {
      const dates = h.completions.map(c => c.date)
      return sum + calcCompletionRate(dates, LAST_30)
    }, 0) / habits.length
  )

  const bestStreak = Math.max(...habits.map(h => calcLongestStreak(h.completions.map(c => c.date))), 0)
  const totalMinutes = habits.reduce((sum, h) => sum + h.completions.reduce((s, c) => s + (c.duration || 0), 0), 0)

  return (
    <div className={styles.page}>
      <div className={styles.overviewGrid}>
        <StatCard label="Today" value={`${todayDone}/${habits.length}`} sub={`${todayRate}% done`} accent />
        <StatCard label="30-day rate" value={`${overallRate30}%`} sub="avg across habits" />
        <StatCard label="Best streak" value={`${bestStreak}d`} sub="all time" />
        <StatCard label="Time logged" value={formatTime(totalMinutes)} sub="total across all habits" />
      </div>

      <h2 className={styles.sectionTitle}>Per Habit</h2>

      <div className={styles.habitList}>
        {habits.map(habit => (
          <HabitStat key={habit.id} habit={habit} />
        ))}
      </div>
    </div>
  )
}

function StatCard({ label, value, sub, accent }) {
  return (
    <div className={`${styles.statCard} ${accent ? styles.accent : ''}`}>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statSub}>{sub}</span>
    </div>
  )
}

function HabitStat({ habit }) {
  const dates = habit.completions.map(c => c.date)
  const streak = calcStreak(dates)
  const longest = calcLongestStreak(dates)
  const rate7 = calcCompletionRate(dates, LAST_7)
  const rate30 = calcCompletionRate(dates, LAST_30)
  const totalMinutes = habit.completions.reduce((s, c) => s + (c.duration || 0), 0)
  const sessionsWithTime = habit.completions.filter(c => c.duration > 0).length
  const avgMinutes = sessionsWithTime ? Math.round(totalMinutes / sessionsWithTime) : 0

  return (
    <div className={styles.habitRow}>
      <div className={styles.habitMeta}>
        <span className={styles.habitName}>{habit.name}</span>
        {streak > 0 && <span className={styles.habitStreak}>🔥 {streak}d streak</span>}
      </div>

      <div className={styles.bars}>
        <RateBar label="7d" rate={rate7} />
        <RateBar label="30d" rate={rate30} />
      </div>

      <div className={styles.habitNums}>
        <span>Current streak <strong>{streak}d</strong></span>
        <span>Longest <strong>{longest}d</strong></span>
        <span>Sessions <strong>{habit.completions.length}</strong></span>
        {totalMinutes > 0 && <span>Total time <strong>{formatTime(totalMinutes)}</strong></span>}
        {avgMinutes > 0 && <span>Avg session <strong>{formatTime(avgMinutes)}</strong></span>}
      </div>

      <MiniCalendar completions={habit.completions} />
    </div>
  )
}

function RateBar({ label, rate }) {
  return (
    <div className={styles.rateBar}>
      <span className={styles.rateLabel}>{label}</span>
      <div className={styles.barTrack}>
        <div className={styles.barFill} style={{ width: `${rate}%` }} />
      </div>
      <span className={styles.rateVal}>{rate}%</span>
    </div>
  )
}

function MiniCalendar({ completions }) {
  const byDate = Object.fromEntries(completions.map(c => [c.date, c]))
  const days = lastNDays(28)
  const todayStr = today()

  const weeks = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  return (
    <div className={styles.miniCal}>
      {weeks.map((week, wi) => (
        <div key={wi} className={styles.miniWeek}>
          {week.map(date => {
            const entry = byDate[date]
            return (
              <div
                key={date}
                className={`${styles.miniDot} ${entry ? styles.miniDotDone : ''} ${date === todayStr ? styles.miniDotToday : ''}`}
                title={entry ? `${entry.time}${entry.duration ? ' · ' + entry.duration + 'min' : ''}` : date}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}

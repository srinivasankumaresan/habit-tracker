import { today, lastNDays, calcStreak, calcLongestStreak, calcCompletionRate } from '../utils'
import styles from './StatsPage.module.css'

const LAST_7 = lastNDays(7)
const LAST_30 = lastNDays(30)

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
  const todayDone = habits.filter(h => h.completions.includes(todayStr)).length
  const todayRate = Math.round((todayDone / habits.length) * 100)

  const overallRate30 = Math.round(
    habits.reduce((sum, h) => sum + calcCompletionRate(h.completions, LAST_30), 0) / habits.length
  )

  const bestStreak = Math.max(...habits.map(h => calcLongestStreak(h.completions)), 0)
  const totalCompletions = habits.reduce((sum, h) => sum + h.completions.length, 0)

  return (
    <div className={styles.page}>
      <div className={styles.overviewGrid}>
        <StatCard label="Today" value={`${todayDone}/${habits.length}`} sub={`${todayRate}% done`} accent />
        <StatCard label="30-day rate" value={`${overallRate30}%`} sub="avg across habits" />
        <StatCard label="Best streak" value={`${bestStreak}d`} sub="all time" />
        <StatCard label="Total" value={totalCompletions} sub="completions" />
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
  const streak = calcStreak(habit.completions)
  const longest = calcLongestStreak(habit.completions)
  const rate7 = calcCompletionRate(habit.completions, LAST_7)
  const rate30 = calcCompletionRate(habit.completions, LAST_30)

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
        <span>Total <strong>{habit.completions.length}</strong></span>
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
  const set = new Set(completions)
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
          {week.map(date => (
            <div
              key={date}
              className={`${styles.miniDot} ${set.has(date) ? styles.miniDotDone : ''} ${date === todayStr ? styles.miniDotToday : ''}`}
              title={date}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

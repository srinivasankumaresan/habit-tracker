export function today() {
  return new Date().toISOString().slice(0, 10)
}

export function lastNDays(n) {
  const days = []
  const cursor = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(cursor)
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().slice(0, 10))
  }
  return days
}

export function calcStreak(completions) {
  if (!completions.length) return 0

  const set = new Set(completions)
  let streak = 0
  const cursor = new Date()

  // If today isn't done yet, start counting from yesterday
  if (!set.has(today())) cursor.setDate(cursor.getDate() - 1)

  while (true) {
    const key = cursor.toISOString().slice(0, 10)
    if (!set.has(key)) break
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}

export function calcLongestStreak(completions) {
  if (!completions.length) return 0
  const sorted = [...completions].sort()
  let longest = 1
  let current = 1
  for (let i = 1; i < sorted.length; i++) {
    const diff = (new Date(sorted[i]) - new Date(sorted[i - 1])) / 86400000
    if (diff === 1) { current++; longest = Math.max(longest, current) }
    else if (diff > 1) { current = 1 }
  }
  return longest
}

export function calcCompletionRate(completions, days) {
  if (!days.length) return 0
  const set = new Set(completions)
  return Math.round((days.filter(d => set.has(d)).length / days.length) * 100)
}

export function uid() {
  return Math.random().toString(36).slice(2, 10)
}

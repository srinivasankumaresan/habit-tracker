export function today() {
  return new Date().toISOString().slice(0, 10)
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

export function uid() {
  return Math.random().toString(36).slice(2, 10)
}

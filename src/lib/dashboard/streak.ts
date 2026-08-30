import { format, subDays, parseISO } from 'date-fns'

// Días consecutivos (terminando hoy) con al menos una actividad registrada.
export function computeStreak(dates: string[]): number {
  if (dates.length === 0) return 0
  const unique = [...new Set(dates)].sort().reverse()
  let streak = 0
  let cursor = format(new Date(), 'yyyy-MM-dd')

  for (const d of unique) {
    if (d === cursor) {
      streak++
      cursor = format(subDays(parseISO(cursor), 1), 'yyyy-MM-dd')
    } else break
  }
  return streak
}

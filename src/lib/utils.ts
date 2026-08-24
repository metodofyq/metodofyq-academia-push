import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, addDays, isToday, isPast } from 'date-fns'
import { es } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, pattern = 'dd MMM yyyy') {
  return format(new Date(date), pattern, { locale: es })
}

export function isDateToday(date: string | Date) {
  return isToday(new Date(date))
}

export function isDatePast(date: string | Date) {
  return isPast(new Date(date))
}

export function addDaysToDate(date: string | Date, days: number) {
  return addDays(new Date(date), days)
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return s > 0 ? `${m}m ${s}s` : `${m}m`
}

export function calculateAccuracyPercent(correct: number, total: number): number {
  if (total === 0) return 0
  return Math.round((correct / total) * 100)
}

const SUBJECT_COLORS: Record<string, string> = {
  fisica:   'bg-blue-100 text-blue-800',
  quimica:  'bg-green-100 text-green-800',
  geologia: 'bg-amber-100 text-amber-800',
  biologia: 'bg-emerald-100 text-emerald-800',
  general:  'bg-slate-100 text-slate-800',
}

export function getSubjectColor(subject: string): string {
  return SUBJECT_COLORS[subject] ?? SUBJECT_COLORS.general
}

const LEVEL_COLORS: Record<string, string> = {
  '0':   'bg-gray-100 text-gray-700',
  '0.5': 'bg-sky-100 text-sky-700',
  '1':   'bg-yellow-100 text-yellow-700',
  '2':   'bg-orange-100 text-orange-700',
  '2.5': 'bg-cyan-100 text-cyan-700',
  '3':   'bg-red-100 text-red-700',
  '4':   'bg-purple-100 text-purple-700',
}

export function getLevelColor(level: number): string {
  return LEVEL_COLORS[String(level)] ?? LEVEL_COLORS['0']
}

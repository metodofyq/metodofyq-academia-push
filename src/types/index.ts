import type { Database } from './database'

// database.ts es generado por `supabase gen types` (Json genérico para las
// columnas jsonb) — este shape concreto de `exercises.options` se mantiene
// aquí para no perderlo en la próxima regeneración.
export type ExerciseOption = {
  id: string
  text: string
  is_correct: boolean
}

export type Profile     = Database['public']['Tables']['profiles']['Row']
export type Topic       = Database['public']['Tables']['topics']['Row']
export type TopicLevel  = Database['public']['Tables']['topic_levels']['Row']
export type Exercise    = Database['public']['Tables']['exercises']['Row']
export type StudyPlan   = Database['public']['Tables']['study_plans']['Row']
export type StudyPlanTopic = Database['public']['Tables']['study_plan_topics']['Row']
export type TopicProgress = Database['public']['Tables']['topic_progress']['Row']
export type SpacedRepetition = Database['public']['Tables']['spaced_repetition']['Row']
export type ExerciseAttempt = Database['public']['Tables']['exercise_attempts']['Row']
export type DailyTask   = Database['public']['Tables']['daily_tasks']['Row']
export type Material    = Database['public']['Tables']['materials']['Row']

// Enriched types
export type TopicWithProgress = Topic & {
  progress?: TopicProgress | null
  spaced_repetition?: SpacedRepetition | null
}

export type DailyTaskWithTopic = DailyTask & {
  topic: Topic
}

export type ExerciseWithResult = Exercise & {
  userAnswer?: string
  isCorrect?: boolean
  timeSpent?: number
}

export type StudentKPI = {
  student: Profile
  total_topics_started: number
  total_topics_completed: number
  total_exercises_done: number
  correct_rate: number
  current_streak: number
  last_active: string | null
}

export type SM2Grade = 0 | 1 | 2 | 3 | 4 | 5

export const LEVEL_LABELS: Record<string, string> = {
  '0':   'N0 - Introducción',
  '0.5': 'N0.5 - Infografía',
  '1':   'N1 - Básico',
  '2':   'N2 - Intermedio',
  '2.5': 'N2.5 - Tarjetas',
  '3':   'N3 - Avanzado',
  '4':   'N4 - Examen',
}

export function levelLabel(level: number): string {
  return LEVEL_LABELS[String(level)] ?? LEVEL_LABELS['0']
}

export const SUBJECT_LABELS: Record<string, string> = {
  fisica:   'Física',
  quimica:  'Química',
  geologia: 'Geología',
  biologia: 'Biología',
  general:  'Transversal',
}

export const STUDY_PLAN_TOPICS_COUNT = 40
export const NEW_TOPIC_INTERVAL_DAYS = 3
export const DAILY_REVIEW_COUNT      = { min: 2, max: 3 }

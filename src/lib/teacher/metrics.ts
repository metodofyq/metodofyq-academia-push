import type { createClient } from '@/lib/supabase/server'

type SupabaseServer = Awaited<ReturnType<typeof createClient>>

export type StudentMetrics = {
  topicsStarted: number
  levelsCompleted: number
  totalDurationSeconds: number
  avgScore: number
  lastActive: string | null
}

// Métricas por alumno basadas en level_attempts/topic_progress — el
// modelo real de actividad (los 75 temas ya no usan `exercises`/
// `exercise_attempts`, que quedó vacío tras el re-seed del temario oficial).
export async function getStudentMetrics(supabase: SupabaseServer, studentId: string): Promise<StudentMetrics> {
  const [{ count: topicsStarted }, { data: attempts }] = await Promise.all([
    supabase.from('topic_progress').select('*', { count: 'exact', head: true }).eq('student_id', studentId),
    supabase.from('level_attempts').select('score_pct, duration_seconds, completed_at').eq('student_id', studentId),
  ])

  const levelsCompleted = attempts?.length ?? 0
  const totalDurationSeconds = (attempts ?? []).reduce((sum, a) => sum + (a.duration_seconds ?? 0), 0)
  const avgScore = levelsCompleted > 0
    ? Math.round((attempts ?? []).reduce((sum, a) => sum + a.score_pct, 0) / levelsCompleted)
    : 0
  const lastActive = (attempts ?? []).reduce<string | null>(
    (max, a) => (!max || a.completed_at > max ? a.completed_at : max),
    null
  )

  return {
    topicsStarted: topicsStarted ?? 0,
    levelsCompleted,
    totalDurationSeconds,
    avgScore,
    lastActive,
  }
}

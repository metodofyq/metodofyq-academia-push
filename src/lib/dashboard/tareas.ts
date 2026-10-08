import { format, differenceInWeeks } from 'date-fns'
import type { createClient } from '@/lib/supabase/server'
import { nivelesDelDia } from './schedule'

type SupabaseServer = Awaited<ReturnType<typeof createClient>>

export type TareasHoy = {
  temaActual: { id: string; code: string; title: string } | null
  niveles: number[]
  hechos: number[]
  pendientes: number[]
}

// Tema en curso = el de topic_progress con actividad más reciente, y sus
// niveles programados para hoy según la programación semanal fija.
// Si el tema tiene duration_weeks > 1, la programación se repite.
export async function getTareasHoy(supabase: SupabaseServer, studentId: string): Promise<TareasHoy> {
  const { data: progresos } = await supabase
    .from('topic_progress')
    .select('*, topic:topics(id, code, title)')
    .eq('student_id', studentId)
    .not('last_studied_at', 'is', null)
    .order('last_studied_at', { ascending: false })
    .limit(1)

  const temaActual = progresos?.[0]?.topic ?? null
  const progress = progresos?.[0]
  const hoy = new Date()

  let niveles = nivelesDelDia(hoy)

  // If topic has duration_weeks > 1, calculate current week within duration
  if (temaActual && progress?.first_studied_at) {
    const { data: planTopic } = await supabase
      .from('study_plan_topics')
      .select('duration_weeks, created_at')
      .eq('topic_id', temaActual.id)
      .single()

    if (planTopic?.duration_weeks && planTopic.duration_weeks > 1) {
      const topicStartDate = new Date(planTopic.created_at)
      const weeksSinceStart = differenceInWeeks(hoy, topicStartDate)
      const weekInCycle = weeksSinceStart % planTopic.duration_weeks
      // niveles se mantienen igual, solo que se repite la secuencia
      // No need to change nivelesDelDia() output
    }
  }

  let hechos: number[] = []
  if (temaActual) {
    const hoyStr = format(hoy, 'yyyy-MM-dd')
    const { data: attempts } = await supabase
      .from('level_attempts')
      .select('level')
      .eq('student_id', studentId)
      .eq('topic_id', temaActual.id)
      .gte('completed_at', `${hoyStr}T00:00:00`)
      .lte('completed_at', `${hoyStr}T23:59:59`)
    hechos = (attempts ?? []).map((a) => Number(a.level))
  }

  const pendientes = niveles.filter((n) => !hechos.includes(n))
  return { temaActual, niveles, hechos, pendientes }
}

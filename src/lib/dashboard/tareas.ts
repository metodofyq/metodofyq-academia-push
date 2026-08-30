import { format } from 'date-fns'
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
export async function getTareasHoy(supabase: SupabaseServer, studentId: string): Promise<TareasHoy> {
  const { data: progresos } = await supabase
    .from('topic_progress')
    .select('*, topic:topics(id, code, title)')
    .eq('student_id', studentId)
    .not('last_studied_at', 'is', null)
    .order('last_studied_at', { ascending: false })
    .limit(1)

  const temaActual = progresos?.[0]?.topic ?? null
  const hoy = new Date()
  const niveles = nivelesDelDia(hoy)

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

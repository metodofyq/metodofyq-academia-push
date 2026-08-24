import { createClient } from '@/lib/supabase/client'
import { nextNivel, type NivelValue } from './constants'

type CompleteLevelArgs = {
  studentId: string
  topicId: string
  level: NivelValue
  scorePct: number
  incluirNivel4: boolean
}

// Registra la finalización de un subnivel interactivo y avanza
// topic_progress.current_level cuando corresponde — mismo patrón que
// exercise-session.tsx (escritura directa desde el cliente, sin server action).
export async function completeLevel({
  studentId,
  topicId,
  level,
  scorePct,
  incluirNivel4,
}: CompleteLevelArgs): Promise<{ siguienteNivel: NivelValue | null }> {
  const supabase = createClient()

  await supabase.from('level_attempts').insert({
    student_id: studentId,
    topic_id: topicId,
    level,
    score_pct: Math.round(scorePct),
  })

  const { data: progress } = await supabase
    .from('topic_progress')
    .select('current_level')
    .eq('student_id', studentId)
    .eq('topic_id', topicId)
    .maybeSingle()

  const currentLevel = progress?.current_level != null ? Number(progress.current_level) : 0
  const esNivelActual = Math.abs(currentLevel - level) < 0.01
  const siguiente = esNivelActual ? nextNivel(level, incluirNivel4) : null

  await supabase.from('topic_progress').upsert(
    {
      student_id: studentId,
      topic_id: topicId,
      is_unlocked: true,
      current_level: siguiente ?? currentLevel,
      last_studied_at: new Date().toISOString(),
    },
    { onConflict: 'student_id,topic_id' }
  )

  return { siguienteNivel: siguiente }
}

// Study session management utilities
// Handles starting, ending, and calculating study session durations

import { createClient } from '@/lib/supabase/client'

export interface StudySession {
  id?: string
  studentId: string
  topicId: string
  startedAt: Date
  endedAt?: Date
  durationMinutes?: number
}

/**
 * Start a new study session for a student on a topic
 */
export async function startStudySession(
  studentId: string,
  topicId: string
): Promise<StudySession | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('study_sessions')
    .insert({
      student_id: studentId,
      topic_id: topicId,
      started_at: new Date().toISOString(),
    })
    .select('id, student_id, topic_id, started_at')
    .single()

  if (error) {
    console.error('Error starting study session:', error)
    return null
  }

  return {
    id: data.id,
    studentId: data.student_id,
    topicId: data.topic_id,
    startedAt: new Date(data.started_at),
  }
}

/**
 * End a study session and calculate duration
 */
export async function endStudySession(sessionId: string): Promise<StudySession | null> {
  const supabase = createClient()
  const now = new Date()

  const { data, error } = await supabase
    .from('study_sessions')
    .update({
      ended_at: now.toISOString(),
    })
    .eq('id', sessionId)
    .select('id, student_id, topic_id, started_at, ended_at')
    .single()

  if (error) {
    console.error('Error ending study session:', error)
    return null
  }

  const startedAt = new Date(data.started_at)
  const endedAt = new Date(data.ended_at)
  const durationMinutes = Math.round((endedAt.getTime() - startedAt.getTime()) / (1000 * 60))

  // Update duration
  const { error: updateError } = await supabase
    .from('study_sessions')
    .update({
      duration_minutes: durationMinutes,
    })
    .eq('id', sessionId)

  if (updateError) {
    console.error('Error updating session duration:', updateError)
  }

  return {
    id: data.id,
    studentId: data.student_id,
    topicId: data.topic_id,
    startedAt,
    endedAt,
    durationMinutes,
  }
}

/**
 * Get total time spent on a topic by a student
 */
export async function getTotalTimeOnTopic(
  studentId: string,
  topicId: string
): Promise<number> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('study_sessions')
    .select('duration_minutes')
    .eq('student_id', studentId)
    .eq('topic_id', topicId)
    .not('duration_minutes', 'is', null)

  if (error) {
    console.error('Error getting total time:', error)
    return 0
  }

  return (data ?? []).reduce((sum, session) => sum + (session.duration_minutes || 0), 0)
}

/**
 * Get time spent on all topics by a student
 */
export async function getTimeByTopic(studentId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('study_sessions')
    .select('topic_id, duration_minutes, topic:topics(code, title)')
    .eq('student_id', studentId)
    .not('duration_minutes', 'is', null)

  if (error) {
    console.error('Error getting time by topic:', error)
    return {}
  }

  const result: Record<string, { totalMinutes: number; code: string; title: string }> = {}

  for (const session of data ?? []) {
    const topicId = session.topic_id
    const topic = session.topic as any

    if (!result[topicId]) {
      result[topicId] = {
        totalMinutes: 0,
        code: topic?.code || 'Unknown',
        title: topic?.title || 'Unknown',
      }
    }

    result[topicId].totalMinutes += session.duration_minutes || 0
  }

  return result
}

/**
 * Format minutes to human readable duration
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`
  }

  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (mins === 0) {
    return `${hours}h`
  }

  return `${hours}h ${mins}m`
}

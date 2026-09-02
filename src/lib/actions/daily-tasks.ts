'use server'

import { format } from 'date-fns'
import { createClient } from '@/lib/supabase/server'
import { getReviewTopics } from '@/lib/study-plan'
import type { SpacedRepetition, Topic } from '@/types'
import { NEW_TOPIC_INTERVAL_DAYS } from '@/types'

/**
 * Server action: generate daily tasks for a student if they don't exist yet.
 * Called automatically from the dashboard page.
 */
export async function generateDailyTasks(studentId: string) {
  const supabase = await createClient()
  const today    = format(new Date(), 'yyyy-MM-dd')

  // Fetch active study plan
  const { data: plan } = await supabase
    .from('study_plans')
    .select('*, study_plan_topics(*, topic:topics(*))')
    .eq('student_id', studentId)
    .eq('is_active', true)
    .single()

  if (!plan) return

  const planTopics = plan.study_plan_topics ?? []

  // Find today's new topic (use scheduled_date if available, fallback to calculation)
  const newTopicEntry = planTopics.find((pt: any) => {
    const scheduledDateStr = pt.scheduled_date ? String(pt.scheduled_date).split('T')[0] : (() => {
      const startDate = new Date(plan.started_at)
      const scheduled = new Date(startDate)
      scheduled.setDate(scheduled.getDate() + pt.order_index * NEW_TOPIC_INTERVAL_DAYS)
      return format(scheduled, 'yyyy-MM-dd')
    })()
    return scheduledDateStr === today
  })

  const tasks: Array<{
    student_id: string
    task_date: string
    task_type: 'new_topic' | 'review'
    topic_id: string
    exercise_ids: string[]
  }> = []

  if (newTopicEntry?.topic) {
    const topic = newTopicEntry.topic as Topic
    const exerciseIds = await pickExercises(supabase, topic.id, 0, 5)
    tasks.push({
      student_id:   studentId,
      task_date:    today,
      task_type:    'new_topic',
      topic_id:     topic.id,
      exercise_ids: exerciseIds,
    })

    // Unlock topic progress
    await supabase.from('topic_progress').upsert({
      student_id:      studentId,
      topic_id:        topic.id,
      is_unlocked:     true,
      first_studied_at: new Date().toISOString(),
      last_studied_at:  new Date().toISOString(),
    }, { onConflict: 'student_id,topic_id' })

    // Init SR card
    await supabase.from('spaced_repetition').upsert({
      student_id:       studentId,
      topic_id:         topic.id,
      next_review_date: today,
    }, { onConflict: 'student_id,topic_id', ignoreDuplicates: true })
  }

  // Review topics (SR cards due today)
  const { data: srCards } = await supabase
    .from('spaced_repetition')
    .select('*')
    .eq('student_id', studentId)
    .lte('next_review_date', today)
    .gt('repetitions', 0)
    .order('next_review_date')
    .limit(3)

  const { data: allTopics } = await supabase.from('topics').select('*')

  if (srCards && allTopics) {
    const reviewTopics = getReviewTopics(
      srCards as SpacedRepetition[],
      allTopics as Topic[],
      3
    )

    for (const topic of reviewTopics) {
      const { data: progress } = await supabase
        .from('topic_progress')
        .select('current_level')
        .eq('student_id', studentId)
        .eq('topic_id', topic.id)
        .single()

      const exerciseIds = await pickExercises(supabase, topic.id, progress?.current_level ?? 0, 3)
      tasks.push({
        student_id:   studentId,
        task_date:    today,
        task_type:    'review',
        topic_id:     topic.id,
        exercise_ids: exerciseIds,
      })
    }
  }

  if (tasks.length > 0) {
    await supabase.from('daily_tasks').upsert(tasks, {
      onConflict: 'student_id,task_date,topic_id,task_type',
      ignoreDuplicates: true,
    })
  }
}

async function pickExercises(
  supabase: Awaited<ReturnType<typeof createClient>>,
  topicId: string,
  level: number,
  count: number
): Promise<string[]> {
  const { data } = await supabase
    .from('exercises')
    .select('id')
    .eq('topic_id', topicId)
    .lte('level', level + 1)
    .eq('is_active', true)
    .limit(count * 3)

  if (!data || data.length === 0) return []

  // Random sample
  const shuffled = data.sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count).map(e => e.id)
}

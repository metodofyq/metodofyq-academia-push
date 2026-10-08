import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify user is a teacher
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'teacher') {
    return NextResponse.json({ error: 'Not a teacher' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { studentId, topicId, durationWeeks = 1 } = body

    if (!studentId || !topicId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (![1, 2, 3].includes(durationWeeks)) {
      return NextResponse.json(
        { error: 'Duration weeks must be 1, 2, or 3' },
        { status: 400 }
      )
    }

    // Get student's active study plan
    const { data: plan } = await supabase
      .from('study_plans')
      .select('id')
      .eq('student_id', studentId)
      .eq('is_active', true)
      .single()

    if (!plan) {
      return NextResponse.json(
        { error: 'Student has no active study plan' },
        { status: 404 }
      )
    }

    // Check if topic already assigned
    const { data: existing } = await supabase
      .from('study_plan_topics')
      .select('id')
      .eq('study_plan_id', plan.id)
      .eq('topic_id', topicId)
      .single()

    if (existing) {
      // Update existing assignment
      const { error: updateError } = await supabase
        .from('study_plan_topics')
        .update({ duration_weeks: durationWeeks })
        .eq('id', existing.id)

      if (updateError) {
        return NextResponse.json(
          { error: updateError.message },
          { status: 500 }
        )
      }
    } else {
      // Create new assignment - find max order_index
      const { data: lastTopic } = await supabase
        .from('study_plan_topics')
        .select('order_index')
        .eq('study_plan_id', plan.id)
        .order('order_index', { ascending: false })
        .limit(1)

      const nextOrder = (lastTopic?.[0]?.order_index ?? -1) + 1

      const { error: insertError } = await supabase
        .from('study_plan_topics')
        .insert({
          study_plan_id: plan.id,
          topic_id: topicId,
          order_index: nextOrder,
          duration_weeks: durationWeeks,
        })

      if (insertError) {
        return NextResponse.json(
          { error: insertError.message },
          { status: 500 }
        )
      }
    }

    // Initialize topic progress if needed
    const { data: progress } = await supabase
      .from('topic_progress')
      .select('id')
      .eq('student_id', studentId)
      .eq('topic_id', topicId)
      .single()

    if (!progress) {
      await supabase
        .from('topic_progress')
        .insert({
          student_id: studentId,
          topic_id: topicId,
          current_level: 0,
          is_unlocked: false,
        })
    }

    return NextResponse.json({
      success: true,
      message: `Topic assigned for ${durationWeeks} week(s)`,
    })
  } catch (error) {
    console.error('Error assigning topic:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

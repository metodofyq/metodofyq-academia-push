import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify user is a teacher
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, grupo')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'teacher') {
    return NextResponse.json({ error: 'Not a teacher' }, { status: 403 })
  }

  const searchParams = request.nextUrl.searchParams
  const grupoFilter = searchParams.get('group') || String(profile.grupo)
  const studentIdFilter = searchParams.get('student_id')

  try {
    // Get students
    let query = supabase
      .from('profiles')
      .select('id, full_name, email')
      .eq('role', 'student')
      .eq('grupo', grupoFilter)

    if (studentIdFilter) {
      query = query.eq('id', studentIdFilter)
    }

    const { data: students, error: studentsError } = await query

    if (studentsError || !students) {
      return NextResponse.json({ error: 'No students found' }, { status: 404 })
    }

    // Get time data for each student
    const analytics = await Promise.all(
      students.map(async (student) => {
        const { data: sessions } = await supabase
          .from('study_sessions')
          .select(`
            id,
            duration_minutes,
            topic:topics(id, code, title)
          `)
          .eq('student_id', student.id)
          .not('duration_minutes', 'is', null)

        // Group by topic
        const byTopic: Record<
          string,
          {
            topicCode: string
            topicTitle: string
            totalMinutes: number
            sessionCount: number
          }
        > = {}

        let totalMinutes = 0

        for (const session of sessions ?? []) {
          const topic = session.topic as any
          const topicId = topic?.id || 'unknown'
          const durationMinutes = session.duration_minutes || 0

          if (!byTopic[topicId]) {
            byTopic[topicId] = {
              topicCode: topic?.code || 'Unknown',
              topicTitle: topic?.title || 'Unknown',
              totalMinutes: 0,
              sessionCount: 0,
            }
          }

          byTopic[topicId].totalMinutes += durationMinutes
          byTopic[topicId].sessionCount += 1
          totalMinutes += durationMinutes
        }

        return {
          studentId: student.id,
          studentName: student.full_name,
          studentEmail: student.email,
          totalMinutes,
          totalHours: Math.round((totalMinutes / 60) * 10) / 10,
          sessionCount: sessions?.length || 0,
          byTopic: Object.entries(byTopic).map(([topicId, data]) => ({
            topicId,
            topicCode: data.topicCode,
            topicTitle: data.topicTitle,
            totalMinutes: data.totalMinutes,
            totalHours: Math.round((data.totalMinutes / 60) * 10) / 10,
            sessionCount: data.sessionCount,
          })),
        }
      })
    )

    // Calculate group statistics
    const groupTotalMinutes = analytics.reduce((sum, a) => sum + a.totalMinutes, 0)
    const avgStudentMinutes = analytics.length > 0 ? Math.round(groupTotalMinutes / analytics.length) : 0

    return NextResponse.json({
      group: grupoFilter,
      studentCount: analytics.length,
      analytics,
      groupStats: {
        totalMinutes: groupTotalMinutes,
        totalHours: Math.round((groupTotalMinutes / 60) * 10) / 10,
        averageMinutesPerStudent: avgStudentMinutes,
        averageHoursPerStudent: Math.round((avgStudentMinutes / 60) * 10) / 10,
      },
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

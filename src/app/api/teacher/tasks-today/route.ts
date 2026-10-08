import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { format } from 'date-fns'
import { PROGRAMACION_SEMANAL, DIAS_SEMANA } from '@/lib/dashboard/schedule'

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

  // Get query params
  const searchParams = request.nextUrl.searchParams
  const grupoFilter = searchParams.get('group')
  const dateStr = searchParams.get('date') || format(new Date(), 'yyyy-MM-dd')

  try {
    // Get all students in the same group
    const { data: students, error: studentsError } = await supabase
      .from('profiles')
      .select('id, full_name, email, grupo')
      .eq('role', 'student')
      .eq('grupo', grupoFilter || profile.grupo)

    if (studentsError || !students) {
      return NextResponse.json({ error: 'No students found' }, { status: 404 })
    }

    // Get current day of week
    const date = new Date(dateStr)
    const dayOfWeek = DIAS_SEMANA[date.getDay()]
    const programmedLevels = PROGRAMACION_SEMANAL[dayOfWeek as keyof typeof PROGRAMACION_SEMANAL] || []

    // For each student, get their current topic and attempted levels today
    const tasksToday = await Promise.all(
      students.map(async (student) => {
        // Get student's current topic
        const { data: progress } = await supabase
          .from('topic_progress')
          .select('*, topic:topics(id, code, title)')
          .eq('student_id', student.id)
          .not('last_studied_at', 'is', null)
          .order('last_studied_at', { ascending: false })
          .limit(1)

        const currentTopic = progress?.[0]?.topic as any
        const topicId = currentTopic?.id

        if (!topicId) {
          return {
            studentId: student.id,
            studentName: student.full_name,
            studentEmail: student.email,
            topicCode: null,
            topicTitle: null,
            dayOfWeek,
            programmeLevels: [],
            completedLevels: [],
            pendingLevels: [],
            progressPercent: 0
          }
        }

        // Get completed levels today
        const { data: attempts } = await supabase
          .from('level_attempts')
          .select('level')
          .eq('student_id', student.id)
          .eq('topic_id', topicId)
          .gte('completed_at', `${dateStr}T00:00:00`)
          .lte('completed_at', `${dateStr}T23:59:59`)

        const completedLevels = (attempts || []).map((a) => Number(a.level))
        const pendingLevels = programmedLevels.filter((l) => !completedLevels.includes(l))
        const progressPercent = programmedLevels.length > 0
          ? Math.round((completedLevels.length / programmedLevels.length) * 100)
          : 0

        return {
          studentId: student.id,
          studentName: student.full_name,
          studentEmail: student.email,
          topicCode: currentTopic.code,
          topicTitle: currentTopic.title,
          dayOfWeek,
          programmeLevels: programmedLevels,
          completedLevels: completedLevels.sort(),
          pendingLevels: pendingLevels.sort(),
          progressPercent
        }
      })
    )

    return NextResponse.json({
      date: dateStr,
      dayOfWeek,
      group: grupoFilter || profile.grupo,
      studentCount: students.length,
      tasks: tasksToday
    })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

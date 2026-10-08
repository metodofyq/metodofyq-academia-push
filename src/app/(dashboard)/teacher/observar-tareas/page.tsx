import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TasksTodayTable } from '@/components/teacher/tasks-today-table'
import { Card, CardContent } from '@/components/ui/card'

export default async function ObservarTareasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Get user profile to verify teacher role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, grupo')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'teacher') {
    redirect('/dashboard')
  }

  try {
    // Call API to get today's tasks for all students in group
    const today = new Date().toISOString().split('T')[0]
    const response = await fetch(
      new URL(
        `/api/teacher/tasks-today?group=${profile.grupo}&date=${today}`,
        process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'
      ).toString(),
      {
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token || ''}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch tasks')
    }

    const data = await response.json()

    return (
      <div className="max-w-7xl mx-auto space-y-6 py-6">
        <div>
          <h1 className="text-3xl font-bold">Observar Tareas Diarias</h1>
          <p className="text-muted-foreground">
            Monitorea el progreso diario de todos los alumnos de tu grupo
          </p>
        </div>

        <TasksTodayTable
          date={data.date}
          dayOfWeek={data.dayOfWeek}
          group={data.group}
          tasks={data.tasks}
        />
      </div>
    )
  } catch (error) {
    console.error('Error loading tasks:', error)
    return (
      <div className="max-w-7xl mx-auto space-y-6 py-6">
        <div>
          <h1 className="text-3xl font-bold">Observar Tareas Diarias</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-600">Error al cargar las tareas. Intenta nuevamente más tarde.</p>
          </CardContent>
        </Card>
      </div>
    )
  }
}

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { format, subDays } from 'date-fns'
import { ListChecks, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { StudyStreak } from '@/components/dashboard/study-streak'
import { WeekCalendar } from '@/components/dashboard/week-calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getTareasHoy } from '@/lib/dashboard/tareas'

export default async function OverviewPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { pendientes, temaActual, niveles } = await getTareasHoy(supabase, user.id)
  const since = format(subDays(new Date(), 30), 'yyyy-MM-dd')

  const [{ data: attempts }, { data: medallas }] = await Promise.all([
    supabase
      .from('level_attempts')
      .select('level, completed_at')
      .eq('student_id', user.id)
      .gte('completed_at', since),
    supabase
      .from('medallas')
      .select('*')
      .eq('student_id', user.id)
      .order('created_at', { ascending: false })
      .limit(3),
  ])

  const attemptsByDate: Record<string, number[]> = {}
  const allDates = new Set<string>()
  for (const a of attempts ?? []) {
    const day = format(new Date(a.completed_at), 'yyyy-MM-dd')
    allDates.add(day)
    if (!attemptsByDate[day]) attemptsByDate[day] = []
    attemptsByDate[day].push(Number(a.level))
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Visión general</h1>
        <p className="text-muted-foreground">Tu actividad de las últimas 3 semanas</p>
      </div>

      {temaActual && niveles.length > 0 && (
        pendientes.length > 0 ? (
          <Link href="/dashboard">
            <Button className="w-full justify-between" size="lg">
              <span className="flex items-center gap-2">
                <ListChecks className="h-4 w-4" />
                Tienes {pendientes.length} tarea{pendientes.length > 1 ? 's' : ''} diaria{pendientes.length > 1 ? 's' : ''} pendiente{pendientes.length > 1 ? 's' : ''}
              </span>
              <span>→</span>
            </Button>
          </Link>
        ) : (
          <div className="flex items-center gap-2 rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 font-medium">
            <CheckCircle2 className="h-4 w-4" />
            ¡Has completado tus tareas diarias de hoy!
          </div>
        )
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="sm:col-span-1">
          <StudyStreak completedDates={[...allDates]} />
        </div>
        <Card className="sm:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Calendario</CardTitle>
          </CardHeader>
          <CardContent>
            <WeekCalendar attemptsByDate={attemptsByDate} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Últimas medallas</CardTitle>
            <Link href="/medallero" className="text-sm text-primary hover:underline">
              Ver medallero →
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {medallas && medallas.length > 0 ? (
            <div className="flex gap-4">
              {medallas.map((m) => (
                <div key={m.id} className="flex flex-col items-center text-center gap-1">
                  <span className="text-3xl">{m.emoji}</span>
                  <span className="text-xs font-medium max-w-20 truncate">{m.nombre}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Todavía no tienes medallas.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

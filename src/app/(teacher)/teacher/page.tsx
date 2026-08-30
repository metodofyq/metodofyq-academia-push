import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getStudentMetrics, type StudentMetrics } from '@/lib/teacher/metrics'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, BookOpen, Clock, Upload, ArrowLeft, Trophy, UserPlus } from 'lucide-react'
import { formatDate, formatDuration } from '@/lib/utils'
import type { Profile } from '@/types'

interface StudentKPI {
  student: Profile
  metrics: StudentMetrics
}

export default async function TeacherDashboardPage() {
  const supabase = await createClient()

  const { data: students } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'student')
    .order('created_at', { ascending: false })

  const kpis: StudentKPI[] = []
  for (const student of (students ?? []) as Profile[]) {
    kpis.push({ student, metrics: await getStudentMetrics(supabase, student.id) })
  }

  const totalStudents = kpis.length
  const totalTimeSeconds = kpis.reduce((s, k) => s + k.metrics.totalDurationSeconds, 0)

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/overview"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Panel del Profesor</h1>
          <p className="text-muted-foreground">Seguimiento de alumnos en tiempo real</p>
        </div>
      </div>

      {/* Overview cards */}
      <div className="grid gap-4 sm:grid-cols-5">
        {[
          { label: 'Alumnos activos', value: totalStudents, icon: Users, color: 'text-blue-600' },
          { label: 'Tiempo total dedicado', value: formatDuration(totalTimeSeconds), icon: Clock, color: 'text-indigo-600' },
          { label: 'Añadir alumno', value: '+ Nuevo', icon: UserPlus, color: 'text-blue-600', href: '/teacher/students/new' },
          { label: 'Materiales', value: 'Subir', icon: Upload, color: 'text-purple-600', href: '/teacher/materials' },
          { label: 'Medallero', value: 'Otorgar', icon: Trophy, color: 'text-amber-600', href: '/teacher/medallas' },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-muted">
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {s.href ? (
                    <Link href={s.href} className="hover:underline text-primary">{s.value}</Link>
                  ) : s.value}
                </div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Students table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Alumnos ({totalStudents})</CardTitle>
            <Button asChild size="sm" variant="outline">
              <Link href="/teacher/students">Ver todos</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {kpis.slice(0, 10).map(kpi => (
              <div key={kpi.student.id} className="flex items-center gap-4 py-2 border-b last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {kpi.student.full_name ?? kpi.student.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {kpi.metrics.lastActive
                      ? `Activo: ${formatDate(kpi.metrics.lastActive)}`
                      : 'Sin actividad'}
                  </p>
                </div>
                <div className="shrink-0 text-right text-sm space-y-1">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{kpi.metrics.topicsStarted} temas</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{formatDuration(kpi.metrics.totalDurationSeconds)}</span>
                  </div>
                </div>
                <div className="shrink-0 text-center">
                  <div className="text-sm font-medium">{kpi.metrics.levelsCompleted}</div>
                  <div className="text-[11px] text-muted-foreground">niveles</div>
                </div>
                <Badge
                  variant={kpi.metrics.avgScore >= 70 ? 'default' : kpi.metrics.avgScore >= 50 ? 'secondary' : 'destructive'}
                  className="shrink-0 text-xs"
                >
                  {kpi.metrics.levelsCompleted > 0 ? `${kpi.metrics.avgScore}%` : 'Sin datos'}
                </Badge>
              </div>
            ))}
            {kpis.length === 0 && (
              <p className="text-center py-8 text-muted-foreground">
                Todavía no hay alumnos registrados.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

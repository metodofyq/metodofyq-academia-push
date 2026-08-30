import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Users, BookOpen, BarChart3, Upload, ArrowLeft, Trophy } from 'lucide-react'
import { calculateAccuracyPercent } from '@/lib/utils'
import type { Profile } from '@/types'

interface StudentKPI {
  student: Profile
  topicsStarted: number
  exercises: number
  correct: number
  lastActive: string | null
}

export default async function TeacherDashboardPage() {
  const supabase = await createClient()

  // Fetch all students
  const { data: students } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'student')
    .order('created_at', { ascending: false })

  const kpis: StudentKPI[] = []

  for (const student of (students ?? []) as Profile[]) {
    const [
      { count: topicsStarted },
      { count: exercises },
      { count: correct },
      { data: lastActivity },
    ] = await Promise.all([
      supabase.from('topic_progress').select('*', { count: 'exact', head: true })
        .eq('student_id', student.id).eq('is_unlocked', true),
      supabase.from('exercise_attempts').select('*', { count: 'exact', head: true })
        .eq('student_id', student.id),
      supabase.from('exercise_attempts').select('*', { count: 'exact', head: true })
        .eq('student_id', student.id).eq('is_correct', true),
      supabase.from('exercise_attempts').select('attempted_at')
        .eq('student_id', student.id).order('attempted_at', { ascending: false }).limit(1),
    ])

    kpis.push({
      student,
      topicsStarted: topicsStarted ?? 0,
      exercises:     exercises ?? 0,
      correct:       correct ?? 0,
      lastActive:    lastActivity?.[0]?.attempted_at ?? null,
    })
  }

  // Aggregate stats
  const totalStudents = kpis.length
  const avgAccuracy   = kpis.length > 0
    ? Math.round(kpis.reduce((s, k) => s + calculateAccuracyPercent(k.correct, k.exercises), 0) / kpis.length)
    : 0

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
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: 'Alumnos activos', value: totalStudents, icon: Users,    color: 'text-blue-600' },
          { label: '% Acierto medio', value: `${avgAccuracy}%`, icon: BarChart3, color: 'text-green-600' },
          { label: 'Materiales',      value: 'Subir', icon: Upload,  color: 'text-purple-600', href: '/teacher/materials' },
          { label: 'Medallero',       value: 'Otorgar', icon: Trophy, color: 'text-amber-600', href: '/teacher/medallas' },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="pt-6 flex items-center gap-4">
              <div className={`p-3 rounded-lg bg-muted`}>
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
            {kpis.slice(0, 10).map(kpi => {
              const accuracy = calculateAccuracyPercent(kpi.correct, kpi.exercises)
              return (
                <div key={kpi.student.id} className="flex items-center gap-4 py-2 border-b last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {kpi.student.full_name ?? kpi.student.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {kpi.lastActive
                        ? `Activo: ${new Date(kpi.lastActive).toLocaleDateString('es-ES')}`
                        : 'Sin actividad'}
                    </p>
                  </div>
                  <div className="shrink-0 text-right text-sm space-y-1">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{kpi.topicsStarted} temas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{kpi.exercises} ejercicios</span>
                    </div>
                  </div>
                  <div className="w-24 shrink-0 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Acierto</span>
                      <span className="font-medium">{accuracy}%</span>
                    </div>
                    <Progress value={accuracy} className="h-1.5" />
                  </div>
                  <Badge
                    variant={accuracy >= 70 ? 'default' : accuracy >= 50 ? 'secondary' : 'destructive'}
                    className="shrink-0 text-xs"
                  >
                    {accuracy >= 70 ? 'Bien' : accuracy >= 50 ? 'Regular' : 'Atención'}
                  </Badge>
                </div>
              )
            })}
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

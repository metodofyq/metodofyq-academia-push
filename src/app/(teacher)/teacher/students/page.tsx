import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getStudentMetrics } from '@/lib/teacher/metrics'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, UserPlus, Pencil, BookOpen, Clock } from 'lucide-react'
import { formatDate, formatDuration } from '@/lib/utils'
import { DeleteStudentButton } from '@/components/teacher/delete-student-button'

export default async function StudentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['teacher', 'admin'].includes(profile.role)) redirect('/overview')

  const { data: students } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'student')
    .order('created_at', { ascending: false })

  const studentsWithMetrics = await Promise.all(
    (students ?? []).map(async (s) => ({ student: s, metrics: await getStudentMetrics(supabase, s.id) }))
  )

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/teacher"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Alumnos</h1>
          <p className="text-muted-foreground">{students?.length ?? 0} alumnos registrados</p>
        </div>
        <Button asChild>
          <Link href="/teacher/students/new">
            <UserPlus className="h-4 w-4 mr-2" /> Nuevo alumno
          </Link>
        </Button>
      </div>

      <div className="space-y-2">
        {studentsWithMetrics.map(({ student: s, metrics }) => (
          <Card key={s.id}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-sm">{s.full_name ?? s.email}</p>
                    {s.email_verified_at ? (
                      <Badge className="text-xs bg-green-100 text-green-800">✅ Activo</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">⏳ Pendiente</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{s.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {s.grupo && <Badge variant="outline" className="text-xs">Grupo {s.grupo}</Badge>}
                    {s.ccaa && <Badge variant="outline" className="text-xs">{s.ccaa}</Badge>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/teacher/students/${s.id}/edit`}>
                      <Pencil className="h-3.5 w-3.5 mr-1.5" /> Editar
                    </Link>
                  </Button>
                  <DeleteStudentButton studentId={s.id} studentName={s.full_name ?? s.email} />
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground border-t pt-2.5">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" /> {metrics.topicsStarted} temas
                </span>
                <span>{metrics.levelsCompleted} niveles completados</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> {formatDuration(metrics.totalDurationSeconds)} dedicado
                </span>
                {metrics.levelsCompleted > 0 && <span>{metrics.avgScore}% acierto medio</span>}
                <span className="ml-auto">
                  {metrics.lastActive ? `Activo: ${formatDate(metrics.lastActive)}` : 'Sin actividad'}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
        {(!students || students.length === 0) && (
          <p className="text-center py-8 text-muted-foreground text-sm">
            Todavía no hay alumnos. Crea el primero con &quot;Nuevo alumno&quot;.
          </p>
        )}
      </div>
    </div>
  )
}

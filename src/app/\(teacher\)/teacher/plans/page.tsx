import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import StudentPlanManager from '@/components/teacher/student-plan-manager'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default async function TeacherPlansPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['teacher', 'admin'].includes(profile.role)) redirect('/overview')

  // Obtener todos los alumnos con sus planes
  const { data: students } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'student')
    .order('created_at', { ascending: false })

  // Obtener planes de estudio para cada alumno
  const studentPlans = await Promise.all(
    (students ?? []).map(async (student) => {
      const { data: plan } = await supabase
        .from('study_plans')
        .select('id, study_plan_topics(*, topic:topics(id, code, title))')
        .eq('student_id', student.id)
        .eq('is_active', true)
        .single()

      return {
        student,
        plan,
        topics: (plan?.study_plan_topics ?? []) as any[],
      }
    })
  )

  // Obtener todos los temas disponibles
  const { data: allTopics } = await supabase
    .from('topics')
    .select('id, code, title')
    .order('code', { ascending: true })

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/teacher">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Gestionar Planes de Estudio</h1>
          <p className="text-muted-foreground">Agrega, elimina o reordena temas para cada alumno</p>
        </div>
      </div>

      {studentPlans.length === 0 ? (
        <p className="text-center py-8 text-muted-foreground">No hay alumnos registrados.</p>
      ) : (
        <div className="space-y-4">
          {studentPlans.map(({ student, topics }) => (
            <StudentPlanManager
              key={student.id}
              student={student}
              initialPlanTopics={topics}
              availableTopics={allTopics ?? []}
            />
          ))}
        </div>
      )}
    </div>
  )
}

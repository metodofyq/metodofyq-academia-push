'use server'

import { redirect } from 'next/navigation'
import { requireTeacher } from '@/lib/auth/require-teacher'
import StudentPlanManager from '@/components/teacher/student-plan-manager'

export default async function PlansPage() {
  const { error: authError, supabase } = await requireTeacher()
  if (authError) return redirect('/login')

  // Obtener todos los estudiantes
  const { data: students, error: studentsError } = await supabase
    .from('profiles')
    .select('id, full_name, email, grupo, ccaa')
    .eq('role', 'student')
    .order('full_name')

  if (studentsError) {
    return <div>Error al cargar estudiantes</div>
  }

  // Para cada estudiante, obtener su plan actual
  const studentsWithPlans = await Promise.all(
    (students || []).map(async (student) => {
      const { data: plan, error: planError } = await supabase
        .from('study_plans')
        .select('id, is_active')
        .eq('student_id', student.id)
        .eq('is_active', true)
        .maybeSingle()

      if (planError) {
        return { ...student, plan: null, topics: [] }
      }

      if (!plan) {
        return { ...student, plan: null, topics: [] }
      }

      // Obtener temas asignados al plan
      const { data: planTopics, error: topicsError } = await supabase
        .from('study_plan_topics')
        .select('*, topic:topics(*)')
        .eq('study_plan_id', plan.id)
        .order('order_index')

      if (topicsError) {
        return { ...student, plan, topics: [] }
      }

      return { ...student, plan, topics: planTopics || [] }
    })
  )

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gestión de Planes de Estudio</h1>
        <p className="text-gray-600">Administra los temas asignados a cada alumno</p>
      </div>

      <div className="space-y-4">
        {studentsWithPlans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay estudiantes registrados</p>
          </div>
        ) : (
          studentsWithPlans.map((student) => (
            <StudentPlanManager
              key={student.id}
              student={student}
              initialPlanTopics={student.topics}
              planId={student.plan?.id}
            />
          ))
        )}
      </div>
    </div>
  )
}

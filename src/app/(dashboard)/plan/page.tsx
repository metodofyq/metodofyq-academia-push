import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ActivePlanView } from '@/components/plan/active-plan-view'
import { RequestPlanChange } from '@/components/plan/request-plan-change'
import { PlanStages } from '@/components/plan/plan-stages'
import { Card, CardContent } from '@/components/ui/card'
import type { Topic, StudyPlanTopic } from '@/types'

export default async function PlanPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: activePlan }] = await Promise.all([
    supabase.from('profiles').select('full_name').eq('id', user.id).single(),
    supabase
      .from('study_plans')
      .select('*, study_plan_topics(*, topic:topics(*))')
      .eq('student_id', user.id)
      .eq('is_active', true)
      .single(),
  ])

  const requestButton = <RequestPlanChange studentName={profile?.full_name ?? null} studentEmail={user.email ?? ''} />

  if (activePlan) {
    const planTopics = (activePlan.study_plan_topics ?? []) as (StudyPlanTopic & { topic: Topic })[]
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Mi plan de estudio</h1>
            <p className="text-muted-foreground">
              Iniciado el {new Date(activePlan.started_at).toLocaleDateString('es-ES')} ·{' '}
              {planTopics.length} tema{planTopics.length !== 1 ? 's' : ''} · gestionado por el equipo docente
            </p>
          </div>
          {requestButton}
        </div>
        <PlanStages />
        <ActivePlanView plan={activePlan} planTopics={planTopics} studentId={user.id} />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Mi plan de estudio</h1>
          <p className="text-muted-foreground">Todavía no tienes un plan asignado</p>
        </div>
        {requestButton}
      </div>
      <PlanStages />
      <Card>
        <CardContent className="pt-10 pb-10 text-center space-y-3">
          <div className="text-4xl">🗓️</div>
          <p className="font-medium">Tu plan de estudio lo define el equipo docente</p>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Mientras tanto, puedes explorar los temas disponibles libremente desde{' '}
            <a href="/topics" className="text-primary hover:underline">Todos los temas</a>.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

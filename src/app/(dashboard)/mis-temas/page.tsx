import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TopicCard } from '@/components/topics/topic-card'
import { RequestPlanChange } from '@/components/plan/request-plan-change'
import { Card, CardContent } from '@/components/ui/card'
import type { Topic, TopicProgress, StudyPlanTopic } from '@/types'

export default async function MisTemasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: activePlan }, { data: progress }] = await Promise.all([
    supabase.from('profiles').select('full_name').eq('id', user.id).single(),
    supabase
      .from('study_plans')
      .select('*, study_plan_topics(*, topic:topics(*))')
      .eq('student_id', user.id)
      .eq('is_active', true)
      .single(),
    supabase.from('topic_progress').select('*').eq('student_id', user.id),
  ])

  const progressMap = new Map<string, TopicProgress>(
    (progress ?? []).map(p => [p.topic_id, p])
  )

  const planTopics = ((activePlan?.study_plan_topics ?? []) as (StudyPlanTopic & { topic: Topic })[])
    .sort((a, b) => a.order_index - b.order_index)

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Mis temas</h1>
          <p className="text-muted-foreground">
            {planTopics.length > 0
              ? `${planTopics.length} tema${planTopics.length > 1 ? 's' : ''} asignado${planTopics.length > 1 ? 's' : ''} por el equipo docente`
              : 'Todavía no tienes temas asignados'}
          </p>
        </div>
        <RequestPlanChange studentName={profile?.full_name ?? null} studentEmail={user.email ?? ''} />
      </div>

      {planTopics.length > 0 ? (
        <div className="space-y-2">
          {planTopics.map((pt) => {
            const p = progressMap.get(pt.topic.id)
            return (
              <TopicCard key={pt.id} topic={pt.topic} unlocked={p?.is_unlocked ?? false} level={p?.current_level ?? 0} />
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-10 pb-10 text-center space-y-3">
            <div className="text-4xl">🎯</div>
            <p className="font-medium">Todavía no tienes temas asignados</p>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              El equipo docente definirá los temas de tu plan. Mientras tanto, puedes explorar
              libremente en <a href="/topics" className="text-primary hover:underline">Todos los temas</a>.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TopicCard } from '@/components/topics/topic-card'
import type { Topic, TopicProgress } from '@/types'

export default async function TopicsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: topics }, { data: progress }] = await Promise.all([
    supabase.from('topics').select('*').order('order_index'),
    supabase.from('topic_progress').select('*').eq('student_id', user.id),
  ])

  const progressMap = new Map<string, TopicProgress>(
    (progress ?? []).map(p => [p.topic_id, p])
  )

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Todos los temas</h1>
        <p className="text-muted-foreground">Temario oficial completo ({(topics ?? []).length} temas)</p>
      </div>

      <div className="space-y-2">
        {(topics ?? []).map((topic: Topic) => {
          const p = progressMap.get(topic.id)
          return (
            <TopicCard key={topic.id} topic={topic} unlocked={p?.is_unlocked ?? false} level={p?.current_level ?? 0} />
          )
        })}
      </div>
    </div>
  )
}

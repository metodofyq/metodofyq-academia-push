import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn, getSubjectColor, getLevelColor } from '@/lib/utils'
import { Lock, CheckCircle2, BookOpen } from 'lucide-react'
import type { Topic, TopicProgress } from '@/types'
import { levelLabel } from '@/types'

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

  const bySubject = (subject: string) => (topics ?? []).filter(t => t.subject === subject)

  const totalUnlocked = (progress ?? []).filter(p => p.is_unlocked).length

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Todos los temas</h1>
          <p className="text-muted-foreground">
            {totalUnlocked} de 75 temas desbloqueados
          </p>
        </div>
        <Link href="/plan" className="text-sm text-primary hover:underline">
          Gestionar mi plan →
        </Link>
      </div>

      <Progress value={(totalUnlocked / 75) * 100} className="h-2" />

      {[
        { label: 'Física',      topics: bySubject('fisica'),   subject: 'fisica' },
        { label: 'Química',     topics: bySubject('quimica'),  subject: 'quimica' },
        { label: 'Geología',    topics: bySubject('geologia'), subject: 'geologia' },
        { label: 'Biología',    topics: bySubject('biologia'), subject: 'biologia' },
        { label: 'Transversal', topics: bySubject('general'),  subject: 'general' },
      ].filter(section => section.topics.length > 0).map(section => (
        <section key={section.subject}>
          <h2 className="text-lg font-semibold mb-4">
            {section.label}
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({section.topics.length} temas)
            </span>
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {section.topics.map(topic => {
              const p = progressMap.get(topic.id)
              const unlocked = p?.is_unlocked ?? false
              const level = p?.current_level ?? 0

              return (
                <Link
                  key={topic.id}
                  href={unlocked ? `/topics/${topic.id}` : '#'}
                  className={cn(!unlocked && 'pointer-events-none')}
                >
                  <Card className={cn(
                    'h-full transition-shadow hover:shadow-md',
                    unlocked ? 'cursor-pointer' : 'opacity-60'
                  )}>
                    <CardContent className="p-4 flex gap-3">
                      <div className="shrink-0 mt-0.5">
                        {unlocked
                          ? level >= 4
                            ? <CheckCircle2 className="h-5 w-5 text-green-500" />
                            : <BookOpen className="h-5 w-5 text-primary" />
                          : <Lock className="h-5 w-5 text-muted-foreground" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                          <Badge variant="outline" className="text-xs px-1.5 py-0 font-mono">
                            {topic.code}
                          </Badge>
                          {unlocked && (
                            <Badge className={cn('text-xs px-1.5 py-0', getLevelColor(level))}>
                              {levelLabel(level)}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm font-medium leading-snug line-clamp-2">
                          {topic.title}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}

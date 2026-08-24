import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ExerciseSession } from '@/components/exercises/exercise-session'
import { NivelesGrid } from '@/components/niveles/niveles-grid'
import { getLevelColor, getSubjectColor } from '@/lib/utils'
import { levelLabel, SUBJECT_LABELS } from '@/types'
import type { Exercise } from '@/types'

interface Props {
  params: Promise<{ topicId: string }>
  searchParams: Promise<{ task?: string }>
}

export default async function TopicPage({ params, searchParams }: Props) {
  const { topicId } = await params
  const { task: taskId } = await searchParams

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: topic }, { data: profile }, { data: progress }, { data: levels }] = await Promise.all([
    supabase.from('topics').select('*').eq('id', topicId).single(),
    supabase.from('profiles').select('grupo').eq('id', user.id).single(),
    supabase.from('topic_progress').select('*').eq('student_id', user.id).eq('topic_id', topicId).single(),
    supabase.from('topic_levels').select('*').eq('topic_id', topicId).order('level'),
  ])

  if (!topic) notFound()

  const currentLevel = progress?.current_level ?? 0
  const isUnlocked   = progress?.is_unlocked ?? false
  const esInteractivo = (levels ?? []).some((l) => Number(l.level) === 0.5 || Number(l.level) === 2.5)

  // If coming from a daily task, get those specific exercises
  let exercises: Exercise[] = []
  if (taskId) {
    const { data: task } = await supabase
      .from('daily_tasks')
      .select('exercise_ids')
      .eq('id', taskId)
      .eq('student_id', user.id)
      .single()

    if (task?.exercise_ids?.length) {
      const { data: ex } = await supabase
        .from('exercises')
        .select('*')
        .in('id', task.exercise_ids)
      exercises = (ex ?? []) as Exercise[]
    }
  } else {
    const { data: ex } = await supabase
      .from('exercises')
      .select('*')
      .eq('topic_id', topicId)
      .lte('level', currentLevel + 1)
      .eq('is_active', true)
      .limit(10)
    exercises = (ex ?? []) as Exercise[]
  }

  const activeLevel = levels?.find(l => l.level === currentLevel)

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="font-mono">{topic.code}</Badge>
          <Badge className={getSubjectColor(topic.subject)}>
            {SUBJECT_LABELS[topic.subject]}
          </Badge>
          <Badge className={getLevelColor(currentLevel)}>
            {levelLabel(currentLevel)}
          </Badge>
        </div>
        <h1 className="text-2xl font-bold">{topic.title}</h1>
        {topic.description && (
          <p className="text-muted-foreground mt-1">{topic.description}</p>
        )}
      </div>

      {esInteractivo ? (
        <NivelesGrid topicId={topicId} currentLevel={Number(currentLevel)} incluirNivel4={profile?.grupo === 2} />
      ) : (
        <>
          {/* Level progress */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progreso del nivel</span>
                <span className="text-sm text-muted-foreground">{currentLevel}/4</span>
              </div>
              <Progress value={(currentLevel / 4) * 100} />
              <div className="mt-3 flex gap-1.5">
                {[0, 1, 2, 3, 4].map(l => (
                  <div
                    key={l}
                    className={`flex-1 h-1.5 rounded-full ${l <= currentLevel ? 'bg-primary' : 'bg-muted'}`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Theory content */}
          {activeLevel && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{activeLevel.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {activeLevel.content_md ? (
                  <div className="prose prose-sm max-w-none text-sm leading-relaxed whitespace-pre-wrap">
                    {activeLevel.content_md}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    El contenido teórico para este nivel está siendo preparado por el equipo docente.
                  </p>
                )}
                {activeLevel.video_url && (
                  <div className="mt-4">
                    <a
                      href={activeLevel.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      Ver vídeo explicativo →
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Exercises */}
          {exercises.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-4">
                Ejercicios ({exercises.length})
              </h2>
              <ExerciseSession
                exercises={exercises}
                topicId={topicId}
                taskId={taskId}
              />
            </section>
          )}
        </>
      )}
    </div>
  )
}

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn, getLevelColor } from '@/lib/utils'
import { CheckCircle2, BookOpen } from 'lucide-react'
import { levelLabel } from '@/types'
import type { Topic } from '@/types'

interface Props {
  topic: Topic
  unlocked: boolean
  level: number
}

export function TopicCard({ topic, unlocked, level }: Props) {
  return (
    <Link href={`/topics/${topic.id}`}>
      <Card className="transition-shadow hover:shadow-md cursor-pointer">
        <CardContent className="p-4 flex gap-3">
          <div className="shrink-0 mt-0.5">
            {level >= 4
              ? <CheckCircle2 className="h-5 w-5 text-green-500" />
              : <BookOpen className="h-5 w-5 text-primary" />
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
            <p className="text-sm font-medium leading-snug">
              {topic.title}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

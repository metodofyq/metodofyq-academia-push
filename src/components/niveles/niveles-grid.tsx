import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { NIVEL_ORDER, nivelMeta, nivelKey } from '@/lib/niveles/constants'

interface Props {
  topicId: string
  currentLevel: number
  incluirNivel4: boolean
}

// Acceso libre: el opositor elige qué nivel abrir, en cualquier orden.
// "siguiente" es solo una recomendación (el próximo nivel según su progreso).
export function NivelesGrid({ topicId, currentLevel, incluirNivel4 }: Props) {
  const niveles = NIVEL_ORDER.filter((n) => n !== 4 || incluirNivel4)

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-3 font-medium">
        Acceso a cada nivel:
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {niveles.map((nivel) => {
          const meta = nivelMeta(nivel)
          const esActual = Math.abs(nivel - currentLevel) < 0.01

          return (
            <Link key={nivelKey(nivel)} href={`/topics/${topicId}/nivel/${nivel}`}>
              <Card className={cn('h-full border-l-4 transition-shadow hover:shadow-md cursor-pointer', meta.border)}>
                <CardContent className="p-4 flex flex-col gap-1.5 min-h-[104px]">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{meta.emoji}</span>
                    <span className={cn('text-[10px] font-extrabold tracking-wide text-white rounded-full px-2 py-0.5', meta.badge)}>
                      {meta.corto.toUpperCase()}
                    </span>
                    {esActual && (
                      <span className="ml-auto text-[10px] font-semibold text-muted-foreground">
                        recomendado
                      </span>
                    )}
                  </div>
                  <div className="font-semibold text-sm">{meta.label}</div>
                  <div className="text-xs text-muted-foreground leading-snug">{meta.titulo}</div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

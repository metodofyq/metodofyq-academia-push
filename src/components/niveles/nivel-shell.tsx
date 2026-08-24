import { cn } from '@/lib/utils'
import { nivelMeta } from '@/lib/niveles/constants'

interface Props {
  nivel: number
  titulo?: string
  desc?: string
  children: React.ReactNode
}

export function NivelShell({ nivel, titulo, desc, children }: Props) {
  const meta = nivelMeta(nivel)
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div>
        <span className={cn('inline-block text-white rounded-full px-3 py-0.5 text-xs font-bold mb-2', meta.badge)}>
          {meta.label}
        </span>
        <h2 className="text-xl font-bold">{titulo ?? meta.titulo}</h2>
        <p className="text-muted-foreground text-sm mt-1">{desc ?? meta.desc}</p>
      </div>
      {children}
    </div>
  )
}

import { cn } from '@/lib/utils'
import { nivelMeta } from '@/lib/niveles/constants'

interface Props {
  nivel: number
  temaCode?: string
  temaTitulo?: string
  titulo?: string
  desc?: string
  children: React.ReactNode
}

export function NivelShell({ nivel, temaCode, temaTitulo, titulo, desc, children }: Props) {
  const meta = nivelMeta(nivel)
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div>
        {temaTitulo && (
          <div className="mb-3 pb-3 border-b">
            {temaCode && <p className="text-xs font-semibold text-muted-foreground">{temaCode}</p>}
            <p className="text-sm font-medium text-slate-700 leading-snug">{temaTitulo}</p>
          </div>
        )}
        <span className={cn('inline-block text-white rounded-full px-3 py-0.5 text-xs font-bold mb-2', meta.badge)}>
          {meta.corto}
        </span>
        <h2 className="text-xl font-bold">{meta.label}</h2>
        <p className="text-sm text-slate-500 mt-0.5">{titulo ?? meta.titulo}</p>
        <p className="text-muted-foreground text-sm mt-1">{desc ?? meta.desc}</p>
      </div>
      {children}
    </div>
  )
}

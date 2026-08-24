import { NivelShell } from './nivel-shell'

interface Props {
  grupo: number | null
  ccaa: string | null
  contenido: string | null
}

export function LegislacionNivel4({ grupo, ccaa, contenido }: Props) {
  return (
    <NivelShell nivel={4}>
      {grupo !== 2 ? (
        <p className="text-sm text-muted-foreground bg-slate-50 border rounded-xl p-4">
          Este nivel no aplica a tu grupo de oposición.
        </p>
      ) : !ccaa ? (
        <p className="text-sm text-muted-foreground bg-slate-50 border rounded-xl p-4">
          Configura tu comunidad autónoma en tu perfil para ver la legislación aplicable.
        </p>
      ) : contenido ? (
        <div className="bg-white border rounded-xl p-4 text-sm leading-relaxed whitespace-pre-wrap">
          {contenido}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground bg-slate-50 border rounded-xl p-4">
          Contenido en preparación para {ccaa}.
        </p>
      )}
    </NivelShell>
  )
}

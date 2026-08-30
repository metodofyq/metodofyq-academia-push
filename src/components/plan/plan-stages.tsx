import { Card, CardContent } from '@/components/ui/card'
import { BookOpen, RotateCcw } from 'lucide-react'

const ETAPAS = [
  {
    numero: 1,
    icon: BookOpen,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    titulo: 'Estudio de todos los temas',
    desc: '1 tema nuevo por semana, hasta finales de enero.',
  },
  {
    numero: 2,
    icon: RotateCcw,
    color: 'text-green-600',
    bg: 'bg-green-50',
    titulo: 'Repaso de los temas',
    desc: 'A partir de febrero, repaso continuo de todo el temario.',
  },
]

export function PlanStages() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {ETAPAS.map((e) => (
        <Card key={e.numero}>
          <CardContent className="pt-5 pb-5 flex gap-3">
            <div className={`h-9 w-9 rounded-full ${e.bg} flex items-center justify-center shrink-0`}>
              <e.icon className={`h-4.5 w-4.5 ${e.color}`} />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Etapa {e.numero}</p>
              <p className="font-medium text-sm">{e.titulo}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{e.desc}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

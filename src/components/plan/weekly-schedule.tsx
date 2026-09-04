'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const WEEKLY_SCHEDULE = [
  { day: 'Lunes', niveles: [0, 0.5, 1, 2], emoji: '📖' },
  { day: 'Martes', niveles: [1, 2.5], emoji: '📚' },
  { day: 'Miércoles', niveles: [3], emoji: '✍️' },
  { day: 'Jueves', niveles: [1, 2.5, 2], emoji: '🔄' },
  { day: 'Viernes', niveles: [1, 3.5], emoji: '💭' },
  { day: 'Sábado', niveles: ['Simulacro'], emoji: '📋' },
  { day: 'Domingo', niveles: ['Descanso'], emoji: '☀️' },
]

const NIVEL_LABELS: Record<string | number, string> = {
  0: 'Índice',
  0.5: 'Infografía',
  1: 'Palabras clave',
  2: 'Conceptos',
  2.5: 'Tarjetas',
  3: 'Redacción',
  3.5: 'Reconstrucción',
  'Simulacro': 'Simulacro',
  'Descanso': 'Sin tarea',
}

export function WeeklySchedule() {
  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-violet-50">
        <CardTitle className="flex items-center gap-2">
          📅 Secuencia Semanal de Tareas
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-2">
          Programa de aprendizaje estructurado por día
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {WEEKLY_SCHEDULE.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg hover:shadow-md transition-shadow"
            >
              {/* Día + Emoji */}
              <div className="flex items-center gap-2 font-semibold text-sm">
                <span className="text-lg">{item.emoji}</span>
                <span className="text-slate-900">{item.day}</span>
              </div>

              {/* Niveles */}
              <div className="flex flex-wrap gap-1.5">
                {item.niveles.map((nivel, ni) => (
                  <div
                    key={ni}
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                      typeof nivel === 'string'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : nivel === 0
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : nivel === 0.5
                            ? 'bg-sky-50 text-sky-800 border-sky-200'
                            : nivel === 1
                              ? 'bg-violet-50 text-violet-800 border-violet-200'
                              : nivel === 2
                                ? 'bg-orange-50 text-orange-800 border-orange-200'
                                : nivel === 2.5
                                  ? 'bg-cyan-50 text-cyan-800 border-cyan-200'
                                  : nivel === 3
                                    ? 'bg-green-50 text-green-800 border-green-200'
                                    : 'bg-teal-50 text-teal-800 border-teal-200'
                    }`}
                  >
                    {typeof nivel === 'string' ? nivel : `N${nivel}`}
                  </div>
                ))}
              </div>

              {/* Descripción */}
              <div className="text-xs text-slate-600 mt-1">
                {item.niveles.map((n) => NIVEL_LABELS[n]).join(' + ')}
              </div>
            </div>
          ))}
        </div>

        {/* Leyenda */}
        <div className="mt-6 pt-4 border-t border-slate-200">
          <p className="text-xs font-semibold text-slate-700 mb-3">Niveles disponibles:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div>N0 = Índice</div>
            <div>N0.5 = Infografía</div>
            <div>N1 = Palabras clave</div>
            <div>N2 = Conceptos</div>
            <div>N2.5 = Tarjetas</div>
            <div>N3 = Redacción</div>
            <div>N3.5 = Reconstrucción</div>
            <div>Simulacro = Examen</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

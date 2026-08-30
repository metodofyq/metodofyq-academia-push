import { addDays, format, isSameDay, isAfter, startOfDay, startOfWeek } from 'date-fns'
import { es } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { nivelesDelDia } from '@/lib/dashboard/schedule'

interface Props {
  // fecha (yyyy-MM-dd) -> lista de niveles con level_attempts ese día
  attemptsByDate: Record<string, number[]>
}

const DIA_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

export function WeekCalendar({ attemptsByDate }: Props) {
  const today = startOfDay(new Date())
  const currentMonday = startOfWeek(today, { weekStartsOn: 1 })
  const start = addDays(currentMonday, -7) // lunes de la semana anterior

  const dias = Array.from({ length: 21 }, (_, i) => addDays(start, i))
  const semanas = [dias.slice(0, 7), dias.slice(7, 14), dias.slice(14, 21)]
  const etiquetasSemana = ['Semana anterior', 'Esta semana', 'Semana siguiente']

  return (
    <div className="space-y-4">
      {semanas.map((semana, si) => (
        <div key={si}>
          <p className="text-xs font-medium text-muted-foreground mb-1.5">{etiquetasSemana[si]}</p>
          <div className="grid grid-cols-7 gap-1.5">
            {semana.map((dia, di) => (
              <DiaCelda key={di} dia={dia} today={today} attemptsByDate={attemptsByDate} />
            ))}
          </div>
        </div>
      ))}
      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground pt-1">
        <Leyenda color="bg-green-500" label="Todas las tareas" />
        <Leyenda color="bg-yellow-400" label="Algunas tareas" />
        <Leyenda color="bg-red-400" label="Ninguna tarea" />
        <Leyenda color="bg-slate-300" label="Hoy" />
        <Leyenda color="bg-slate-100 border" label="Descanso / sin datos" />
      </div>
    </div>
  )
}

function Leyenda({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn('h-2.5 w-2.5 rounded-full', color)} />
      {label}
    </span>
  )
}

function DiaCelda({ dia, today, attemptsByDate }: { dia: Date; today: Date; attemptsByDate: Record<string, number[]> }) {
  const key = format(dia, 'yyyy-MM-dd')
  const esHoy = isSameDay(dia, today)
  const esFuturo = isAfter(dia, today) && !esHoy
  const programados = nivelesDelDia(dia)
  const hechos = attemptsByDate[key] ?? []
  const numHechos = programados.filter((n) => hechos.includes(n)).length

  let claseFondo = 'bg-slate-100 border border-slate-200'
  if (esHoy) claseFondo = 'bg-slate-300'
  else if (esFuturo) claseFondo = 'bg-slate-50 border border-dashed border-slate-200'
  else if (programados.length === 0) claseFondo = 'bg-slate-100 border border-slate-200'
  else if (numHechos === 0) claseFondo = 'bg-red-400'
  else if (numHechos < programados.length) claseFondo = 'bg-yellow-400'
  else claseFondo = 'bg-green-500'

  const claseTexto = esFuturo || (programados.length === 0 && !esHoy)
    ? 'text-slate-400'
    : esHoy || (!esFuturo && programados.length > 0)
      ? 'text-white'
      : 'text-slate-600'

  return (
    <div
      className={cn('rounded-md py-1.5 text-center', claseFondo)}
      title={format(dia, "EEEE d 'de' MMMM", { locale: es })}
    >
      <div className={cn('text-[10px] font-medium', claseTexto)}>{DIA_LABELS[(dia.getDay() + 6) % 7]}</div>
      <div className={cn('text-xs font-bold', claseTexto)}>{format(dia, 'd')}</div>
    </div>
  )
}

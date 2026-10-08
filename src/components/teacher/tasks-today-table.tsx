'use client'

import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface TaskEntry {
  studentId: string
  studentName: string
  studentEmail: string
  topicCode: string | null
  topicTitle: string | null
  dayOfWeek: string
  programmeLevels: number[]
  completedLevels: number[]
  pendingLevels: number[]
  progressPercent: number
}

interface TasksTodayTableProps {
  date: string
  dayOfWeek: string
  group: number
  tasks: TaskEntry[]
}

export function TasksTodayTable({ date, dayOfWeek, group, tasks }: TasksTodayTableProps) {
  const dateObj = new Date(date)
  const dateFormatted = format(dateObj, "EEEE d 'de' MMMM, yyyy", { locale: es })

  const getStatusColor = (progressPercent: number) => {
    if (progressPercent === 100) return 'bg-green-100 text-green-800'
    if (progressPercent > 0) return 'bg-yellow-100 text-yellow-800'
    if (progressPercent === 0 && tasks[0]?.programmeLevels.length === 0) return 'bg-gray-100 text-gray-600'
    return 'bg-red-100 text-red-800'
  }

  const getStatusDot = (progressPercent: number) => {
    if (progressPercent === 100) return '🟢'
    if (progressPercent > 0) return '🟡'
    if (progressPercent === 0 && tasks[0]?.programmeLevels.length === 0) return '⚪'
    return '🔴'
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">Tareas de Hoy</h2>
        <p className="text-sm text-muted-foreground">
          {dateFormatted} • Grupo {group} • {dayOfWeek.toUpperCase()}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {tasks.length} alumno{tasks.length !== 1 ? 's' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-semibold">Alumno</th>
                  <th className="text-left py-3 px-2 font-semibold">Tema Actual</th>
                  <th className="text-center py-3 px-2 font-semibold">Programados</th>
                  <th className="text-center py-3 px-2 font-semibold">Completados</th>
                  <th className="text-center py-3 px-2 font-semibold">Pendientes</th>
                  <th className="text-center py-3 px-2 font-semibold">Progreso</th>
                  <th className="text-center py-3 px-2 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.studentId} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-2">
                      <div>
                        <p className="font-medium">{task.studentName}</p>
                        <p className="text-xs text-muted-foreground">{task.studentEmail}</p>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      {task.topicCode ? (
                        <div>
                          <p className="font-medium text-sm">{task.topicCode}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-xs">
                            {task.topicTitle}
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground italic">Sin tema</p>
                      )}
                    </td>
                    <td className="py-3 px-2 text-center">
                      {task.programmeLevels.length > 0 ? (
                        <span className="font-mono text-xs bg-blue-50 px-2 py-1 rounded">
                          [{task.programmeLevels.join(', ')}]
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-center">
                      {task.completedLevels.length > 0 ? (
                        <span className="font-mono text-xs bg-green-50 px-2 py-1 rounded text-green-800">
                          {task.completedLevels.join(', ')}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-center">
                      {task.pendingLevels.length > 0 ? (
                        <span className="font-mono text-xs bg-red-50 px-2 py-1 rounded text-red-800">
                          {task.pendingLevels.join(', ')}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">✓</span>
                      )}
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <Progress value={task.progressPercent} className="w-20" />
                        <span className="text-xs font-medium w-10">{task.progressPercent}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className="text-lg" title={
                        task.progressPercent === 100 ? 'Completadas' :
                        task.progressPercent > 0 ? 'En progreso' :
                        task.programmeLevels.length === 0 ? 'Sin tareas' :
                        'Pendientes'
                      }>
                        {getStatusDot(task.progressPercent)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <span>🟢</span> Todas las tareas completadas
        </span>
        <span className="flex items-center gap-2">
          <span>🟡</span> Algunas tareas completadas
        </span>
        <span className="flex items-center gap-2">
          <span>🔴</span> Sin completar
        </span>
        <span className="flex items-center gap-2">
          <span>⚪</span> Sin tareas programadas
        </span>
      </div>
    </div>
  )
}

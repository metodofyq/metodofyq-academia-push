'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, TrendingUp } from 'lucide-react'
import { formatDuration } from '@/lib/dashboard/study-timer'

interface TopicTimeData {
  topicId: string
  topicCode: string
  topicTitle: string
  totalMinutes: number
  totalHours: number
  sessionCount: number
}

interface StudentAnalytics {
  studentId: string
  studentName: string
  studentEmail: string
  totalMinutes: number
  totalHours: number
  sessionCount: number
  byTopic: TopicTimeData[]
}

interface StudyTimeAnalyticsProps {
  group: number
  analytics: StudentAnalytics[]
  groupStats: {
    totalMinutes: number
    totalHours: number
    averageMinutesPerStudent: number
    averageHoursPerStudent: number
  }
}

export function StudyTimeAnalytics({ group, analytics, groupStats }: StudyTimeAnalyticsProps) {
  if (analytics.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">No hay datos de tiempo de estudio aún.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Group statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Grupo</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{groupStats.totalHours}h</div>
            <p className="text-xs text-muted-foreground">
              {groupStats.totalMinutes} minutos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio/Alumno</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{groupStats.averageHoursPerStudent}h</div>
            <p className="text-xs text-muted-foreground">
              {groupStats.averageMinutesPerStudent} minutos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alumnos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sesiones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.reduce((sum, a) => sum + a.sessionCount, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tiempo por Alumno</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-semibold">Alumno</th>
                  <th className="text-right py-3 px-2 font-semibold">Horas</th>
                  <th className="text-right py-3 px-2 font-semibold">Minutos</th>
                  <th className="text-right py-3 px-2 font-semibold">Sesiones</th>
                  <th className="text-left py-3 px-2 font-semibold">Temas Estudiados</th>
                </tr>
              </thead>
              <tbody>
                {analytics.map((student) => (
                  <tr key={student.studentId} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-2">
                      <div>
                        <p className="font-medium">{student.studentName}</p>
                        <p className="text-xs text-muted-foreground">{student.studentEmail}</p>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <span className="font-semibold">{student.totalHours}h</span>
                    </td>
                    <td className="py-3 px-2 text-right text-muted-foreground">
                      {student.totalMinutes}m
                    </td>
                    <td className="py-3 px-2 text-right">
                      <span className="bg-blue-50 px-2 py-1 rounded text-xs font-medium">
                        {student.sessionCount}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="space-y-1">
                        {student.byTopic.length > 0 ? (
                          student.byTopic.map((topic) => (
                            <div
                              key={topic.topicId}
                              className="flex items-center justify-between text-xs"
                            >
                              <span className="font-mono text-gray-600">{topic.topicCode}</span>
                              <span className="text-gray-500">{topic.totalHours}h</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-muted-foreground italic">Sin actividad</p>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

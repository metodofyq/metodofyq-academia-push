'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trash2, Plus, GripVertical, ArrowUp, ArrowDown } from 'lucide-react'
import { addTopicToStudentPlan, removeTopicFromStudentPlan, reorderStudentPlanTopics, updateTopicScheduleDate } from '@/lib/actions/plans'

interface PlanTopic {
  id: string
  topic_id: string
  order_index: number
  scheduled_date: string | null
  topic?: { code: string; title: string }
}

interface Topic {
  id: string
  code: string
  title: string
}

interface EditStudentPlanProps {
  studentId: string
  studentName: string
  currentTopics: PlanTopic[]
  availableTopics: Topic[]
  onClose: () => void
}

export function EditStudentPlan({
  studentId,
  studentName,
  currentTopics,
  availableTopics,
  onClose,
}: EditStudentPlanProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [topics, setTopics] = useState<PlanTopic[]>(currentTopics)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedTopicId, setSelectedTopicId] = useState('')
  const [selectedDate, setSelectedDate] = useState('')

  const assignedTopicIds = new Set(topics.map(t => t.topic_id))
  const unassignedTopics = availableTopics.filter(t => !assignedTopicIds.has(t.id))

  function handleAddTopic() {
    if (!selectedTopicId || !selectedDate) return

    startTransition(async () => {
      const result = await addTopicToStudentPlan(studentId, selectedTopicId, selectedDate)
      if (!result?.error) {
        setSelectedTopicId('')
        setSelectedDate('')
        setShowAddModal(false)
        // Refrescar página después de agregar
        router.refresh()
      }
    })
  }

  function handleRemoveTopic(topicId: string) {
    startTransition(async () => {
      const result = await removeTopicFromStudentPlan(studentId, topicId)
      if (!result?.error) {
        router.refresh()
      }
    })
  }

  function handleUpdateDate(topicId: string, newDate: string) {
    startTransition(async () => {
      const result = await updateTopicScheduleDate(studentId, topicId, newDate)
      if (!result?.error) {
        router.refresh()
      }
    })
  }

  function handleReorder(fromIndex: number, toIndex: number) {
    const newTopics = [...topics]
    const [moved] = newTopics.splice(fromIndex, 1)
    newTopics.splice(toIndex, 0, moved)

    const reordered = newTopics.map((t, idx) => ({ ...t, order_index: idx + 1 }))
    setTopics(reordered)

    startTransition(async () => {
      const result = await reorderStudentPlanTopics(
        studentId,
        reordered.map(t => ({ topicId: t.topic_id, orderIndex: t.order_index }))
      )
      if (!result?.error) {
        router.refresh()
      }
    })
  }

  function handleMoveUp(idx: number) {
    if (idx > 0) {
      handleReorder(idx, idx - 1)
    }
  }

  function handleMoveDown(idx: number) {
    if (idx < topics.length - 1) {
      handleReorder(idx, idx + 1)
    }
  }

  return (
    <div className="space-y-6">
      {/* Temas actuales */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Plan de Estudio Actual</CardTitle>
            <Badge>{topics.length} temas</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {topics.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin temas asignados</p>
          ) : (
            <div className="space-y-2">
              {topics.map((topic, idx) => (
                <div
                  key={topic.id}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50"
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">
                      {idx + 1}. {topic.topic?.code} - {topic.topic?.title}
                    </div>
                    <Input
                      type="date"
                      value={topic.scheduled_date || ''}
                      onChange={e => handleUpdateDate(topic.topic_id, e.target.value)}
                      className="h-8 text-xs mt-1"
                      disabled={pending}
                    />
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMoveUp(idx)}
                      disabled={pending || idx === 0}
                      title="Mover hacia arriba"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMoveDown(idx)}
                      disabled={pending || idx === topics.length - 1}
                      title="Mover hacia abajo"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveTopic(topic.topic_id)}
                      disabled={pending}
                      title="Eliminar tema"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Agregar tema */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Agregar Tema</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showAddModal ? (
            <Button onClick={() => setShowAddModal(true)} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Tema
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Tema a agregar</Label>
                <select
                  value={selectedTopicId}
                  onChange={e => setSelectedTopicId(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  disabled={pending}
                >
                  <option value="">— Selecciona un tema —</option>
                  {unassignedTopics.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.code} - {t.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Fecha de inicio</Label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  disabled={pending}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddModal(false)
                    setSelectedTopicId('')
                    setSelectedDate('')
                  }}
                  disabled={pending}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleAddTopic}
                  disabled={pending || !selectedTopicId || !selectedDate}
                  className="flex-1"
                >
                  Agregar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Botón cerrar */}
      <Button onClick={onClose} variant="outline" className="w-full">
        Cerrar
      </Button>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { updateStudentPlan } from '@/lib/actions/plans'
import { Database } from '@/types/database'

interface StudentPlanModalProps {
  student: {
    id: string
    full_name: string
  }
  planId?: string
  initialTopics: any[]
  onClose: () => void
  onUpdating: (loading: boolean) => void
}

interface Topic {
  id: string
  code: string
  title: string
}

export default function StudentPlanModal({
  student,
  planId,
  initialTopics,
  onClose,
  onUpdating,
}: StudentPlanModalProps) {
  const [topics, setTopics] = useState<Topic[]>([])
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchTopics()
  }, [])

  async function fetchTopics() {
    try {
      const response = await fetch('/api/teacher/topics')
      if (!response.ok) throw new Error('Failed to fetch topics')
      const data = await response.json()
      setTopics(data)

      // Preseleccionar los temas actuales
      const currentIds = initialTopics.map((t: any) => t.topic_id)
      setSelectedTopicIds(currentIds)
    } catch (err) {
      setError('Error al cargar los temas')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!planId) {
      setError('Plan no encontrado')
      return
    }

    setSaving(true)
    onUpdating(true)

    try {
      const result = await updateStudentPlan(student.id, selectedTopicIds)

      if (result.error) {
        setError(result.error)
      } else {
        onClose()
      }
    } catch (err) {
      setError('Error al guardar el plan')
    } finally {
      setSaving(false)
      onUpdating(false)
    }
  }

  function toggleTopic(topicId: string) {
    setSelectedTopicIds((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId]
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Editar plan de {student.full_name}</h2>
          <button
            onClick={onClose}
            disabled={saving}
            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        <div className="p-4">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Cargando temas...</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-4">Selecciona los temas a asignar:</p>
              {topics.map((topic) => (
                <label
                  key={topic.id}
                  className="flex items-start gap-3 p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedTopicIds.includes(topic.id)}
                    onChange={() => toggleTopic(topic.id)}
                    disabled={saving}
                    className="mt-1 w-4 h-4"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{topic.code}</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{topic.title}</p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t p-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}

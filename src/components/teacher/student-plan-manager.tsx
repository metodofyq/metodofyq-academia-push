'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EditStudentPlan } from './edit-student-plan'

interface Topic {
  id: string
  code: string
  title?: string
}

interface PlanTopic {
  id: string
  topic_id: string
  order_index: number
  scheduled_date: string | null
  topic?: Topic
}

interface StudentPlanManagerProps {
  student: {
    id: string
    full_name: string
    email: string
    grupo: number
    ccaa: string
  }
  initialPlanTopics: PlanTopic[]
  availableTopics: Topic[]
}

export default function StudentPlanManager({
  student,
  initialPlanTopics,
  availableTopics,
}: StudentPlanManagerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [topics, setTopics] = useState(initialPlanTopics)

  const handleClose = () => {
    setIsOpen(false)
    // Refresh de temas (aquí se refrescaría en una app real)
  }

  return (
    <>
      <Card className="hover:shadow-sm transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{student.full_name}</h3>
              <p className="text-sm text-muted-foreground">{student.email}</p>
              <div className="mt-2 flex items-center gap-3 text-sm">
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                  Grupo {student.grupo}
                </span>
                <span className="text-muted-foreground">{student.ccaa}</span>
              </div>

              {topics.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Temas asignados:</p>
                  <div className="flex gap-2 flex-wrap">
                    {topics
                      .sort((a, b) => a.order_index - b.order_index)
                      .map((item, idx) => (
                        <div key={item.id} className="text-xs">
                          <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded font-medium">
                            {idx + 1}. {item.topic?.code}
                          </span>
                          {item.scheduled_date && (
                            <span className="text-xs text-muted-foreground ml-1">
                              ({new Date(item.scheduled_date).toLocaleDateString()})
                            </span>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            <Button onClick={() => setIsOpen(true)} className="whitespace-nowrap">
              Editar plan
            </Button>
          </div>
        </CardContent>
      </Card>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardContent className="pt-6">
              <EditStudentPlan
                studentId={student.id}
                studentName={student.full_name}
                currentTopics={topics}
                availableTopics={availableTopics}
                onClose={handleClose}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}

'use client'

import { useState } from 'react'
import { Database } from '@/types/database'
import StudentPlanModal from './student-plan-modal'

interface StudentPlanManagerProps {
  student: {
    id: string
    full_name: string
    email: string
    grupo: number
    ccaa: string
  }
  initialPlanTopics: any[]
  planId?: string
}

export default function StudentPlanManager({
  student,
  initialPlanTopics,
  planId,
}: StudentPlanManagerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{student.full_name}</h3>
            <p className="text-sm text-gray-600">{student.email}</p>
            <div className="mt-2 flex items-center gap-3 text-sm">
              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded">
                Grupo {student.grupo}
              </span>
              <span className="text-gray-600">{student.ccaa}</span>
            </div>
            {initialPlanTopics.length > 0 && (
              <div className="mt-3 flex gap-2 flex-wrap">
                {initialPlanTopics.map((item: any) => (
                  <span
                    key={item.id}
                    className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded"
                  >
                    {item.topics?.code}
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm"
          >
            Editar plan
          </button>
        </div>
      </div>

      {isOpen && (
        <StudentPlanModal
          student={student}
          planId={planId}
          initialTopics={initialPlanTopics}
          onClose={() => setIsOpen(false)}
          onUpdating={setIsUpdating}
        />
      )}
    </>
  )
}

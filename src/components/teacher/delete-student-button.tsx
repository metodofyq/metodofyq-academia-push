'use client'

import { useState } from 'react'
import { deleteStudent } from '@/lib/actions/students'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Trash2 } from 'lucide-react'

interface DeleteStudentButtonProps {
  studentId: string
  studentName: string
}

export function DeleteStudentButton({ studentId, studentName }: DeleteStudentButtonProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    setLoading(true)
    setError(null)

    const result = await deleteStudent(studentId)
    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setOpen(false)
    }
  }

  if (open) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="w-full max-w-sm mx-4">
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">¿Eliminar alumno?</h2>
              <p className="text-sm text-muted-foreground">
                ¿Estás seguro de que quieres eliminar a <span className="font-semibold">{studentName}</span>? Esta acción no se puede deshacer.
              </p>
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="flex gap-3 justify-end pt-2">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? 'Eliminando…' : 'Eliminar'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={() => setOpen(true)}
      disabled={loading}
    >
      <Trash2 className="h-3.5 w-3.5 mr-1.5" />
      Eliminar
    </Button>
  )
}

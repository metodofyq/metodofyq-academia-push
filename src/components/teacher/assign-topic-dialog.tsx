'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

interface AssignTopicDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  topicCode: string
  topicTitle: string
  studentId: string
  onAssign: (durationWeeks: number) => Promise<void>
}

export function AssignTopicDialog({
  open,
  onOpenChange,
  topicCode,
  topicTitle,
  studentId,
  onAssign,
}: AssignTopicDialogProps) {
  const [durationWeeks, setDurationWeeks] = useState<number>(1)
  const [isLoading, setIsLoading] = useState(false)

  const handleAssign = async () => {
    setIsLoading(true)
    try {
      await onAssign(durationWeeks)
      onOpenChange(false)
      setDurationWeeks(1) // Reset for next use
    } catch (error) {
      console.error('Error assigning topic:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Asignar Tema</DialogTitle>
          <DialogDescription>
            Selecciona cuántas semanas trabajará este tema el alumno
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <p className="font-medium text-sm mb-2">Tema</p>
            <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
              <p className="font-semibold text-sm">{topicCode}</p>
              <p className="text-xs text-muted-foreground truncate">{topicTitle}</p>
            </div>
          </div>

          <div>
            <Label className="text-base font-semibold mb-3 block">
              Duración del tema
            </Label>
            <RadioGroup value={String(durationWeeks)} onValueChange={(v) => setDurationWeeks(Number(v))}>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 border rounded-md hover:bg-gray-50">
                  <RadioGroupItem value="1" id="weeks-1" />
                  <Label htmlFor="weeks-1" className="flex-1 cursor-pointer">
                    <p className="font-medium">1 semana</p>
                    <p className="text-xs text-muted-foreground">
                      El alumno estudia la secuencia de tareas una sola vez
                    </p>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-3 border rounded-md hover:bg-gray-50">
                  <RadioGroupItem value="2" id="weeks-2" />
                  <Label htmlFor="weeks-2" className="flex-1 cursor-pointer">
                    <p className="font-medium">2 semanas</p>
                    <p className="text-xs text-muted-foreground">
                      La secuencia se repite (útil para reforzar)
                    </p>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-3 border rounded-md hover:bg-gray-50">
                  <RadioGroupItem value="3" id="weeks-3" />
                  <Label htmlFor="weeks-3" className="flex-1 cursor-pointer">
                    <p className="font-medium">3 semanas</p>
                    <p className="text-xs text-muted-foreground">
                      La secuencia se repite 3 veces (máximo refuerzo)
                    </p>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
            <p className="text-xs text-blue-800">
              <strong>📅 Ejemplo:</strong> Si seleccionas 2 semanas, el lunes y martes tendrá tareas del tema, la siguiente semana volverá a tener las mismas tareas, repitiendo el ciclo.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleAssign} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Asignar Tema
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

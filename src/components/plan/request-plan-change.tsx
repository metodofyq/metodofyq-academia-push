import { Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  studentName: string | null
  studentEmail: string
}

export function RequestPlanChange({ studentName, studentEmail }: Props) {
  const subject = 'Solicitud de cambio de plan de estudio'
  const body = `Hola,\n\nSoy ${studentName ?? studentEmail} (${studentEmail}) y me gustaría solicitar un cambio en mi plan de estudio.\n\nDetalle de la solicitud:\n`
  const href = `mailto:metodofyq@metodofyq.es?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

  return (
    <Button variant="outline" size="sm" asChild>
      <a href={href}>
        <Mail className="h-4 w-4 mr-2" />
        Modificar mi plan
      </a>
    </Button>
  )
}

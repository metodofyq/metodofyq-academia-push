'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { inviteStudent } from '@/lib/actions/students'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

interface Props {
  ccaaOptions: string[]
}

export function InviteStudentForm({ ccaaOptions }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [email, setEmail]     = useState('')
  const [fullName, setName]   = useState('')
  const [grupo, setGrupo]     = useState<'1' | '2'>('1')
  const [ccaa, setCcaa]       = useState('')
  const [error, setError]     = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!email || !fullName || !ccaa) {
      setError('Rellena todos los campos.')
      return
    }
    startTransition(async () => {
      const result = await inviteStudent({ email, fullName, grupo: Number(grupo) as 1 | 2, ccaa })
      if (result.error) setError(result.error)
      else {
        setSuccess(true)
        setTimeout(() => router.push('/teacher/students'), 1200)
      }
    })
  }

  if (success) {
    return (
      <Card>
        <CardContent className="pt-8 pb-8 text-center space-y-2">
          <div className="text-4xl">📬</div>
          <p className="font-medium">Invitación enviada a {email}</p>
          <p className="text-sm text-muted-foreground">Volviendo a la lista de alumnos…</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
          )}
          <div className="space-y-2">
            <Label htmlFor="fullName">Nombre completo</Label>
            <Input id="fullName" value={fullName} onChange={e => setName(e.target.value)} placeholder="Ana García" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="alumno@email.com" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grupo">Grupo</Label>
              <select
                id="grupo"
                className="w-full border rounded-md px-3 py-2 text-sm h-10"
                value={grupo}
                onChange={e => setGrupo(e.target.value as '1' | '2')}
              >
                <option value="1">Grupo 1</option>
                <option value="2">Grupo 2</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ccaa">Comunidad autónoma</Label>
              <select
                id="ccaa"
                className="w-full border rounded-md px-3 py-2 text-sm h-10"
                value={ccaa}
                onChange={e => setCcaa(e.target.value)}
              >
                <option value="">— Selecciona —</option>
                {ccaaOptions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? 'Enviando invitación…' : 'Enviar invitación'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

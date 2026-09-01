'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createStudent } from '@/lib/actions/students'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Copy, Check } from 'lucide-react'

interface Props {
  ccaaOptions: string[]
}

export function CreateStudentForm({ ccaaOptions }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [email, setEmail]     = useState('')
  const [fullName, setName]   = useState('')
  const [grupo, setGrupo]     = useState<'1' | '2'>('1')
  const [ccaa, setCcaa]       = useState('')
  const [startDate, setStartDate] = useState('')
  const [error, setError]     = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [credentials, setCredentials] = useState<{ email: string; password: string } | null>(null)
  const [copied, setCopied] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!email || !fullName || !ccaa || !startDate) {
      setError('Rellena todos los campos.')
      return
    }
    startTransition(async () => {
      const result = await createStudent({
        email,
        fullName,
        grupo: Number(grupo) as 1 | 2,
        ccaa,
        startDate
      })
      if (result.error) setError(result.error)
      else if (result.credentials) {
        setCredentials(result.credentials)
        setSuccess(true)
      }
    })
  }

  const changePasswordUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/change-password`

  const credentialsText = `Tu usuario: ${credentials?.email}
Tu contraseña: ${credentials?.password}
Enlace para cambiar tu contraseña: ${changePasswordUrl}`

  function copyToClipboard() {
    navigator.clipboard.writeText(credentialsText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (success && credentials) {
    return (
      <Card>
        <CardContent className="pt-8 pb-8 space-y-4">
          <div className="text-center space-y-2">
            <div className="text-4xl">✅</div>
            <p className="font-semibold text-lg">¡Alumno creado!</p>
            <p className="text-sm text-muted-foreground">Copia las credenciales para enviarlas por email</p>
          </div>

          <div className="bg-muted p-4 rounded-lg font-mono text-sm space-y-2 relative">
            <div>Tu usuario: <span className="font-semibold">{credentials.email}</span></div>
            <div>Tu contraseña: <span className="font-semibold">{credentials.password}</span></div>
            <div>Enlace para cambiar tu contraseña: <a href={changePasswordUrl} className="text-blue-600 hover:underline break-all">{changePasswordUrl}</a></div>

            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="absolute top-4 right-4"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar
                </>
              )}
            </Button>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={() => router.push('/teacher/students')} className="flex-1">
              Volver a alumnos
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSuccess(false)
                setCredentials(null)
                setEmail('')
                setName('')
                setGrupo('1')
                setCcaa('')
              }}
              className="flex-1"
            >
              Crear otro
            </Button>
          </div>
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
          <div className="space-y-2">
            <Label htmlFor="startDate">Fecha de inicio del curso</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              required
              disabled={pending}
            />
            <p className="text-xs text-muted-foreground">
              Tema 50 se programará para esta fecha, Tema 54 para 7 días después
            </p>
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? 'Creando alumno…' : 'Crear alumno'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

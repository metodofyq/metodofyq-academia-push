'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { grantMedal, revokeMedal } from '@/lib/actions/medallas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import type { Profile } from '@/types'

type MedalWithStudent = {
  id: string
  nombre: string
  emoji: string
  created_at: string
  student_id: string
  student: { full_name: string | null; email: string } | null
}

interface Props {
  students: Profile[]
  medallas: MedalWithStudent[]
}

const EMOJIS_SUGERIDOS = ['🏅', '🥇', '🏆', '⭐', '🔥', '🎯', '💪', '🚀']

export function GrantMedalForm({ students, medallas }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [studentId, setStudentId] = useState('')
  const [nombre, setNombre] = useState('')
  const [emoji, setEmoji] = useState('🏅')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!studentId || !nombre.trim()) { setError('Selecciona un alumno y escribe un nombre para la medalla'); return }
    startTransition(async () => {
      const result = await grantMedal(studentId, nombre.trim(), emoji)
      if (result.error) setError(result.error)
      else { setNombre(''); router.refresh() }
    })
  }

  function handleRevoke(medalId: string) {
    startTransition(async () => {
      await revokeMedal(medalId)
      router.refresh()
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="student">Alumno</Label>
              <select
                id="student"
                className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              >
                <option value="">— Selecciona un alumno —</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>{s.full_name ?? s.email}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="nombre">Nombre de la medalla</Label>
              <Input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Racha de 7 días" />
            </div>

            <div>
              <Label>Icono</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {EMOJIS_SUGERIDOS.map((e) => (
                  <button
                    type="button"
                    key={e}
                    onClick={() => setEmoji(e)}
                    className={`text-xl px-2.5 py-1.5 rounded-md border ${emoji === e ? 'border-primary bg-primary/10' : 'border-input'}`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" disabled={pending}>Otorgar medalla</Button>
          </form>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-sm font-semibold text-muted-foreground mb-3">Medallas otorgadas ({medallas.length})</h2>
        <div className="space-y-2">
          {medallas.map((m) => (
            <Card key={m.id}>
              <CardContent className="flex items-center gap-3 p-3">
                <span className="text-xl">{m.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{m.nombre}</p>
                  <p className="text-xs text-muted-foreground">
                    {m.student?.full_name ?? m.student?.email ?? 'Alumno'} · {formatDate(m.created_at)}
                  </p>
                </div>
                <Button variant="ghost" size="sm" disabled={pending} onClick={() => handleRevoke(m.id)}>
                  Revocar
                </Button>
              </CardContent>
            </Card>
          ))}
          {medallas.length === 0 && (
            <p className="text-sm text-muted-foreground">Todavía no se ha otorgado ninguna medalla.</p>
          )}
        </div>
      </div>
    </div>
  )
}

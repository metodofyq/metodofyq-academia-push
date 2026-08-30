'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateStudent } from '@/lib/actions/students'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import type { Profile } from '@/types'

interface Props {
  student: Profile
  ccaaOptions: string[]
}

export function EditStudentForm({ student, ccaaOptions }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [fullName, setName] = useState(student.full_name ?? '')
  const [grupo, setGrupo]   = useState<'1' | '2'>(student.grupo === 2 ? '2' : '1')
  const [ccaa, setCcaa]     = useState(student.ccaa ?? '')
  const [role, setRole]     = useState(student.role as 'student' | 'teacher' | 'admin')
  const [error, setError]   = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await updateStudent(student.id, {
        fullName,
        grupo: Number(grupo) as 1 | 2,
        ccaa: ccaa || null,
        role,
      })
      if (result.error) setError(result.error)
      else router.push('/teacher/students')
    })
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
          )}
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={student.email} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullName">Nombre completo</Label>
            <Input id="fullName" value={fullName} onChange={e => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grupo">Grupo</Label>
              <select id="grupo" className="w-full border rounded-md px-3 py-2 text-sm h-10" value={grupo} onChange={e => setGrupo(e.target.value as '1' | '2')}>
                <option value="1">Grupo 1</option>
                <option value="2">Grupo 2</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ccaa">Comunidad autónoma</Label>
              <select id="ccaa" className="w-full border rounded-md px-3 py-2 text-sm h-10" value={ccaa} onChange={e => setCcaa(e.target.value)}>
                <option value="">— Selecciona —</option>
                {ccaaOptions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Rol</Label>
            <select id="role" className="w-full border rounded-md px-3 py-2 text-sm h-10" value={role} onChange={e => setRole(e.target.value as typeof role)}>
              <option value="student">Alumno</option>
              <option value="teacher">Profesor</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? 'Guardando…' : 'Guardar cambios'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

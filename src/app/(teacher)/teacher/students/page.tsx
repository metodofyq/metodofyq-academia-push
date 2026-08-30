import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, UserPlus, Pencil } from 'lucide-react'

export default async function StudentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['teacher', 'admin'].includes(profile.role)) redirect('/overview')

  const { data: students } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'student')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/teacher"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Alumnos</h1>
          <p className="text-muted-foreground">{students?.length ?? 0} alumnos registrados</p>
        </div>
        <Button asChild>
          <Link href="/teacher/students/new">
            <UserPlus className="h-4 w-4 mr-2" /> Nuevo alumno
          </Link>
        </Button>
      </div>

      <div className="space-y-2">
        {(students ?? []).map((s) => (
          <Card key={s.id}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-sm">{s.full_name ?? s.email}</p>
                  {s.email_verified_at ? (
                    <Badge className="text-xs bg-green-100 text-green-800">✅ Activo</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">⏳ Pendiente</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{s.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  {s.grupo && <Badge variant="outline" className="text-xs">Grupo {s.grupo}</Badge>}
                  {s.ccaa && <Badge variant="outline" className="text-xs">{s.ccaa}</Badge>}
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/teacher/students/${s.id}/edit`}>
                  <Pencil className="h-3.5 w-3.5 mr-1.5" /> Editar
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
        {(!students || students.length === 0) && (
          <p className="text-center py-8 text-muted-foreground text-sm">
            Todavía no hay alumnos. Crea el primero con &quot;Nuevo alumno&quot;.
          </p>
        )}
      </div>
    </div>
  )
}

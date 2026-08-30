import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EditStudentForm } from '@/components/teacher/edit-student-form'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { CCAA_LIST } from '@/lib/ccaa'
import type { Profile } from '@/types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditStudentPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['teacher', 'admin'].includes(profile.role)) redirect('/overview')

  const { data: student } = await supabase.from('profiles').select('*').eq('id', id).single()

  if (!student) notFound()

  return (
    <div className="max-w-md mx-auto space-y-6 p-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/teacher/students"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Editar alumno</h1>
          <p className="text-muted-foreground">{student.full_name ?? student.email}</p>
        </div>
      </div>

      <EditStudentForm student={student as Profile} ccaaOptions={CCAA_LIST} />
    </div>
  )
}

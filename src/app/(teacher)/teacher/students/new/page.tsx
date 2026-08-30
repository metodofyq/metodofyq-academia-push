import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { InviteStudentForm } from '@/components/teacher/invite-student-form'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { CCAA_LIST } from '@/lib/ccaa'

export default async function NewStudentPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['teacher', 'admin'].includes(profile.role)) redirect('/overview')

  return (
    <div className="max-w-md mx-auto space-y-6 p-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/teacher/students"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Nuevo alumno</h1>
          <p className="text-muted-foreground">Se le enviará un email para activar su cuenta</p>
        </div>
      </div>

      <InviteStudentForm ccaaOptions={CCAA_LIST} />
    </div>
  )
}

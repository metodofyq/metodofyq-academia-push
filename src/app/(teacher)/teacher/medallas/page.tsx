import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { GrantMedalForm } from '@/components/teacher/grant-medal-form'
import { ArrowLeft } from 'lucide-react'
import type { Profile } from '@/types'

export default async function TeacherMedallasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['teacher', 'admin'].includes(profile.role)) redirect('/overview')

  const [{ data: students }, { data: medallas }] = await Promise.all([
    supabase.from('profiles').select('*').eq('role', 'student').order('full_name'),
    supabase
      .from('medallas')
      .select('*, student:profiles!medallas_student_id_fkey(full_name, email)')
      .order('created_at', { ascending: false }),
  ])

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/teacher"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Medallero</h1>
          <p className="text-muted-foreground">Otorga medallas a los alumnos manualmente</p>
        </div>
      </div>

      <GrantMedalForm students={(students ?? []) as Profile[]} medallas={medallas ?? []} />
    </div>
  )
}

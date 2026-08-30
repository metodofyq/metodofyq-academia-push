'use server'

import { revalidatePath } from 'next/cache'
import { requireTeacher } from '@/lib/auth/require-teacher'
import { createAdminClient } from '@/lib/supabase/admin'

type StudentInput = {
  email: string
  fullName: string
  grupo: 1 | 2
  ccaa: string
}

function translateAuthError(message: string): string {
  if (message.toLowerCase().includes('already been registered') || message.toLowerCase().includes('already registered')) {
    return 'Ya existe una cuenta con ese email.'
  }
  if (message.toLowerCase().includes('invalid') && message.toLowerCase().includes('email')) {
    return 'El email no es válido.'
  }
  return message
}

export async function inviteStudent(input: StudentInput) {
  const { error: authError } = await requireTeacher()
  if (authError) return { error: authError }

  const { email, fullName, grupo, ccaa } = input
  const admin = createAdminClient()

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const { data, error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${appUrl}/auth/callback?next=/set-password`,
    data: { full_name: fullName },
  })
  if (inviteError || !data.user) {
    return { error: translateAuthError(inviteError?.message ?? 'No se pudo invitar al alumno.') }
  }

  // El trigger handle_new_user ya crea la fila en profiles al insertar en
  // auth.users; aquí solo completamos los campos propios de la app.
  const { supabase } = await requireTeacher()
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ full_name: fullName, grupo, ccaa })
    .eq('id', data.user.id)

  if (updateError) return { error: updateError.message }

  revalidatePath('/teacher/students')
  return { error: null }
}

export async function updateStudent(
  id: string,
  input: { fullName: string; grupo: 1 | 2 | null; ccaa: string | null; role: 'student' | 'teacher' | 'admin' }
) {
  const { supabase, error: authError } = await requireTeacher()
  if (authError) return { error: authError }

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: input.fullName,
      grupo: input.grupo,
      ccaa: input.ccaa,
      role: input.role,
    })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/teacher/students')
  return { error: null }
}

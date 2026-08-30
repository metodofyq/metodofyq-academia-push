'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

async function requireTeacher() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { supabase, user: null, error: 'No autenticado' }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['teacher', 'admin'].includes(profile.role)) {
    return { supabase, user: null, error: 'No autorizado' }
  }
  return { supabase, user, error: null }
}

export async function grantMedal(studentId: string, nombre: string, emoji: string) {
  const { supabase, user, error } = await requireTeacher()
  if (error || !user) return { error: error ?? 'No autorizado' }

  const { error: insertError } = await supabase.from('medallas').insert({
    student_id: studentId,
    nombre,
    emoji: emoji || '🏅',
    otorgada_por: user.id,
  })
  if (insertError) return { error: insertError.message }

  revalidatePath('/teacher/medallas')
  revalidatePath('/medallero')
  revalidatePath('/overview')
  return { error: null }
}

export async function revokeMedal(medalId: string) {
  const { supabase, user, error } = await requireTeacher()
  if (error || !user) return { error: error ?? 'No autorizado' }

  const { error: deleteError } = await supabase.from('medallas').delete().eq('id', medalId)
  if (deleteError) return { error: deleteError.message }

  revalidatePath('/teacher/medallas')
  return { error: null }
}

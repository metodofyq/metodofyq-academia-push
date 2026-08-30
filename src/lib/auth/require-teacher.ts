import 'server-only'
import { createClient } from '@/lib/supabase/server'

// Guard compartido para server actions restringidas a teacher/admin.
// Devuelve el cliente ya autenticado + el user si procede, o un error
// listo para propagar tal cual desde la action.
export async function requireTeacher() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { supabase, user: null, error: 'No autenticado' }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['teacher', 'admin'].includes(profile.role)) {
    return { supabase, user: null, error: 'No autorizado' }
  }
  return { supabase, user, error: null }
}

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SetPasswordForm } from '@/components/auth/set-password-form'

// Destino del enlace de invitación (profesor crea alumno → Supabase
// envía este link) y también reutilizable para "olvidé mi contraseña".
export default async function SetPasswordPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return <SetPasswordForm />
}

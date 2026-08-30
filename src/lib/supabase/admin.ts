import 'server-only'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Cliente con la service role key — solo para operaciones que la requieren
// de verdad (Admin API de Auth: invitar/crear usuarios). NUNCA importar
// esto desde un componente cliente ni exponer el resultado al navegador.
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

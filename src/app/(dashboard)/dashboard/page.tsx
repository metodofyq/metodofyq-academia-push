import { redirect } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { getTareasHoy } from '@/lib/dashboard/tareas'
import { nivelMeta } from '@/lib/niveles/constants'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single()
  const { temaActual, niveles, hechos } = await getTareasHoy(supabase, user.id)

  const firstName = profile?.full_name?.split(' ')[0] ?? 'estudiante'
  const hoy = new Date()
  const esDescanso = niveles.length === 0

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold capitalize">Hola, {firstName} 👋</h1>
        <p className="text-muted-foreground">
          {(() => { const f = format(hoy, "EEEE d 'de' MMMM", { locale: es }); return f.charAt(0).toUpperCase() + f.slice(1) })()}
        </p>
      </div>

      {!temaActual ? (
        <Card>
          <CardContent className="pt-8 pb-8 text-center space-y-3">
            <div className="text-4xl">📚</div>
            <p className="font-medium">Todavía no has empezado ningún tema</p>
            <p className="text-sm text-muted-foreground">
              Ve a <Link href="/topics" className="text-primary hover:underline">Todos los temas</Link> y elige uno para comenzar.
            </p>
          </CardContent>
        </Card>
      ) : esDescanso ? (
        <Card>
          <CardContent className="pt-8 pb-8 text-center space-y-2">
            <div className="text-4xl">😴</div>
            <p className="font-medium">Hoy es día de descanso</p>
            <p className="text-sm text-muted-foreground">No hay niveles programados para hoy.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Continuando: <span className="font-medium text-foreground">{temaActual.code} — {temaActual.title}</span>
          </p>
          {niveles.map((nivel) => {
            const meta = nivelMeta(nivel)
            const hecho = hechos.includes(nivel)
            return (
              <Link key={nivel} href={`/topics/${temaActual.id}/nivel/${nivel}`}>
                <Card className={cn('transition-shadow hover:shadow-md', hecho && 'opacity-60')}>
                  <CardContent className="flex items-center gap-4 p-4">
                    {hecho
                      ? <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                      : <span className="text-xl shrink-0">{meta.emoji}</span>
                    }
                    <div className="flex-1 min-w-0">
                      <span className={cn('inline-block text-white rounded-full px-2 py-0.5 text-[10px] font-bold mr-2', meta.badge)}>
                        {meta.corto}
                      </span>
                      <span className="font-medium text-sm">{meta.label}</span>
                      <span className="text-xs text-muted-foreground ml-1.5">({meta.titulo})</span>
                    </div>
                    {hecho && <span className="text-xs text-green-600 font-medium shrink-0">¡Hecho!</span>}
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

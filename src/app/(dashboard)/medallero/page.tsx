import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'

export default async function MedalleroPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: medallas } = await supabase
    .from('medallas')
    .select('*')
    .eq('student_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Medallero</h1>
        <p className="text-muted-foreground">
          {medallas && medallas.length > 0
            ? `${medallas.length} medalla${medallas.length > 1 ? 's' : ''} conseguida${medallas.length > 1 ? 's' : ''}`
            : 'Todavía no tienes medallas'}
        </p>
      </div>

      {medallas && medallas.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {medallas.map((m) => (
            <Card key={m.id}>
              <CardContent className="pt-6 flex flex-col items-center text-center gap-2">
                <span className="text-4xl">{m.emoji}</span>
                <span className="font-medium text-sm">{m.nombre}</span>
                <span className="text-xs text-muted-foreground">{formatDate(m.created_at)}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-10 pb-10 text-center space-y-2">
            <div className="text-4xl">🏆</div>
            <p className="text-sm text-muted-foreground">
              Seguirás recibiendo medallas según tu progreso y dedicación.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { StudyTimeAnalytics } from '@/components/teacher/study-time-analytics'
import { Card, CardContent } from '@/components/ui/card'

export default async function StudyTimeAnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Get user profile to verify teacher role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, grupo')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'teacher') {
    redirect('/dashboard')
  }

  try {
    // Call API to get study time analytics
    const response = await fetch(
      new URL(
        `/api/teacher/study-time-analytics?group=${profile.grupo}`,
        process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'
      ).toString(),
      {
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token || ''}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch analytics')
    }

    const data = await response.json()

    return (
      <div className="max-w-7xl mx-auto space-y-6 py-6">
        <div>
          <h1 className="text-3xl font-bold">Análisis de Tiempo de Estudio</h1>
          <p className="text-muted-foreground">
            Visualiza cuánto tiempo dedica cada alumno a cada tema
          </p>
        </div>

        <StudyTimeAnalytics
          group={data.group}
          analytics={data.analytics}
          groupStats={data.groupStats}
        />
      </div>
    )
  } catch (error) {
    console.error('Error loading analytics:', error)
    return (
      <div className="max-w-7xl mx-auto space-y-6 py-6">
        <div>
          <h1 className="text-3xl font-bold">Análisis de Tiempo de Estudio</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-600">Error al cargar los análisis. Intenta nuevamente más tarde.</p>
          </CardContent>
        </Card>
      </div>
    )
  }
}

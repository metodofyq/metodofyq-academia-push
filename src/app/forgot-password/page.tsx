'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!email) {
      setError('Ingresa tu email.')
      return
    }

    setLoading(true)

    const supabase = createClient()
    const appUrl = typeof window !== 'undefined' ? window.location.origin : ''

    // Enviar link de recuperación
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${appUrl}/reset-password`,
    })

    if (resetError) {
      setError('No se pudo enviar el link. Verifica que el email sea correcto.')
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            <div className="text-4xl">📧</div>
            <h2 className="text-2xl font-bold">Link enviado</h2>
            <p className="text-muted-foreground">
              Hemos enviado un link de recuperación a <span className="font-semibold">{email}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Revisa tu email (incluye la carpeta de spam) y haz clic en el link para establecer una nueva contraseña.
            </p>
            <Button onClick={() => window.location.href = '/login'} className="w-full">
              Volver al login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>¿Olvidaste tu contraseña?</CardTitle>
          <CardDescription>Ingresa tu email para recibir un link de recuperación</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Enviando…' : 'Enviar link de recuperación'}
            </Button>

            <div className="pt-4 text-center">
              <Link href="/login" className="text-sm text-primary hover:underline flex items-center justify-center gap-2">
                <ArrowLeft className="h-3 w-3" />
                Volver al login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

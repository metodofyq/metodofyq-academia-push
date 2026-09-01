'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, ArrowLeft } from 'lucide-react'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [validToken, setValidToken] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    // Verificar que el token sea válido (Supabase lo incluye en la URL)
    const token = searchParams.get('code')
    if (!token) {
      setError('Link de recuperación inválido o expirado.')
      setChecking(false)
      return
    }
    setValidToken(true)
    setChecking(false)
  }, [searchParams])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!password || !confirmPassword) {
      setError('Rellena todos los campos.')
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }

    setLoading(true)

    const supabase = createClient()

    // Cambiar la contraseña usando el token
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    })

    if (updateError) {
      setError('No se pudo cambiar la contraseña. El link puede haber expirado.')
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)

    // Redirigir a login después de 2 segundos
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardContent className="pt-8 pb-8 text-center">
            <p className="text-muted-foreground">Verificando link de recuperación…</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!validToken) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            <div className="text-4xl">❌</div>
            <h2 className="text-2xl font-bold">Link inválido</h2>
            <p className="text-sm text-muted-foreground">
              {error}
            </p>
            <Button onClick={() => router.push('/forgot-password')} className="w-full">
              Solicitar nuevo link
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            <div className="text-4xl">✅</div>
            <h2 className="text-2xl font-bold">¡Contraseña restablecida!</h2>
            <p className="text-muted-foreground">Tu contraseña ha sido cambiada exitosamente.</p>
            <p className="text-sm text-muted-foreground">Redirigiendo a login en 2 segundos...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Restablecer contraseña</CardTitle>
          <CardDescription>Ingresa tu nueva contraseña</CardDescription>
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
              <Label htmlFor="password">Nueva contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repite tu contraseña"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Restableciendo…' : 'Restablecer contraseña'}
            </Button>

            <div className="pt-4 text-center">
              <a href="/login" className="text-sm text-primary hover:underline flex items-center justify-center gap-2">
                <ArrowLeft className="h-3 w-3" />
                Volver al login
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

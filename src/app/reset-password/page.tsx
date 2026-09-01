import { Suspense } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ResetPasswordForm } from '@/components/reset-password-form'

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-sm">
            <CardContent className="pt-8 pb-8 text-center">
              <p className="text-muted-foreground">Cargando…</p>
            </CardContent>
          </Card>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { NivelShell } from './nivel-shell'
import { completeLevel } from '@/lib/niveles/complete-level'
import { nextNivel, type NivelValue } from '@/lib/niveles/constants'

interface Props {
  imagenes: { label: string | null; url: string }[]
  topicId: string
  studentId: string
  incluirNivel4: boolean
  temaCode?: string
  temaTitulo?: string
}

// Nivel 0.5 es repaso, no evaluación: se marca como completado sin umbral.
export function InfografiaGaleria({ imagenes, topicId, studentId, incluirNivel4, temaCode, temaTitulo }: Props) {
  const router = useRouter()
  const [mostrarPopup, setMostrarPopup] = useState(true)
  const [avanzando, setAvanzando] = useState(false)
  const siguiente: NivelValue | null = nextNivel(0.5, incluirNivel4)

  const avanzar = async () => {
    setAvanzando(true)
    try {
      await completeLevel({ studentId, topicId, level: 0.5, scorePct: 100, incluirNivel4 })
      router.push(siguiente !== null ? `/topics/${topicId}/nivel/${siguiente}` : `/topics/${topicId}`)
    } finally {
      setAvanzando(false)
    }
  }

  return (
    <NivelShell nivel={0.5} temaCode={temaCode} temaTitulo={temaTitulo}>
      {mostrarPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5">
          <div className="bg-white rounded-2xl p-6 max-w-sm text-center shadow-2xl">
            <div className="text-3xl mb-3">📱</div>
            <h3 className="font-bold text-lg mb-2">Gira tu dispositivo</h3>
            <p className="text-muted-foreground text-sm mb-5">
              Para ver mejor las infografías, te recomendamos poner el smartphone en posición horizontal.
            </p>
            <Button className="w-full" onClick={() => setMostrarPopup(false)}>
              Entendido, continuar →
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-5">
        {imagenes.map((img, i) => (
          <div key={i} className="bg-white border rounded-xl overflow-hidden shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt={img.label ?? `Infografía ${i + 1}`} className="w-full h-auto block" loading="lazy" />
          </div>
        ))}
      </div>

      <Button className="w-full" disabled={avanzando} onClick={avanzar}>
        ✓ Repasado — Ir al siguiente nivel →
      </Button>
    </NivelShell>
  )
}

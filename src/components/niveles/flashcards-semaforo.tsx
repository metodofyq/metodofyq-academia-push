'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { NivelShell } from './nivel-shell'
import { extraerTarjetas, type Tarjeta } from '@/lib/niveles/texto'
import { completeLevel } from '@/lib/niveles/complete-level'
import { nextNivel, type NivelValue } from '@/lib/niveles/constants'

type TarjetaEstado = Tarjeta & { deuda: number; semaforo: 'rojo' | 'amarillo' | 'verde' | null }

interface Props {
  texto: string
  topicId: string
  studentId: string
  incluirNivel4: boolean
}

const SEMAFORO = [
  { color: 'rojo' as const,     emoji: '🔴', label: 'No lo recuerdo', bg: 'bg-red-50',    border: 'border-red-300',    text: 'text-red-600' },
  { color: 'amarillo' as const, emoji: '🟡', label: 'Me ha costado',  bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-600' },
  { color: 'verde' as const,    emoji: '🟢', label: 'Lo recuerdo',    bg: 'bg-green-50',  border: 'border-green-300',  text: 'text-green-600' },
]

export function FlashcardsSemaforo({ texto, topicId, studentId, incluirNivel4 }: Props) {
  const router = useRouter()
  const base = useMemo(() => extraerTarjetas(texto), [texto])

  const [tarjetas, setTarjetas] = useState<TarjetaEstado[]>(() => base.map((t) => ({ ...t, deuda: 1, semaforo: null })))
  const [vuelta, setVuelta] = useState(1)
  const [pendientes, setPendientes] = useState<number[]>(() => base.map((_, i) => i))
  const [indice, setIndice] = useState(0)
  const [girada, setGirada] = useState(false)
  const [fase, setFase] = useState<'repaso' | 'resumen'>('repaso')
  const [avanzando, setAvanzando] = useState(false)

  const idxReal = pendientes[indice]
  const actual = tarjetas[idxReal]
  const verdes = tarjetas.filter((t) => t.deuda === 0).length
  const total = tarjetas.length
  const siguiente: NivelValue | null = nextNivel(2.5, incluirNivel4)

  const avanzar = async () => {
    setAvanzando(true)
    try {
      await completeLevel({ studentId, topicId, level: 2.5, scorePct: 100, incluirNivel4 })
      router.push(siguiente !== null ? `/topics/${topicId}/nivel/${siguiente}` : `/topics/${topicId}`)
    } finally {
      setAvanzando(false)
    }
  }

  const marcarSemaforo = (color: 'rojo' | 'amarillo' | 'verde') => {
    const nuevas = [...tarjetas]
    const t = nuevas[idxReal]
    let nuevaDeuda = t.deuda
    if (color === 'rojo') nuevaDeuda = 2
    else if (color === 'amarillo') nuevaDeuda = 1
    else nuevaDeuda = Math.max(0, t.deuda - 1)
    nuevas[idxReal] = { ...t, semaforo: color, deuda: nuevaDeuda }
    setTarjetas(nuevas)

    if (indice + 1 < pendientes.length) {
      setIndice(indice + 1)
      setGirada(false)
    } else {
      setFase('resumen')
    }
  }

  const siguienteVuelta = () => {
    const noVerdes = tarjetas.map((t, i) => ({ t, i })).filter(({ t }) => t.deuda > 0).map(({ i }) => i).sort(() => Math.random() - 0.5)
    if (noVerdes.length === 0) { avanzar(); return }
    setPendientes(noVerdes)
    setIndice(0)
    setGirada(false)
    setVuelta((v) => v + 1)
    setFase('repaso')
  }

  if (total === 0) {
    return (
      <NivelShell nivel={2.5}>
        <p className="text-muted-foreground text-sm">No se han podido extraer tarjetas del contenido de este tema.</p>
      </NivelShell>
    )
  }

  if (fase === 'resumen') {
    const todosVerdes = tarjetas.every((t) => t.deuda === 0)
    const amarillas = tarjetas.filter((t) => t.semaforo === 'amarillo').length
    const rojas = tarjetas.filter((t) => t.semaforo === 'rojo').length
    const verdesRonda = tarjetas.filter((t) => t.semaforo === 'verde').length

    return (
      <NivelShell nivel={2.5} titulo={`Fin de vuelta ${vuelta}`}>
        <div className="bg-slate-200 rounded-full h-2.5 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all" style={{ width: `${(verdes / total) * 100}%` }} />
        </div>
        <p className="text-sm text-muted-foreground">{verdes} / {total} tarjetas en verde</p>

        <div className="grid grid-cols-3 gap-2.5">
          {[{ ...SEMAFORO[2], count: verdesRonda }, { ...SEMAFORO[1], count: amarillas }, { ...SEMAFORO[0], count: rojas }].map((s) => (
            <div key={s.color} className={`${s.bg} border-2 ${s.border} rounded-lg p-3 text-center`}>
              <div className="text-2xl">{s.emoji}</div>
              <div className="text-xl font-bold">{s.count}</div>
              <div className="text-[11px] text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {todosVerdes ? (
          <div className="p-5 bg-green-50 border-2 border-green-200 rounded-xl text-center">
            <p className="text-lg font-bold text-green-700 mb-1.5">🎉 ¡Todas las tarjetas en verde!</p>
            <p className="text-sm text-muted-foreground mb-4">Has demostrado que dominas todos los conceptos del tema.</p>
            <Button className="bg-green-600 hover:bg-green-700 w-full" disabled={avanzando} onClick={avanzar}>
              Desbloquear siguiente nivel →
            </Button>
          </div>
        ) : (
          <div>
            <p className="text-sm font-semibold mb-3">
              Vuelta {vuelta + 1}: repasarás {tarjetas.filter((t) => t.deuda > 0).length} tarjeta(s) pendientes.
            </p>
            <Button className="w-full" onClick={siguienteVuelta}>Continuar con las pendientes →</Button>
          </div>
        )}
      </NivelShell>
    )
  }

  return (
    <NivelShell nivel={2.5} desc={`${vuelta > 1 ? `Vuelta ${vuelta} · ` : ''}Tarjeta ${indice + 1} de ${pendientes.length} · ${verdes}/${total} en verde`}>
      <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all" style={{ width: `${(verdes / total) * 100}%` }} />
      </div>

      <div
        onClick={() => !girada && setGirada(true)}
        className={`rounded-2xl p-6 min-h-[200px] flex flex-col shadow-md border-2 transition-colors ${girada ? 'bg-sky-50 border-cyan-600 cursor-default' : 'bg-white border-slate-200 cursor-pointer'}`}
      >
        <div className="mb-4">
          <div className="text-[11px] font-bold text-blue-700">{actual.apartado}</div>
          {actual.subapartado && <div className="text-[11px] font-semibold text-violet-700">{actual.subapartado}</div>}
        </div>

        {!girada ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <p className="text-xl font-bold mb-4">{actual.termino}</p>
            <p className="text-sm text-muted-foreground italic">Toca para ver la explicación</p>
          </div>
        ) : (
          <div className="flex-1">
            <p className="text-sm font-bold text-cyan-700 mb-1.5">{actual.termino}</p>
            <p className="text-base leading-relaxed">{actual.descripcion}</p>
          </div>
        )}
      </div>

      {girada && (
        <div>
          <p className="text-sm text-muted-foreground text-center mb-3">¿Cómo te ha salido?</p>
          <div className="grid grid-cols-3 gap-2.5">
            {SEMAFORO.map((s) => (
              <button
                key={s.color}
                onClick={() => marcarSemaforo(s.color)}
                className={`${s.bg} border-2 ${s.border} rounded-xl p-3.5 text-center hover:opacity-80 transition-opacity`}
              >
                <div className="text-2xl mb-1">{s.emoji}</div>
                <div className={`text-[11px] font-semibold ${s.text}`}>{s.label}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </NivelShell>
  )
}

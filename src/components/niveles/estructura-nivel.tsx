'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { NivelShell } from './nivel-shell'
import { stripNum, type Apartado } from '@/lib/niveles/texto'
import { completeLevel } from '@/lib/niveles/complete-level'
import { UMBRAL_SUPERACION, nextNivel, type NivelValue } from '@/lib/niveles/constants'

type Slot = { key: string; correcto: string; tipo: 'apartado' | 'subapartado' | 'keyword' }

interface Props {
  nivel: 0 | 1
  estructura: Apartado[]
  keywords?: Record<string, string>
  topicId: string
  studentId: string
  incluirNivel4: boolean
  temaCode?: string
  temaTitulo?: string
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

// N0 (solo índice) y N1 (índice + palabras clave) comparten el mismo
// mecanismo: reconstruir la estructura eligiendo entre opciones mezcladas.
export function EstructuraNivel({ nivel, estructura, keywords, topicId, studentId, incluirNivel4, temaCode, temaTitulo }: Props) {
  const router = useRouter()
  const incluirKeywords = nivel === 1
  const [inicio] = useState(() => Date.now())

  const [slots] = useState<Slot[]>(() => {
    const s: Slot[] = []
    estructura.forEach((a) => {
      s.push({ key: `apt_${a.apartado}`, correcto: a.apartado, tipo: 'apartado' })
      a.subapartados.forEach((sub) => {
        s.push({ key: `sub_${sub}`, correcto: sub, tipo: 'subapartado' })
        if (incluirKeywords && keywords) {
          s.push({ key: `kw_${sub}`, correcto: keywords[sub] ?? '', tipo: 'keyword' })
        }
      })
    })
    return s
  })

  const [optsApartados]    = useState(() => shuffle(estructura.map((a) => a.apartado)))
  const [optsSubapartados] = useState(() => shuffle(estructura.flatMap((a) => a.subapartados)))
  const [optsKeywords]     = useState(() => (keywords ? shuffle(Object.values(keywords)) : []))

  const [fase, setFase] = useState<'lectura' | 'ejercicio' | 'correccion'>('lectura')
  const [respuestas, setRespuestas] = useState<Record<string, string>>({})
  const [resultado, setResultado] = useState<Record<string, boolean> | null>(null)
  const [avanzando, setAvanzando] = useState(false)

  const corregir = () => {
    const res: Record<string, boolean> = {}
    slots.forEach((s) => { res[s.key] = respuestas[s.key] === s.correcto })
    setResultado(res)
    setFase('correccion')
  }

  const resetear = () => { setRespuestas({}); setResultado(null); setFase('lectura') }
  const solucionar = () => {
    const auto: Record<string, string> = {}
    slots.forEach((s) => { auto[s.key] = s.correcto })
    setRespuestas(auto)
  }

  const todoUsado = slots.every((s) => respuestas[s.key])
  const todoCorrecto = resultado ? Object.values(resultado).every(Boolean) : false
  const aciertos = resultado ? Object.values(resultado).filter(Boolean).length : 0
  const pct = slots.length > 0 && resultado ? Math.round((aciertos / slots.length) * 100) : 0
  const superaUmbral = resultado ? aciertos / slots.length >= UMBRAL_SUPERACION : false
  const siguiente: NivelValue | null = nextNivel(nivel, incluirNivel4)

  const avanzar = async () => {
    setAvanzando(true)
    try {
      await completeLevel({
        studentId, topicId, level: nivel, scorePct: pct || 100, incluirNivel4,
        durationSeconds: (Date.now() - inicio) / 1000,
      })
      router.push(siguiente !== null ? `/topics/${topicId}/nivel/${siguiente}` : `/topics/${topicId}`)
    } finally {
      setAvanzando(false)
    }
  }

  return (
    <NivelShell nivel={nivel} temaCode={temaCode} temaTitulo={temaTitulo}>
      {fase === 'lectura' && (
        <>
          <div className="bg-white border rounded-xl p-4 space-y-3">
            {estructura.map((a, ai) => (
              <div key={ai}>
                <div className="font-bold text-sm">{a.apartado}</div>
                {a.subapartados.map((sub, si) => (
                  <div key={si} className="ml-3 mt-1.5">
                    <div className="text-sm text-slate-700">{sub}</div>
                    {incluirKeywords && keywords?.[sub] && (
                      <div className="ml-2 mt-0.5 space-y-0.5">
                        {keywords[sub].split('·').map((kw, ki) => (
                          <div key={ki} className="text-xs text-violet-700 italic flex gap-1.5">
                            <span>•</span><span>{kw.trim()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <Button className="w-full" onClick={() => setFase('ejercicio')}>
            ✓ Leído — Ahora reprodúcelo
          </Button>
        </>
      )}

      {(fase === 'ejercicio' || fase === 'correccion') && (
        <>
          <p className="text-sm text-muted-foreground">
            Selecciona el texto correcto para cada línea. La numeración ya está colocada.
          </p>
          <div className="bg-white border rounded-xl p-6 space-y-4 min-h-[500px] max-h-[700px] overflow-y-auto">
            {slots.map((slot, i) => {
              const correcto = resultado ? resultado[slot.key] : null
              const indent = slot.tipo === 'subapartado' ? 'ml-5' : slot.tipo === 'keyword' ? 'ml-10' : ''
              const todasOpts = slot.tipo === 'apartado' ? optsApartados : slot.tipo === 'subapartado' ? optsSubapartados : optsKeywords
              const usadasPorOtros = slots
                .filter((s) => s.tipo === slot.tipo && s.key !== slot.key && respuestas[s.key])
                .map((s) => respuestas[s.key])
              const disponibles = todasOpts.filter((op) => !usadasPorOtros.includes(op) || op === respuestas[slot.key])
              const numFijo = slot.tipo !== 'keyword' ? slot.correcto.match(/^([\d]+(\.\d+)*\.)\s*/)?.[1] ?? '' : ''
              const placeholder = slot.tipo === 'apartado' ? '— Apartado —' : slot.tipo === 'subapartado' ? '— Subapartado —' : '— Palabras clave —'

              return (
                <div key={i} className={indent}>
                  {slot.tipo === 'keyword' && <div className="text-xs font-semibold text-muted-foreground mb-2">Palabras clave:</div>}
                  <div className={`flex items-center gap-2 ${slot.tipo === 'keyword' ? 'flex-wrap' : ''}`}>
                    {numFijo && <span className="font-bold text-xs shrink-0 min-w-[24px]">{numFijo}</span>}
                    <select
                      className={`${slot.tipo === 'keyword' ? 'flex-1 min-w-0 max-w-xs h-12' : 'flex-1 h-10'} border-2 rounded-md px-3 py-2 text-sm outline-none disabled:opacity-100`}
                      style={{
                        borderColor: correcto === null ? undefined : correcto ? '#22c55e' : '#ef4444',
                        background: correcto === null ? undefined : correcto ? '#f0fdf4' : '#fef2f2',
                      }}
                      value={respuestas[slot.key] || ''}
                      onChange={(e) => setRespuestas({ ...respuestas, [slot.key]: e.target.value })}
                      disabled={fase === 'correccion'}
                    >
                      <option value="">{placeholder}</option>
                      {disponibles.map((op, oi) => (
                        <option key={oi} value={op}>{stripNum(op)}</option>
                      ))}
                    </select>
                  </div>
                  {correcto === false && (
                    <div className="text-xs text-red-600 mt-1 pl-1">
                      <strong>{stripNum(slot.correcto)}</strong>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {fase === 'ejercicio' && (
            <div className="flex flex-col gap-2.5">
              <Button disabled={!todoUsado} onClick={corregir}>Corregir →</Button>
              <Button variant="secondary" onClick={resetear}>Volver a leer</Button>
              <Button variant="outline" size="sm" onClick={solucionar}>Solucionar automáticamente</Button>
            </div>
          )}

          {fase === 'correccion' && (
            <div className="flex flex-col gap-2.5">
              {todoCorrecto ? (
                <div className="mt-2 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
                  <p className="text-green-700 font-bold text-lg m-0">🎉 ¡Perfecto! Nivel superado.</p>
                </div>
              ) : (
                <div className="mt-2 p-4 bg-red-50 rounded-xl">
                  <p className="text-red-600 font-semibold m-0">Hay errores. Vuelve a leer antes de intentarlo de nuevo.</p>
                </div>
              )}
              <Button variant="secondary" onClick={resetear}>Volver a leer</Button>
              <Button variant="outline" size="sm" disabled={avanzando} onClick={avanzar}>
                Pasar al siguiente nivel
              </Button>
              {!superaUmbral && <p className="text-xs text-red-600 font-semibold">✗ {pct}% — necesitas al menos el 90%</p>}
              {superaUmbral && (
                <Button disabled={avanzando} onClick={avanzar}>
                  {todoCorrecto ? '🎉 Desbloquear siguiente nivel →' : `✓ ${pct}% — Desbloquear siguiente nivel →`}
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </NivelShell>
  )
}

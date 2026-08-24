'use client'

import { useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { NivelShell } from './nivel-shell'
import {
  textoAEsquema, insertarMarcasDibujo, corregirDictado, porcentajeAcierto,
  SIMBOLOS_ESPECIALES, type PalabraCorregida,
} from '@/lib/niveles/texto'
import { completeLevel } from '@/lib/niveles/complete-level'
import { UMBRAL_SUPERACION, nextNivel, type NivelValue } from '@/lib/niveles/constants'

type ImagenAncla = { anchor: string; caption?: string | null; dibujar?: string | null; url: string }

interface Props {
  nivel: 2 | 3
  texto: string
  imagenesAncladas?: ImagenAncla[]
  topicId: string
  studentId: string
  incluirNivel4: boolean
}

const accent = { 2: { text: 'text-orange-600', border: 'border-orange-600', bg: 'bg-orange-600' }, 3: { text: 'text-green-600', border: 'border-green-600', bg: 'bg-green-600' } }

// N2 (esquema) y N3 (redacción completa con imágenes) comparten el mismo
// motor: leer un texto de referencia y luego reescribirlo de memoria, con
// corrección palabra a palabra y teclado de símbolos especiales.
export function DictadoCorrector({ nivel, texto, imagenesAncladas, topicId, studentId, incluirNivel4 }: Props) {
  const router = useRouter()
  const c = accent[nivel]

  const textoDictado = useMemo(() => {
    if (nivel === 3) return insertarMarcasDibujo(texto, imagenesAncladas ?? [])
    return textoAEsquema(texto)
  }, [nivel, texto, imagenesAncladas])

  const [fase, setFase] = useState<'lectura' | 'escritura' | 'correccion'>('lectura')
  const [escritura, setEscritura] = useState('')
  const [resultado, setResultado] = useState<PalabraCorregida[] | null>(null)
  const [avanzando, setAvanzando] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const insertarSimbolo = (s: string) => {
    const el = textareaRef.current
    if (!el) { setEscritura((prev) => prev + s); return }
    const start = el.selectionStart
    const end = el.selectionEnd
    const nueva = escritura.slice(0, start) + s + escritura.slice(end)
    setEscritura(nueva)
    setTimeout(() => { el.selectionStart = el.selectionEnd = start + s.length; el.focus() }, 0)
  }

  const corregir = () => {
    setResultado(corregirDictado(textoDictado, escritura))
    setFase('correccion')
  }

  const resetear = () => { setEscritura(''); setResultado(null); setFase('lectura') }

  const porcentaje = resultado ? porcentajeAcierto(resultado) : 0
  const errores = resultado ? resultado.filter((r) => !r.correcto).length : 0
  const superaUmbral = porcentaje >= UMBRAL_SUPERACION
  const todoCorrecto = porcentaje === 1
  const siguiente: NivelValue | null = nextNivel(nivel, incluirNivel4)

  const avanzar = async () => {
    setAvanzando(true)
    try {
      await completeLevel({ studentId, topicId, level: nivel, scorePct: porcentaje * 100, incluirNivel4 })
      router.push(siguiente !== null ? `/topics/${topicId}/nivel/${siguiente}` : `/topics/${topicId}`)
    } finally {
      setAvanzando(false)
    }
  }

  return (
    <NivelShell nivel={nivel}>
      {fase === 'lectura' && (
        <>
          {nivel === 3 && (
            <div className="bg-amber-50 border border-amber-200 border-l-4 border-l-amber-600 rounded-lg p-3 text-sm text-amber-900">
              <p className="font-bold mb-1">✏️ Recuerda para el día de la prueba</p>
              <p className="m-0">
                El día del examen deberás <strong>dibujar a mano en el papel</strong> los gráficos y escribir las fórmulas.
                Aquí se muestran junto al texto como referencia.
              </p>
            </div>
          )}
          <div className={`bg-white border border-l-4 ${c.border} rounded-xl p-4 leading-relaxed text-sm`}>
            {nivel === 3
              ? <ProsaConImagenes texto={texto} imagenes={imagenesAncladas ?? []} />
              : <EsquemaConGuiones texto={textoDictado} />}
          </div>
          <Button className="w-full" onClick={() => setFase('escritura')}>
            ✓ Leído — Escríbelo de memoria
          </Button>
        </>
      )}

      {fase === 'escritura' && (
        <>
          <p className="text-xs text-muted-foreground">
            {escritura.trim().split(/\s+/).filter(Boolean).length} / {textoDictado.split(/\s+/).length} palabras
          </p>

          <div className={`relative border-2 ${c.border} rounded-lg overflow-hidden`}>
            <div aria-hidden className="p-3 text-sm leading-loose whitespace-pre-wrap break-words invisible min-h-[200px]">
              {textoDictado}
              {'\n'}
            </div>
            <div aria-hidden className="absolute inset-0 p-3 text-sm leading-loose whitespace-pre-wrap break-words text-slate-300 pointer-events-none">
              {textoDictado}
            </div>
            <textarea
              ref={textareaRef}
              className="absolute inset-0 w-full h-full p-3 border-none outline-none text-sm leading-loose whitespace-pre-wrap break-words resize-none bg-transparent text-slate-900"
              value={escritura}
              onChange={(e) => setEscritura(e.target.value)}
              spellCheck={false}
            />
          </div>

          <div className="bg-slate-100 border rounded-lg p-2.5">
            <div className="text-[11px] text-muted-foreground font-semibold mb-1.5 tracking-wide">⌨️ SÍMBOLOS ESPECIALES</div>
            <div className="flex flex-wrap gap-1.5">
              {SIMBOLOS_ESPECIALES.map((s, i) => (
                <button key={i} type="button" onClick={() => insertarSimbolo(s)}
                  className="px-2.5 py-1 bg-white border rounded text-sm font-medium hover:bg-slate-50">
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <Button onClick={corregir}>Corregir texto →</Button>
            <Button variant="secondary" onClick={resetear}>📖 Volver a leer</Button>
            <Button variant="outline" size="sm" onClick={() => setEscritura(textoDictado)}>
              ✅ Solucionar automáticamente
            </Button>
          </div>
        </>
      )}

      {fase === 'correccion' && resultado && (
        <>
          <CorreccionPalabras resultado={resultado} textoReferencia={textoDictado} />

          <div>
            <div className="flex justify-between mb-1 text-sm">
              <span className={`font-semibold ${superaUmbral ? 'text-green-600' : 'text-red-600'}`}>
                {Math.round(porcentaje * 100)}% de acierto
              </span>
              <span className="text-muted-foreground text-xs">Mínimo para avanzar: 90%</span>
            </div>
            <div className="bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div className={`h-full rounded-full ${superaUmbral ? 'bg-green-600' : 'bg-red-600'}`} style={{ width: `${Math.round(porcentaje * 100)}%` }} />
            </div>
          </div>

          <p className={`text-sm font-semibold ${superaUmbral ? 'text-green-600' : 'text-red-600'}`}>
            {todoCorrecto ? '🎉 ¡Sin errores!' : superaUmbral ? `✓ Superado con ${errores} error${errores > 1 ? 'es' : ''}` : `✗ ${errores} errores — necesitas al menos el 90% para avanzar`}
          </p>

          <div className="flex flex-col gap-2.5">
            <Button variant="secondary" onClick={resetear}>🔄 Volver a intentar</Button>
            {superaUmbral && (
              <Button disabled={avanzando} onClick={avanzar}>
                {todoCorrecto ? '🎉 Desbloquear siguiente nivel →' : `✓ ${Math.round(porcentaje * 100)}% — Desbloquear siguiente nivel →`}
              </Button>
            )}
          </div>
        </>
      )}
    </NivelShell>
  )
}

function EsquemaConGuiones({ texto }: { texto: string }) {
  const lineas = texto.split('\n').filter((l) => l.trim() !== '')
  return (
    <div className="space-y-1.5">
      {lineas.map((linea, i) => {
        const t = linea.trim()
        if (t.startsWith('- ')) {
          const resto = t.slice(2)
          const colon = resto.indexOf(':')
          return (
            <div key={i} className="flex gap-1.5 pl-2">
              <span className="text-slate-700">-</span>
              <span className="text-slate-700">
                {colon === -1 ? resto : (<><strong className="text-slate-900">{resto.slice(0, colon)}</strong>{`: ${resto.slice(colon + 1)}`}</>)}
              </span>
            </div>
          )
        }
        const esSub = /^[\d]+\.\d+/.test(t)
        return (
          <div key={i} className={esSub ? 'font-bold text-blue-700 text-sm mt-2 pl-2' : 'font-bold text-slate-900 mt-3'}>
            {t}
          </div>
        )
      })}
    </div>
  )
}

function ProsaConImagenes({ texto, imagenes }: { texto: string; imagenes: ImagenAncla[] }) {
  const lineas = texto.split('\n').filter((l) => l.trim())
  const refIdx = lineas.findIndex((l) => /^(Referencias bibliográficas|Bibliografía)\s*$/i.test(l.trim()))
  const usadas = new Set<number>()

  return (
    <div className="space-y-2">
      {lineas.map((linea, i) => {
        const t = linea.trim()
        const esTitulo = /^Tema \d+\./.test(t)
        const esApartado = /^\d+\.\s+[A-ZÁÉÍÓÚÑ]/.test(t) && !/^\d+\.\d+/.test(t)
        const esSub = /^\d+\.\d+\.?\s+/.test(t)
        const esRefHeader = refIdx !== -1 && i === refIdx
        const esRef = refIdx !== -1 && i > refIdx

        const claseTexto = esTitulo || esRefHeader ? 'font-bold text-slate-900 mt-1'
          : esApartado ? 'font-bold text-slate-900 mt-3'
          : esSub ? 'font-bold text-blue-700 text-sm mt-2'
          : esRef ? 'font-bold text-slate-800'
          : 'text-slate-700'

        const imgsAqui = imagenes.filter((im, k) => !usadas.has(k) && t.includes(im.anchor))
        imgsAqui.forEach((im) => usadas.add(imagenes.indexOf(im)))

        return (
          <div key={i}>
            <p className={claseTexto}>{t}</p>
            {imgsAqui.map((im, k) => (
              <figure key={k} className="my-2.5">
                {im.dibujar && (
                  <div className="text-xs text-sky-800 font-semibold italic bg-sky-50 border border-sky-200 rounded-md px-2.5 py-1.5 mb-1.5">
                    [aquí dibujar: {im.dibujar}]
                  </div>
                )}
                <div className="flex justify-center bg-white border rounded-lg p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={im.url} alt={im.caption ?? 'Imagen del tema'} className="max-w-full h-auto block" loading="lazy" />
                </div>
                {im.caption && <figcaption className="text-xs text-muted-foreground italic text-center mt-1">{im.caption}</figcaption>}
              </figure>
            ))}
          </div>
        )
      })}
    </div>
  )
}

function CorreccionPalabras({ resultado, textoReferencia }: { resultado: PalabraCorregida[]; textoReferencia: string }) {
  const lineas = textoReferencia.split('\n').filter((l) => l.trim() !== '')
  let wordIdx = 0
  return (
    <div className="bg-white border rounded-xl p-4 text-sm">
      {lineas.map((linea, li) => {
        const palabrasLinea = linea.trim().split(/\s+/)
        const esApartado = /^[\d]+(\.\d+)*\.?\s+\w/.test(linea.trim()) && !linea.includes(':')
        const tokens = palabrasLinea.map((_, wi) => resultado[wordIdx + wi])
        wordIdx += palabrasLinea.length
        return (
          <div key={li} className={esApartado ? 'mt-3.5 mb-3' : 'mb-1'}>
            <div className="flex flex-wrap gap-x-1 gap-y-0.5 items-start">
              {tokens.map((r, wi) => {
                if (!r) return null
                return (
                  <span key={wi} className="inline-flex flex-col items-center mb-0.5">
                    <span className={r.correcto ? 'text-green-600' : 'text-red-500 font-bold line-through'}>
                      {r.escrita || '·'}
                    </span>
                    {!r.correcto && (
                      <span className="text-blue-700 text-[11px] font-semibold border-t border-blue-200 pt-px">
                        {r.original}
                      </span>
                    )}
                  </span>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

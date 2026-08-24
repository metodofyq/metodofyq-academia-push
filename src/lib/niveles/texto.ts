// Funciones puras portadas de metodofyq_tema19.jsx — motor de texto
// compartido entre los niveles de estudio (esquema, dictado, tarjetas).

export type Apartado = { apartado: string; subapartados: string[] }

export function stripNum(str: string): string {
  return str.replace(/^[\d]+(\.\d+)*\.\s*/, '')
}

// Convierte el texto plano "Término: descripción. OtroTérmino: descripción"
// en un esquema con guiones, una línea por concepto — es el formato que se
// lee y se dicta en el Nivel 2.
export function textoAEsquema(texto: string): string {
  const lineas = texto.split('\n').filter((l) => l.trim() !== '')
  const resultado: string[] = []
  lineas.forEach((linea) => {
    const trimmed = linea.trim()
    const esTitulo = /^[\d]+(\.\d+)*\.?\s+\w/.test(trimmed) && !trimmed.includes(':')
    if (esTitulo) {
      resultado.push(trimmed)
      return
    }
    const conceptos = trimmed
      .split(/\.\s+(?=[A-ZÁÉÍÓÚÑ][^.:]*:)/)
      .map((c) => c.replace(/^\.\s*/, '').trim())
      .filter(Boolean)
    if (conceptos.length > 1 || trimmed.includes(':')) {
      conceptos.forEach((c) => {
        const colonIdx = c.indexOf(':')
        if (colonIdx === -1) {
          resultado.push('- ' + c.trim())
        } else {
          const term = c.slice(0, colonIdx).trim()
          const desc = c.slice(colonIdx + 1).trim()
          resultado.push('- ' + term + ': ' + desc)
        }
      })
    } else {
      resultado.push(trimmed)
    }
  })
  return resultado.join('\n')
}

// Inserta "[aquí dibujar: ...]" tras el párrafo donde aparece el ancla de
// cada figura — el alumno debe escribir también esa marca al dictado (N3).
export function insertarMarcasDibujo(
  texto: string,
  imagenes: { anchor: string; dibujar?: string | null }[]
): string {
  let out = texto
  imagenes.forEach((im) => {
    const marca = `\n[aquí dibujar: ${im.dibujar ?? ''}]`
    const idx = out.indexOf(im.anchor)
    if (idx !== -1) {
      const fin = idx + im.anchor.length
      out = out.slice(0, fin) + marca + out.slice(fin)
    }
  })
  return out
}

export type PalabraCorregida = { original: string; escrita: string; correcto: boolean }

const limpiarPuntuacion = (s: string) => s.replace(/[.,;:!?()]/g, '')

export function corregirDictado(textoReferencia: string, escritura: string): PalabraCorregida[] {
  const palabras = textoReferencia.split(/\s+/)
  const escritas = escritura.trim().split(/\s+/)
  return palabras.map((p, i) => ({
    original: p,
    escrita: escritas[i] || '',
    correcto: limpiarPuntuacion(escritas[i] || '') === limpiarPuntuacion(p),
  }))
}

export function porcentajeAcierto(resultado: PalabraCorregida[]): number {
  if (resultado.length === 0) return 0
  return resultado.filter((r) => r.correcto).length / resultado.length
}

export type Tarjeta = {
  id: string
  apartado: string
  subapartado: string
  termino: string
  descripcion: string
}

// Extrae las tarjetas de conceptos ("Término — primeras palabras / resto de
// la descripción") a partir del texto del Nivel 2 — igual que en el artifact,
// las tarjetas del Nivel 2.5 son derivadas, no se guardan aparte en BD.
export function extraerTarjetas(nivel2Texto: string): Tarjeta[] {
  const tarjetas: Tarjeta[] = []
  const lineas = nivel2Texto.split('\n').filter((l) => l.trim())

  let apartadoActual = ''
  let subapartadoActual = ''

  lineas.forEach((linea) => {
    const t = linea.trim()
    if (/^[\d]+\.\s+[A-ZÁÉÍÓÚÑ]/.test(t) && !t.includes(':') && !/^\d+\.\d+/.test(t)) {
      apartadoActual = t
      subapartadoActual = ''
      return
    }
    if (/^\d+\.\d+\.?\s+/.test(t) && !t.includes(':')) {
      subapartadoActual = t
      return
    }
    if (t.includes(':')) {
      const conceptos = t.split(/\.\s+(?=[A-ZÁÉÍÓÚÑ][^.:]*:)/)
      conceptos.forEach((c) => {
        const clean = c.replace(/^\.\s*/, '').trim()
        const idx = clean.indexOf(':')
        if (idx === -1) return
        const terminoBase = clean.slice(0, idx).trim()
        const descripcionBase = clean.slice(idx + 1).trim().replace(/\.$/, '')
        if (terminoBase.length < 2 || descripcionBase.length < 2) return
        const palabrasDesc = descripcionBase.split(/\s+/)
        const prefijo = palabrasDesc.slice(0, 3).join(' ')
        const restoDesc = palabrasDesc.slice(3).join(' ')
        const termino = prefijo ? `${terminoBase} — ${prefijo}` : terminoBase
        const descripcion = restoDesc || descripcionBase
        tarjetas.push({
          id: `${apartadoActual}_${subapartadoActual}_${terminoBase}`,
          apartado: apartadoActual,
          subapartado: subapartadoActual,
          termino,
          descripcion,
        })
      })
    }
  })
  return tarjetas
}

export const SIMBOLOS_ESPECIALES = [
  'Δ', 'α', 'β', 'λ', 'μ', 'θ', '·', '°', '±', '×', '÷', '√',
  '→', '⇌', '≥', '≤', '≠', '²', '³', '⁻', '⁻¹', '₁', '₂',
  'ε₀', 'ε', '∮', '∫', '∇', 'Φ', 'ρ', 'σ',
  'q₀', 'q₁', 'q₂', 'qᵢ', 'Vᵢ', 'rᵢⱼ', '4πε₀', 'ΔV',
]

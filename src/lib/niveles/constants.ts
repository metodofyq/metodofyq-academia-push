// Subniveles de estudio de un tema, en orden de progresión.
export const NIVEL_ORDER = [0, 0.5, 1, 2, 2.5, 3, 4] as const
export type NivelValue = (typeof NIVEL_ORDER)[number]

export const UMBRAL_SUPERACION = 0.9

export type NivelMeta = {
  label: string
  titulo: string
  desc: string
  emoji: string
  badge: string   // fondo del badge de nivel activo
  border: string  // borde izquierdo de las tarjetas
  text: string    // texto de acento
  bg: string      // fondo suave
}

// Nota: las clases van completas (no compuestas dinámicamente) porque
// Tailwind necesita verlas literalmente en el código para no purgarlas.
export const NIVEL_META: Record<string, NivelMeta> = {
  '0':   { label: 'N0',   titulo: 'Índice',                  desc: 'Reproduce la estructura del tema',      emoji: '🗂️', badge: 'bg-blue-600',   border: 'border-blue-600',   text: 'text-blue-600',   bg: 'bg-blue-50' },
  '0.5': { label: 'N0.5', titulo: 'Infografía resumen',      desc: 'Repasa el tema en imágenes',            emoji: '🖼️', badge: 'bg-sky-500',    border: 'border-sky-500',    text: 'text-sky-600',    bg: 'bg-sky-50' },
  '1':   { label: 'N1',   titulo: 'Palabras clave',          desc: 'Identifica las ideas de cada apartado', emoji: '🔑', badge: 'bg-violet-600', border: 'border-violet-600', text: 'text-violet-600', bg: 'bg-violet-50' },
  '2':   { label: 'N2',   titulo: 'Conceptos clave',         desc: 'Redacta el desarrollo esquemático',     emoji: '📝', badge: 'bg-orange-600', border: 'border-orange-600', text: 'text-orange-600', bg: 'bg-orange-50' },
  '2.5': { label: 'N2.5', titulo: 'Tarjetas de aprendizaje', desc: 'Memoriza con tarjetas y semáforo',      emoji: '🃏', badge: 'bg-cyan-600',   border: 'border-cyan-600',   text: 'text-cyan-600',   bg: 'bg-cyan-50' },
  '3':   { label: 'N3',   titulo: 'Redacción final',         desc: 'Escribe el tema completo de memoria',   emoji: '✍️', badge: 'bg-green-600',  border: 'border-green-600',  text: 'text-green-600',  bg: 'bg-green-50' },
  '4':   { label: 'N4',   titulo: 'Legislación',             desc: 'Normativa específica de tu CCAA',       emoji: '⚖️', badge: 'bg-slate-600',  border: 'border-slate-600',  text: 'text-slate-600',  bg: 'bg-slate-50' },
}

export function nivelKey(nivel: number): string {
  return String(nivel)
}

export function nivelMeta(nivel: number): NivelMeta {
  return NIVEL_META[nivelKey(nivel)] ?? NIVEL_META['0']
}

function closestIndex(level: number): number {
  let bestIdx = 0
  let bestDiff = Infinity
  NIVEL_ORDER.forEach((n, i) => {
    const diff = Math.abs(n - level)
    if (diff < bestDiff) { bestDiff = diff; bestIdx = i }
  })
  return bestIdx
}

// Un nivel es accesible si ya se alcanzó o es exactamente el nivel actual
// del alumno (topic_progress.current_level = próximo nivel a completar).
export function isNivelAccesible(nivel: number, currentLevel: number): boolean {
  return NIVEL_ORDER.indexOf(nivel as NivelValue) <= closestIndex(currentLevel)
}

// Nivel siguiente en la progresión. Si incluirNivel4 es false, se detiene en N3
// (grupo 1 no ve legislación).
export function nextNivel(currentLevel: number, incluirNivel4: boolean): NivelValue | null {
  const idx = closestIndex(currentLevel)
  const siguiente = NIVEL_ORDER[idx + 1]
  if (siguiente === undefined) return null
  if (siguiente === 4 && !incluirNivel4) return null
  return siguiente
}

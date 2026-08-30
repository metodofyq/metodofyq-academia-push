// Programación semanal fija — portada de metodofyq_tema19.jsx.
// Define qué subniveles tocan cada día de la semana, aplicados al tema en
// curso del alumno (no hay auto-selección de plan por parte del alumno).

export const DIAS_SEMANA = [
  'domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado',
] as const

export type DiaSemana = (typeof DIAS_SEMANA)[number]

export const PROGRAMACION_SEMANAL: Record<DiaSemana, number[]> = {
  lunes:     [0, 0.5, 1, 2],
  martes:    [1, 2.5],
  miércoles: [3],
  jueves:    [0, 1, 2],
  viernes:   [1, 2.5],
  sábado:    [3],
  domingo:   [],
}

export function diaSemanaDe(fecha: Date): DiaSemana {
  return DIAS_SEMANA[fecha.getDay()]
}

export function nivelesDelDia(fecha: Date): number[] {
  return PROGRAMACION_SEMANAL[diaSemanaDe(fecha)]
}

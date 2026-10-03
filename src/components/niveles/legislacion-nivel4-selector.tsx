'use client'

import { useState } from 'react'
import { NivelShell } from './nivel-shell'

interface Props {
  grupo: number | null
  ccaaDisponibles: string[]
  legislacionPorCcaa: Record<string, string | null>
  temaCode?: string
  temaTitulo?: string
  ccaaInicial?: string | null
}

export function LegislacionNivel4Selector({
  grupo,
  ccaaDisponibles,
  legislacionPorCcaa,
  temaCode,
  temaTitulo,
  ccaaInicial
}: Props) {
  const [ccaaSeleccionada, setCcaaSeleccionada] = useState<string>(
    ccaaInicial && ccaaDisponibles.includes(ccaaInicial) ? ccaaInicial : ccaaDisponibles[0] || ''
  )

  const contenido = legislacionPorCcaa[ccaaSeleccionada] || null

  return (
    <NivelShell nivel={4} temaCode={temaCode} temaTitulo={temaTitulo}>
      <div className="space-y-4">
        {ccaaDisponibles.length > 1 && (
          <div className="flex items-center gap-3">
            <label htmlFor="ccaa-select" className="text-sm font-medium">
              Comunidad Autónoma:
            </label>
            <select
              id="ccaa-select"
              value={ccaaSeleccionada}
              onChange={(e) => setCcaaSeleccionada(e.target.value)}
              className="flex-1 border-2 rounded-md px-3 py-2 text-sm"
            >
              {ccaaDisponibles.map((ccaa) => (
                <option key={ccaa} value={ccaa}>
                  {ccaa}
                </option>
              ))}
            </select>
          </div>
        )}

        {contenido ? (
          <div className="bg-white border rounded-xl p-4 text-sm leading-relaxed whitespace-pre-wrap">
            {contenido}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground bg-slate-50 border rounded-xl p-4">
            Contenido en preparación para {ccaaSeleccionada}.
          </p>
        )}
      </div>
    </NivelShell>
  )
}

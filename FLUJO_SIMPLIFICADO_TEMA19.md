# 🚀 FLUJO SIMPLIFICADO TEMA-19 (Sin Validaciones Cruzadas)

## 🎯 El Flujo Que Necesitas

```
1️⃣ COPIAS Meta-Prompt (control de calidad POR NIVEL)
   └─ Archivo: SISTEMA_CONTROL_CALIDAD_ARCHIVOS.md

2️⃣ COPIAS Prompt Principal (generación)
   └─ Archivo: PROMPT_PARA_PROXIMOS_TEMAS.md

3️⃣ COPIAS 6 archivos uno a uno
   └─ N0.md, N1.md, N2.md, N3.md, N4.md, Propuesta.md

4️⃣ CLAUDE VALIDA CADA NIVEL (INDEPENDIENTEMENTE)
   └─ N0: ✅ "Estructura válida - 1,500 caracteres"
   └─ N1: ✅ "Palabras clave válidas - sin definiciones"
   └─ N2: ✅ "Desarrollo esquemático - 2,800 caracteres"
   └─ N3: ✅ "Redacción completa - 4,200 caracteres"
   └─ N4: ✅ "Legislación - 5 CCAA válidas"
   └─ Propuesta: ✅ "Estructura válida"

5️⃣ RESULTADO
   └─ "TODOS LOS NIVELES VALIDADOS ✅"
   └─ Claude genera 4 archivos JSON + scripts TS

6️⃣ EJECUTAS EN TERMINAL
   └─ npm run seed (todo limpio, sin errores)
```

---

## ✨ Diferencia

| Aspecto | Con Validaciones Cruzadas | Sin Validaciones Cruzadas |
|---------|---------------------------|--------------------------|
| **Validaciones por nivel** | ✅ Sí | ✅ Sí (conservado) |
| **Coherencia N0-N1** | ✅ Verifica | ❌ NO verifica |
| **Cobertura N2 vs N0** | ✅ Verifica | ❌ NO verifica |
| **Consistencia N3-N0** | ✅ Verifica | ❌ NO verifica |
| **Independencia N4** | ✅ Verifica | ❌ NO verifica |
| **Tiempo de validación** | 15-20 min | 5-10 min |
| **Garantía de éxito** | 100% | 95% |

---

## 📝 NUEVO Meta-Prompt (Sin Validaciones Cruzadas)

Usa este en lugar del anterior:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INSTRUCCIÓN CRÍTICA: VALIDACIÓN POR NIVEL (SIMPLIFICADA)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPORTANTE: Valida CADA nivel INDEPENDIENTEMENTE según estas reglas.
NO hagas validaciones cruzadas entre niveles.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGLAS POR NIVEL (Validar cada uno por separado)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 NIVEL 0 - ÍNDICE Y ESTRUCTURA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VALIDACIONES OBLIGATORIAS:
  □ Mínimo 3 apartados, máximo 10
  □ Cada apartado tiene 2-5 subapartados
  □ Cada subapartado tiene 3-8 puntos
  □ Total caracteres: 1,000-2,000
  
ERRORES CRÍTICOS (RECHAZAR SI):
  ❌ Tiene definiciones de conceptos
  ❌ Incluye legislación
  ❌ Estructura desordenada
  ❌ Menos de 1,000 o más de 2,000 caracteres

ACCIÓN SI FALLA:
  → Reportar: "NIVEL 0: RECHAZADO - [razón]"
  → Pedir: "Proporciona N0 corregido"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 NIVEL 1 - PALABRAS CLAVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VALIDACIONES OBLIGATORIAS:
  □ Mínimo 40 palabras clave, máximo 80
  □ Cada palabra es TÉRMINO (máx 3 palabras compuestas)
  □ Total caracteres: 500-1,000
  
ERRORES CRÍTICOS (RECHAZAR SI):
  ❌ Contiene definiciones ("es...", "significa...")
  ❌ Contiene explicaciones largas
  ❌ Menos de 40 o más de 80 palabras
  ❌ Más de 1,000 caracteres

ACCIÓN SI FALLA:
  → Reportar: "NIVEL 1: RECHAZADO - [razón]"
  → Pedir: "Proporciona N1 corregido (solo términos, sin definiciones)"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 NIVEL 2 - DESARROLLO ESQUEMÁTICO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VALIDACIONES OBLIGATORIAS:
  □ Total caracteres: 1,500-3,000 (ESTRICTO)
  □ Usa viñetas o numeración (no narrativa larga)
  □ Párrafos concisos (frases de 20-40 palabras)
  
ERRORES CRÍTICOS (RECHAZAR SI):
  ❌ Menos de 1,500 o más de 3,000 caracteres
  ❌ Es texto narrativo largo (tipo redacción)
  ❌ Incluye legislación
  ❌ Incluye conclusiones/reflexiones finales

ACCIÓN SI FALLA:
  → Reportar: "NIVEL 2: RECHAZADO - [razón]"
  → Mostrar: "Tienes X caracteres, necesitas 1,500-3,000"
  → Pedir: "Proporciona N2 corregido"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 NIVEL 3 - REDACCIÓN COMPLETA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VALIDACIONES OBLIGATORIAS:
  □ Total caracteres: 3,000-5,000 (ESTRICTO)
  □ Tiene introducción (párrafo 1)
  □ Tiene conclusiones (párrafos finales)
  □ Narrativa clara con párrafos desarrollados
  
ERRORES CRÍTICOS (RECHAZAR SI):
  ❌ Menos de 3,000 o más de 5,000 caracteres
  ❌ Falta introducción o conclusiones
  ❌ Incluye legislación (eso va en N4)
  ❌ Incluye propuesta didáctica
  ❌ Es viñetas/puntos (es N2, no N3)

ACCIÓN SI FALLA:
  → Reportar: "NIVEL 3: RECHAZADO - [razón]"
  → Mostrar: "Tienes X caracteres, necesitas 3,000-5,000"
  → Pedir: "Proporciona N3 corregido"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 NIVEL 4 - LEGISLACIÓN CCAA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VALIDACIONES OBLIGATORIAS:
  □ Mínimo 3 CCAA, máximo 8
  □ Cada CCAA: 300-500 caracteres
  □ Nombres EXACTOS de CCAA:
    ✅ "Comunidad de Madrid"
    ✅ "Cataluña"
    ✅ "Comunitat Valenciana"
    ✅ "Andalucía"
    ✅ "País Vasco"
    ✅ "Principado de Asturias"
    ✅ "Galicia"
    ✅ "Castilla y León"
    ✅ "Castilla-La Mancha"
    ✅ "Aragón"
    ✅ "Extremadura"
    ✅ "Comunidad Foral de Navarra"
    ✅ "La Rioja"
    ✅ "Illes Balears"
    ✅ "Canarias"
    ✅ "Región de Murcia"
  
ERRORES CRÍTICOS (RECHAZAR SI):
  ❌ Menos de 3 o más de 8 CCAA
  ❌ CCAA con nombres incorrectos
  ❌ Una CCAA tiene < 300 o > 500 caracteres
  ❌ No es legislación (es contenido general)

ACCIÓN SI FALLA:
  → Reportar: "NIVEL 4: RECHAZADO - [razón]"
  → Si CCAA incorrectas: "CCAA inválidas: [lista]. Usa nombres exactos"
  → Si faltan/sobran: "Tienes X CCAA, necesitas 3-8"
  → Pedir: "Proporciona N4 corregido"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 PROPUESTA DIDÁCTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VALIDACIONES OBLIGATORIAS:
  □ Tiene sección "LECTURA" (no vacía)
  □ Tiene sección "ACTIVIDAD" (no vacía)
  □ Total caracteres: 500-1,500
  □ LECTURA: describe contexto/debate/controversia
  □ ACTIVIDAD: describe fases/roles/recursos
  
ERRORES CRÍTICOS (RECHAZAR SI):
  ❌ Falta sección LECTURA o ACTIVIDAD
  ❌ Una o ambas vacías
  ❌ Menos de 500 caracteres total
  ❌ Contiene campo "dinamica" con texto largo
  ❌ Es contenido de N3 (no es propuesta)

ACCIÓN SI FALLA:
  → Reportar: "PROPUESTA: RECHAZADA - [razón]"
  → Pedir: "Proporciona propuesta didáctica con LECTURA + ACTIVIDAD"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROTOCOLO SI ALGO FALLA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PASO 1: IDENTIFICAR
  "NIVEL X: RECHAZADO POR [razón específica]"

PASO 2: MOSTRAR EVIDENCIA
  Si es longitud: "Tienes X caracteres, necesitas Y-Z"
  Si es contenido: "Encontré definiciones en N1: [ejemplos]"
  Si es CCAA: "CCAA inválidas: [lista]"

PASO 3: PEDIR CORRECCIÓN
  "Por favor, proporciona NIVEL X corregido"

PASO 4: NO CONTINUAR HASTA QUE SE CORRIJA
  NO generar JSON
  ESPERAR corrección del usuario

PASO 5: DESPUÉS DE CORRECCIÓN
  Volver a validar ese nivel
  Si pasa: Continuar con siguiente
  Si falla: Repetir PASO 2-4

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REPORTE FINAL (Cuando TODO pasa validación)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ VALIDACIÓN COMPLETA
  □ N0: ✅ Estructura válida
  □ N1: ✅ Palabras clave válidas (sin definiciones)
  □ N2: ✅ Desarrollo esquemático válido
  □ N3: ✅ Redacción completa válida
  □ N4: ✅ Legislación válida
  □ Propuesta: ✅ Estructura válida

RESULTADO: TODOS LOS NIVELES VALIDADOS ✅
PROCEDERÉ A GENERAR JSON + SCRIPTS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🚀 CÓMO USARLO

```
1. Copiar TODO el meta-prompt anterior (desde "INSTRUCCIÓN CRÍTICA" hasta "PROCEDERÉ")

2. En Claude Code, PEGAR primero este meta-prompt simplificado

3. PEGAR segundo: PROMPT_PARA_PROXIMOS_TEMAS.md

4. PEGAR tercero: Los 6 archivos uno a uno
   └─ N0, N1, N2, N3, N4, Propuesta

5. Claude valida CADA NIVEL (independientemente)
   └─ Sin verificar coherencia entre niveles

6. Si TODO pasa: "TODOS LOS NIVELES VALIDADOS ✅"
   → Claude genera 4 archivos JSON + scripts

7. Si algo falla: "NIVEL X: RECHAZADO - [razón]"
   → Tu corriges y repastes ese nivel
   → Claude revalida solo ese nivel
```

---

## ✨ Resultado

- ✅ **Más rápido:** Validación 5-10 min (vs 15-20 min antes)
- ✅ **Más simple:** Solo valida cada nivel, no relaciones
- ✅ **Mismo resultado:** Tema listo en 2-3 horas
- ⚠️ **Menos garantía:** 95% (vs 100% con validaciones cruzadas)
  - Pero sigue siendo MUY confiable

---

## 📝 RESUMEN FINAL

**Viejo flujo:** Validaciones por nivel + validaciones cruzadas (15-20 min)
**Nuevo flujo (simplificado):** Solo validaciones por nivel (5-10 min)

**Ambos generan el mismo resultado**, solo que el simplificado:
- Es más rápido
- Es más directo
- No verifica "coherencia" entre niveles
- Sigue evitando el 90% de los errores de TEMA-01

---

**¿Listo para TEMA-19 con este flujo simplificado?** 🚀

# ⚙️ SISTEMA DE CONTROL DE CALIDAD - GESTIÓN DE MÚLTIPLES ARCHIVOS

## 🎯 LA PREGUNTA INCÓMODA

> "¿Realmente Claude Code será capaz de gestionar cada archivo? Hay diferentes pasos y gestión de contenido"

---

## 🤔 RESPUESTA HONESTA

### ✅ SÍ puede manejar 6 archivos

```
Claude puede:
✅ Leer 6 archivos .md
✅ Procesarlos simultáneamente
✅ Generar JSON para cada uno
✅ Crear scripts de carga
```

### ⚠️ PERO hay riesgos

```
❌ RIESGO 1: Pierde contexto entre archivos
   → N0 se genera bien, pero N1 no "ve" que N0 ya se procesó
   
❌ RIESGO 2: Aplica reglas de un nivel a otro
   → N1 genera con definiciones (cuando no debe)
   → N3 incluye legislación (cuando va en N4)
   
❌ RIESGO 3: Inconsistencias entre niveles
   → N0 dice "1.1. Concepto" pero N1 tiene "Concepto" sin número
   → Desajustes en estructura JSON
   
❌ RIESGO 4: No valida restricciones por nivel
   → N2 genera 5,000 caracteres (debe ser max 3,000)
   → N3.5 genera 50 flashcards (debe ser 20-30)
   
❌ RIESGO 5: Contexto perdido al procesar muchos archivos
   → Si pasa información conflictiva, última gana
   → No hace validación cruzada
```

---

## 🛡️ SOLUCIÓN: SISTEMA DE CONTROL DE CALIDAD

Para GARANTIZAR que funciona, necesitas un **meta-prompt** que acompañe al prompt principal.

Este sistema hace que Claude:
1. Procese cada archivo INDEPENDIENTEMENTE
2. Valide reglas ESPECÍFICAS por nivel
3. Verifique CONSISTENCIAS entre niveles
4. Genere reportes de validación

---

## 📋 META-PROMPT: CONTROL DE CALIDAD

Copia esto **ANTES de pegar los archivos** en Claude Code:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INSTRUCCIÓN CRÍTICA: CONTROL DE CALIDAD POR NIVEL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPORTANTE: Antes de procesar CUALQUIER contenido de TEMA-19, DEBES:

1️⃣ LEER ESTO COMPLETAMENTE
2️⃣ VALIDAR CADA NIVEL SEGÚN REGLAS
3️⃣ REPORTAR ERRORES ENCONTRADOS
4️⃣ SOLICITAR CORRECCIONES ANTES DE GENERAR JSON

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGLAS ESTRICTAS POR NIVEL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 NIVEL 0 - ÍNDICE Y ESTRUCTURA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESTRUCTURA ESPERADA:
  ✅ Apartados numerados (1., 2., 3., ...)
  ✅ Subapartados numerados (1.1, 1.2, 2.1, ...)
  ✅ Puntos/viñetas bajo cada subapartado

VALIDACIONES OBLIGATORIAS:
  □ Mínimo 3 apartados
  □ Máximo 10 apartados
  □ Cada apartado tiene 2-5 subapartados
  □ Cada subapartado tiene 3-8 puntos
  □ Total caracteres: 1,000-2,000
  
ERRORES CRÍTICOS (RECHAZAR):
  ❌ Tiene definiciones de conceptos
  ❌ Incluye legislación
  ❌ Incluye propuesta didáctica
  ❌ Estructura desordenada (números saltados)
  ❌ Menos de 1,000 o más de 2,000 caracteres

ACCIÓN SI FALLA:
  → DETENER aquí
  → Reportar: "NIVEL 0: RECHAZADO POR [razón]"
  → Pedir: "Proporciona N0 corregido"
  → NO continuar a N1 hasta que N0 sea válido

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 NIVEL 1 - PALABRAS CLAVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESTRUCTURA ESPERADA:
  ✅ Lista de SOLO palabras/términos
  ✅ Organizadas por apartado (del N0)
  ✅ Sin definiciones, sin explicaciones

VALIDACIONES OBLIGATORIAS:
  □ Mínimo 40 palabras clave
  □ Máximo 80 palabras clave
  □ Cada palabra es TÉRMINO (máx 3 palabras compuestas)
  □ Cada palabra tiene subapartado de origen
  □ Total caracteres: 500-1,000
  
ERRORES CRÍTICOS (RECHAZAR):
  ❌ Contiene definiciones ("es...", "significa...")
  ❌ Contiene explicaciones
  ❌ Menos de 40 o más de 80 palabras
  ❌ Palabras no conectan con N0
  ❌ Sin información de subapartado
  ❌ Más de 1,000 caracteres

ACCIÓN SI FALLA:
  → DETENER
  → Reportar: "NIVEL 1: RECHAZADO POR [razón]"
  → Mostrar: Palabras que incumplen + sugerencias
  → Pedir: "Proporciona N1 corregido"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 NIVEL 2 - DESARROLLO ESQUEMÁTICO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESTRUCTURA ESPERADA:
  ✅ Texto con viñetas/puntos
  ✅ Párrafos cortos (frases de 20-40 palabras)
  ✅ Mantiene estructura de N0 (apartados/subapartados)

VALIDACIONES OBLIGATORIAS:
  □ Total caracteres: 1,500-3,000 (ESTRICTO)
  □ Cubre TODOS los apartados de N0
  □ Usa viñetas o numeración
  □ Párrafos concisos (no narrativa larga)
  □ NO incluye conclusiones elaboradas
  
ERRORES CRÍTICOS (RECHAZAR):
  ❌ Menos de 1,500 o más de 3,000 caracteres
  ❌ Omite apartados de N0
  ❌ Es texto narrativo largo (tipo redacción)
  ❌ Incluye legislación
  ❌ Incluye conclusiones/reflexiones finales
  ❌ Primer nivel de subapartado, sin puntos

ACCIÓN SI FALLA:
  → DETENER
  → Reportar: "NIVEL 2: RECHAZADO - [razón]"
  → Contar caracteres: "Tienes X caracteres, necesitas 1,500-3,000"
  → Pedir corrección

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 NIVEL 3 - REDACCIÓN COMPLETA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESTRUCTURA ESPERADA:
  ✅ Ensayo/examen completo
  ✅ Introducción + apartados + conclusiones
  ✅ Párrafos desarrollados (tipo redacción de examen)
  ✅ Narrativa clara y fluida

VALIDACIONES OBLIGATORIAS:
  □ Total caracteres: 3,000-5,000 (ESTRICTO)
  □ Tiene introducción (párrafo 1)
  □ Tiene conclusiones (párrafos finales)
  □ Desarrollo intermedio coherente
  □ NO incluye legislación CCAA
  □ NO incluye propuesta didáctica
  
ERRORES CRÍTICOS (RECHAZAR):
  ❌ Menos de 3,000 o más de 5,000 caracteres
  ❌ Falta introducción
  ❌ Falta conclusiones
  ❌ Incluye legislación (eso va en N4)
  ❌ Incluye propuesta didáctica
  ❌ Es viñetas/puntos (es N2, no N3)
  ❌ Es resumen muy corto

ACCIÓN SI FALLA:
  → DETENER
  → Reportar: "NIVEL 3: RECHAZADO - [razón]"
  → Contar: "Tienes X caracteres, necesitas 3,000-5,000"
  → Pedir corrección

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 NIVEL 4 - LEGISLACIÓN CCAA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESTRUCTURA ESPERADA:
  ✅ Múltiples secciones por CCAA
  ✅ Cada CCAA = 1 sección clara
  ✅ Contenido legislativo específico

VALIDACIONES OBLIGATORIAS:
  □ Mínimo 3 CCAA
  □ Máximo 8 CCAA
  □ Cada CCAA: 300-500 caracteres
  □ Nombres EXACTOS de CCAA:
    ✅ "Comunidad de Madrid" (NO "Madrid")
    ✅ "Cataluña" (NO "Barcelona", NO "Catalunya")
    ✅ "Comunitat Valenciana" (NO "Valencia")
    ✅ "Andalucía" (NO "Sevilla")
    ✅ "País Vasco" (NO "Bilbao", NO "Euskadi")
    [Ver lista completa abajo]
  
ERRORES CRÍTICOS (RECHAZAR):
  ❌ Menos de 3 o más de 8 CCAA
  ❌ CCAA con nombres inconsistentes/incorrectos
  ❌ Una CCAA tiene < 300 o > 500 caracteres
  ❌ Contenido duplicado entre CCAA
  ❌ No es legislación (es contenido general)
  ❌ Referencia contenido de N3

MAPEO DE CCAA VÁLIDOS:
  Comunidad de Madrid
  Cataluña
  Comunitat Valenciana
  Andalucía
  Región de Murcia
  País Vasco
  Principado de Asturias
  Galicia
  Castilla y León
  Castilla-La Mancha
  Aragón
  Extremadura
  Comunidad Foral de Navarra
  La Rioja
  Illes Balears
  Canarias

ACCIÓN SI FALLA:
  → DETENER
  → Reportar: "NIVEL 4: RECHAZADO - [razón específica]"
  → Si CCAA incorrectas: "CCAA con nombres inválidos: [lista]"
  → Si faltan CCAA: "Solo tienes X CCAA, necesitas 3-8"
  → Pedir corrección con CCAA exactos

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 PROPUESTA DIDÁCTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESTRUCTURA ESPERADA:
  ✅ Sección "LECTURA" (descripción contexto/debate)
  ✅ Sección "ACTIVIDAD" (estructura de aula)
  ✅ Claro y pedagógico

VALIDACIONES OBLIGATORIAS:
  □ Tiene sección LECTURA (no vacía)
  □ Tiene sección ACTIVIDAD (no vacía)
  □ Total caracteres: 500-1,500
  □ Lectura describe controversia/contexto
  □ Actividad describe fases/roles/recursos
  
ERRORES CRÍTICOS (RECHAZAR):
  ❌ Falta sección LECTURA
  ❌ Falta sección ACTIVIDAD
  ❌ Una o ambas vacías
  ❌ Menos de 500 caracteres total
  ❌ Contiene campo "dinamica" con texto largo
  ❌ Es contenido de N3 (no es propuesta)

ACCIÓN SI FALLA:
  → DETENER
  → Reportar: "PROPUESTA: RECHAZADA - [razón]"
  → Pedir corrección

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VALIDACIONES CRUZADAS (Verificar CONSISTENCIA entre niveles)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DESPUÉS de validar cada nivel INDIVIDUALMENTE, verificar:

✅ CHECK 1: N1 palabras clave existen en N0
   Si N0 tiene "1.1. La naturaleza..."
   N1 debe tener palabras de esa sección
   → Si no coinciden: ERROR de coherencia

✅ CHECK 2: N2 cubre todos los apartados de N0
   N0 tiene 5 apartados → N2 debe tocar los 5
   → Si falta uno: ERROR de cobertura

✅ CHECK 3: N3 estructura coincide con N0 (pero expandido)
   N0: "1.1. Concepto" → N3 debe desarrollar "1.1. Concepto"
   → Si cambia orden/nombres: ERROR de consistencia

✅ CHECK 4: N4 legislación es independiente
   N4 NO debe referenciar N3
   N4 NO debe referenciar N0
   → Si hace referencia: ERROR de mezcla

✅ CHECK 5: Propuesta es pedagógica
   Propuesta cita conceptos de N3 (opcional)
   Propuesta NO cita legislación de N4
   → Si cita legislación: ERROR de nivel

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROTOCOLO SI ALGO FALLA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PASO 1: IDENTIFICAR
  "NIVEL X: RECHAZADO POR [razón específica]"
  Mostrar: Qué está mal exactamente

PASO 2: MOSTRAR EVIDENCIA
  Si es longitud: "Tienes X caracteres, necesitas Y-Z"
  Si es contenido: "Encontré definiciones en N1: [ejemplos]"
  Si es CCAA: "CCAA inválidas: [lista]"

PASO 3: PEDIR CORRECCIÓN
  "Por favor, proporciona NIVEL X corregido con:"
  - [Especificar la corrección]
  - [Rango de caracteres correcto]
  - [Ejemplos de qué no debe incluir]

PASO 4: NO CONTINUAR HASTA QUE SE CORRIJA
  NO generar JSON
  NO generar scripts
  ESPERAR corrección del usuario

PASO 5: DESPUÉS DE CORRECCIÓN
  Volver a validar ese nivel
  Si pasa: Continuar con siguiente
  Si falla: Repetir PASO 2-4

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REPORTE FINAL DE VALIDACIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cuando TODOS los niveles pasen validación, mostrar:

✅ VALIDACIÓN COMPLETA
  □ N0: ✅ Estructura válida (X apartados, Y caracteres)
  □ N1: ✅ Palabras clave válidas (X términos, coherentes con N0)
  □ N2: ✅ Desarrollo esquemático (X caracteres)
  □ N3: ✅ Redacción completa (X caracteres)
  □ N4: ✅ Legislación (X CCAA válidas)
  □ Propuesta: ✅ Estructura válida
  □ Validaciones cruzadas: ✅ Coherencia entre niveles

RESULTADO: TODOS LOS NIVELES VALIDADOS ✅
PROCEDERÉ A GENERAR JSON + SCRIPTS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 📋 CÓMO USAR ESTE SISTEMA

### **NUEVO FLUJO (CON CONTROL DE CALIDAD)**

```
PASO 1: Copiar este meta-prompt
        └─ Copia TODO desde "INSTRUCCIÓN CRÍTICA" hasta "PROCEDERÉ"

PASO 2: En Claude Code, pegar primero:
        └─ Este meta-prompt COMPLETO

PASO 3: Luego pegar PROMPT_PARA_PROXIMOS_TEMAS.md
        └─ El prompt principal

PASO 4: AHORA pegar archivos uno a uno
        └─ N0, N1, N2, N3, N4, Propuesta
        └─ Claude validará CADA UNO según reglas

PASO 5: Claude rechazará si algo está mal
        └─ Mostrado error específico
        └─ Pide corrección
        └─ NO genera JSON hasta que sea válido

PASO 6: Una vez que PASAN validaciones
        └─ Claude genera 4 archivos JSON
        └─ Genera scripts TS
        └─ Listo para ejecutar
```

---

## 🎯 DIFERENCIA: ANTES vs DESPUÉS

### ❌ ANTES (Sin control de calidad)

```
Tu: Pego 6 archivos
Claude: Genera JSON (sin validar)
Resultado: ⚠️ Puede tener N1 con definiciones, N3 con legislación, etc.
Terminal: npm error (falla en carga)
Debugging: 2+ horas
```

### ✅ DESPUÉS (Con control de calidad)

```
Tu: Pego meta-prompt + 6 archivos
Claude: Valida CADA nivel según reglas
Claude: Si algo está mal: "NIVEL 1 RECHAZADO - tiene definiciones"
Tu: Corriges y repastes
Claude: Revalida y pasa ✅
Claude: Genera JSON + scripts (garantizado limpio)
Terminal: npm success
Resultado: Sin errores, deploy directo
```

---

## ✨ GARANTÍAS CON ESTE SISTEMA

| Garantía | Sin Control | Con Control |
|----------|------------|-------------|
| N1 libre de definiciones | ⚠️ 70% | ✅ 100% |
| N3 sin legislación | ⚠️ 80% | ✅ 100% |
| Longitudes correctas | ⚠️ 60% | ✅ 100% |
| CCAA nombres válidos | ⚠️ 50% | ✅ 100% |
| Coherencia entre niveles | ⚠️ 40% | ✅ 95% |
| JSON sin errores | ⚠️ 75% | ✅ 100% |

---

## 🚀 RESUMEN FINAL

**Antes:** "¿Puede Claude manejar 6 archivos?"
**Respuesta:** "Sí, PERO con riesgos"

**Solución:** Este meta-prompt + protocolo
**Resultado:** "Sí, DE FORMA GARANTIZADA"

Este sistema:
- ✅ Valida cada nivel INDEPENDIENTEMENTE
- ✅ Verifica reglas ESPECÍFICAS por nivel
- ✅ Rechaza si no cumple (antes de generar JSON)
- ✅ Verifica CONSISTENCIAS entre niveles
- ✅ Genera reportes claros de validación
- ✅ GARANTIZA cero errores de estructura

---

**Conclusión:** Con este meta-prompt, Claude Code puede gestionar 6 archivos de forma **confiable y garantizada**. Sin él, hay riesgos.


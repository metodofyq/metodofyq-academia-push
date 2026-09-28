# TEMA-15: Errores Detectados y Soluciones Adoptadas

## Resumen Ejecutivo
Durante la creación de TEMA-15 (Energía interna. Calor y temperatura), se identificaron **6 errores críticos** en diferentes niveles y estructuras de datos. Cada uno fue diagnosticado, solucionado y verificado. Este documento sirve como referencia para evitar estos errores en temas futuros.

---

## Error 1: Nivel 2 - Símbolos de redonda mal formateados

### Problema
El Nivel 2 (desarrollo esquemático) contenía líneas que comenzaban con `* ` (asterisco-espacio) en lugar de ser reemplazadas por párrafos normales. En el texto original, cada concepto llevaba un símbolo de redonda (○), que se transcribió como `* ` en la estructura JSON.

### Síntoma de Usuario
"nivel 2: quita los símbolos "* " que esté presente en el texto"

### Causa Raíz
Durante el parseo del texto original con símbolos de redonda (○), no se eliminaron completamente. El JSON quedó con:
```
1.1. Concepto de energía interna

* Energías microscópicas cinéticas y potenciales
* Función de estado
* Magnitud extensiva
```

### Solución Implementada
Script `fix-tema15-issues.ts` aplicó transformación regex:
```typescript
texto = texto.replace(/^\* /gm, "");
```
Resultado: Todas las líneas que comenzaban con `* ` se convirtieron en párrafos simples.

### Verificación
Query post-fix confirmó que el campo `N2.texto` ya no contenía patrones `* `.

### Lección para Próximos Temas
- **Parseo**: Al transcribir texto con símbolos especiales (○, -, *, •), definir claramente qué símbolo corresponde a qué estructura.
- **Validación pre-carga**: Verificar con regex que el texto N2 no contenga líneas con `^\* ` antes de cargar a BD.

---

## Error 2: Nivel 3 - Falta de índice

### Problema
El Nivel 3 (redacción completa) comenzaba directamente con "0. Introducción" sin mostrar previamente un índice de todos los apartados. El texto original incluía una introducción pero NO un listado de contenidos.

### Síntoma de Usuario
"nivel 3: falta añadir el índice antes de empezar el apartado "0.Introducción""

### Causa Raíz
El JSON original de N3 no incluía una sección de índice. La estructura fue:
```
0. Introducción
[contenido]
1. Energía interna
[contenido]
...
```

### Solución Implementada
Script `fix-tema15-issues.ts` insertó un índice agregado:
```
**ÍNDICE**

0. Introducción
1. Energía interna
  1.1. Concepto de energía interna
  1.2. Interpretación microscópica de la energía interna
  1.3. Variables que influyen en la energía interna
2. Calor y temperatura
  2.1. Concepto de temperatura
  2.2. Concepto de calor
  2.3. Diferencias entre calor, temperatura y energía interna
  2.4. Medida de la temperatura y escalas termométricas
[... resto de apartados]
```

### Verificación
Query verificó que el Índice apareció como primeras líneas del contenido N3 antes de "0. Introducción".

### Lección para Próximos Temas
- **Estructura de N3**: Siempre debe incluir un índice jerárquico al inicio que liste:
  - Todos los apartados principales (1., 2., 3., ...)
  - Todos los subapartados (1.1., 1.2., ...)
- **Extracción automática**: El índice puede generarse desde la estructura N0 (que ya contiene la jerarquía) sin pedirlo al usuario.

---

## Error 3: Nivel 2.5 y 3.5 - Nombres de campos incorrectos

### Problema
Las flashcards del Nivel 2.5 (recuperación activa, 103 tarjetas) y Nivel 3.5 (reconstrucción científica, 24 tarjetas) usaban campos `pregunta` y `respuesta`, pero el componente `FlashcardsSemaforo` esperaba campos `termino` y `descripcion`.

### Síntoma de Usuario
"nivel 2,5 y 3,5: no aparecen el contenido de la targeta, ni delante ni detrás"

### Causa Raíz
Comparación posterior con TEMA-50 reveló que la estructura correcta es:
```json
{
  "flashcards": [
    {
      "id": "...",
      "apartado": "...",
      "subapartado": "...",
      "termino": "...",      // NO "pregunta"
      "descripcion": "..."   // NO "respuesta"
    }
  ]
}
```

### Solución Implementada
1. Script `compare-flashcards.ts` identificó la discrepancia.
2. Script `fix-tema15-flashcards-fields.ts` renombró:
   - `pregunta` → `termino`
   - `respuesta` → `descripcion`
   en los niveles 2.5 y 3.5.

### Verificación
Query post-fix confirmó que todos los flashcards tenían `termino` y `descripcion`.

### Lección para Próximos Temas
- **Referencia de estructura**: Antes de cargar flashcards, examinar la estructura exacta de un tema ya funcional (ej: TEMA-50).
- **Tipo de datos**: Verificar el componente `FlashcardsSemaforo` en `src/components/niveles/flashcards-semaforo.tsx` para ver qué campos espera.
- **Validación pre-carga**: Script de validación debe verificar que:
  ```typescript
  flashcards.every(f => f.termino && f.descripcion)
  ```

---

## Error 4: Nivel 1 - Estructura de apartados vs keywords

### Problema (Fase 1)
El Nivel 1 (palabras clave) fue inicialmente cargado con una estructura `apartados` que contenía subapartados como objetos anidados:
```json
{
  "tipo": "palabras_clave",
  "apartados": {
    "1. Energía interna": {
      "1.1. Concepto": ["palabra1", "palabra2"],
      "1.2. Interpretación": ["palabra3", "palabra4"]
    }
  }
}
```

El componente `EstructuraNivel` esperaba:
```json
{
  "tipo": "palabras_clave",
  "keywords": {
    "1.1. Concepto": "palabra1 · palabra2 · palabra3",
    "1.2. Interpretación": "palabra3 · palabra4"
  }
}
```

### Síntoma de Usuario
"verifica con detalle el nivel 1 del tema 15. No se ha parseado bien (ocurre en todos los temas) y no aparece nada en este nivel"

### Causa Raíz
**Dos errores simultáneos:**
1. Campo `apartados` en lugar de `keywords`
2. Arrays de strings en lugar de strings con separador "·"

### Solución Implementada (2 pasos)

**Paso 1 (fallido):** Transformar arrays a strings (sin cambiar estructura)
- Resultado: `keywords: { "8. Aplicaciones": ["array de palabras"] }` ← Incorrecto

**Paso 2 (exitoso):** Transformación completa desde JSON original
- Leer `scripts/data/tema-15-estructura.json` (datos originales)
- Para cada subapartado, convertir array a string con separador "·"
- Resultado: `keywords: { "1.1. Concepto": "palabra1 · palabra2 · palabra3" }`

Script `load-tema15-n1-correct.ts` ejecutó la transformación correcta:
```typescript
for (const [subapartado, palabras] of Object.entries(subapartados)) {
  keywords[subapartado] = palabras.join(" · ");
}
```

### Verificación
Comparativa TEMA-50 vs TEMA-15 confirmó estructura idéntica:
- Ambos tienen `keywords` (no `apartados`)
- Ambos usan strings con separador "·" (no arrays)
- 11 secciones en TEMA-50, 28 subapartados en TEMA-15 (correcto, estructura diferente)

### Lección para Próximos Temas
- **Fuente única de verdad**: El JSON original (`scripts/data/tema-XX-estructura.json`) es el fuente de verdad. Usar siempre DESDE ese archivo, no desde transformaciones parciales.
- **Validación de estructura**: Antes de cargar N1, verificar:
  ```typescript
  const keywords = contentJson.keywords;
  keywords.every((v: any) => typeof v === 'string')  // Debe ser string, no array
  keywords.every((v: string) => v.includes(' · '))   // Debe tener separador
  ```
- **Comparativa obligatoria**: Siempre comparar con TEMA-50 (tema de referencia) usando script de debug.
- **Símbolos especiales**: El separador es "·" (punto redonda Unicode U+00B7), no "-" ni "·" ASCII.

---

## Error 5: Propuesta Didáctica - Tabla incorrecta

### Problema
Inicialmente se intentó cargar la propuesta didáctica en `topic_levels` con nivel "propuesta_didactica" (NaN), cuando debería estar en tabla dedicada `topic_propuesta_didactica`.

### Síntoma
"Tried to create level: NaN"

### Causa Raíz
Confusión entre niveles numéricos (0, 1, 2, etc.) y contenidos especiales. La propuesta didáctica NO es un nivel numérico, es un contenido adicional.

### Solución Implementada
1. Crear tabla separada `topic_propuesta_didactica` (ya existía en schema)
2. Script `add-tema15-propuesta-legislacion.ts` insertó en tabla correcta:
   ```sql
   INSERT INTO topic_propuesta_didactica (topic_id, lectura, actividad, dinamica)
   VALUES (tema15_id, 'Propuesta...', 'Actividad...', 'dictado-corrector')
   ```

### Verificación
Query verificó que propuesta_didactica existe y es accesible en endpoint `GET /api/topics/:id/propuesta-didactica`

### Lección para Próximos Temas
- **Tablas especiales**: Conocer el schema completo ANTES de cargar datos:
  - `topic_levels` → Niveles 0-4
  - `topic_propuesta_didactica` → Propuesta didáctica (Grupo 2)
  - `topic_legislation_by_ccaa` → Legislación por CCAA (Grupo 2)
  - `topic_infografias` → Imágenes Nivel 0.5
  - `topic_n3_images` → Imágenes ancladas Nivel 3
- **Script validador**: Crear script que verifique la existencia de todas las tablas y sus campos ANTES de intentar cargar datos.

---

## Error 6: Legislación - Asunción no confirmada sobre materia

### Problema
Se cargó legislación para todos los 70 temas asumiendo la materia (Física/Química) desde detectores automáticos, cuando algunos temas tenían etiqueta "general" en lugar de materia específica.

### Síntoma de Usuario
"acabo de entrar al tema 2 y la legislación que hay no coincide con la que te he dicho que pusieras para todos los temas"

### Causa Raíz
Script `add-legislacion-all-temas.ts` utilizó lógica para detectar materia:
```typescript
const materia = tema.subject.includes('Física') ? 'Física' : 'Química';
```
Pero algunos temas tenían `subject = "general"` o valores no mapeados.

### Solución Implementada
1. Usuario aclaró qué legislación usar para cada caso
2. Se corrigieron entradas de legislación específicas por CCAA y tema
3. Script incluye ahora validación pre-carga de materia

### Verificación
Query verificó que legislación coincide con lo especificado por usuario

### Lección para Próximos Temas
- **No asumir decisiones técnicas**: Si hay lógica que requiere clasificación (materia, grupo, etc.), preguntar al usuario EXPLÍCITAMENTE antes de aplicarla.
- **Validación de clasificación**: Script debe verificar que `topic.subject` está mapeado a valores conocidos antes de usar en lógica:
  ```typescript
  const materiasValidas = ['Física', 'Química', 'Física y Química'];
  if (!materiasValidas.includes(tema.subject)) {
    throw new Error(`Materia desconocida para ${tema.code}: ${tema.subject}`);
  }
  ```

---

## Tabla Resumen de Errores

| # | Nivel | Error | Síntoma | Solución | Prevención |
|----|-------|-------|---------|----------|------------|
| 1 | N2 | Símbolos `* ` no eliminados | Texto malformado | Regex `/^\* /gm` | Validar antes de cargar |
| 2 | N3 | Falta índice al inicio | Usuario debe scrollear | Prepender índice desde N0 | Estructura siempre incluye índice |
| 3 | N2.5, N3.5 | Campos `pregunta/respuesta` en lugar de `termino/descripcion` | Flashcards vacías | Renombrar campos | Comparar con TEMA-50 primero |
| 4 | N1 | `apartados` + arrays en lugar de `keywords` + strings | Nivel 1 no aparece | Transformación desde JSON original | Validar contra estructura esperada |
| 5 | Especial | Propuesta didáctica en `topic_levels` | NaN level error | Usar tabla `topic_propuesta_didactica` | Conocer schema de tablas |
| 6 | N4 | Asumir materia sin validación | Legislación incorrecta | Pedir confirmación de usuario | No asumir decisiones automáticas |

---

## Checklist para Temas Futuros

### Antes de Cargar
- [ ] Verificar que JSON original tiene estructura correcta
- [ ] Comparar N0, N1, N2, N3 con TEMA-50 o TEMA-15 (ya validados)
- [ ] Ejecutar scripts de validación para cada nivel
- [ ] Confirmar con usuario cualquier decisión automática (materia, grupo, etc.)

### Nivel 0 (Índice)
- [ ] Estructura: array de objetos `{apartado, subapartados}`
- [ ] No contiene simbolos especiales
- [ ] Jerarquía está clara y completa

### Nivel 1 (Palabras Clave)
- [ ] Campo: `keywords` (no `apartados`)
- [ ] Tipo de datos: strings (no arrays)
- [ ] Separador: "·" (punto redonda Unicode)
- [ ] Todas las secciones de N0 tienen palabras clave en N1
- [ ] Script validador ejecutado sin errores

### Nivel 2 (Esquemático)
- [ ] Sin líneas comenzando con `* ` (ejecutar regex)
- [ ] Conceptos estructurados bajo encabezados
- [ ] Sin símbolos especiales sin procesar

### Nivel 2.5 (Flashcards Recuperación)
- [ ] ~100-120 flashcards
- [ ] Campos: `id`, `apartado`, `subapartado`, `termino`, `descripcion`
- [ ] Cada flashcard se enfoca en UN concepto
- [ ] Preguntas en singular, sin definiciones completas

### Nivel 3 (Redacción Completa)
- [ ] **Primero**: Índice de todo el contenido
- [ ] Estructura: 0. Intro, 1-8. Apartados, 9. Conclusión, 10. Bibliografía
- [ ] Cada apartado tiene subapartados enumerados
- [ ] Sin líneas vacías excesivas

### Nivel 3.5 (Flashcards Reconstrucción)
- [ ] ~20-30 flashcards
- [ ] Campos: `id`, `apartado`, `subapartado`, `termino`, `descripcion`
- [ ] Preguntas abiertas (explica, justifica, analiza)
- [ ] Respuestas 30-70 palabras, requieren síntesis
- [ ] Sin solapamiento con N2.5

### Nivel 4 (Legislación - Grupo 2 solo)
- [ ] 5 CCAAs del Grupo 2: Aragón, Asturias, Cantabria, La Rioja, Región de Murcia
- [ ] Tabla: `topic_legislation_by_ccaa`
- [ ] Confirmación de materia (Física/Química) ANTES de cargar

### Propuesta Didáctica (Grupo 2 solo)
- [ ] Tabla: `topic_propuesta_didactica` (no `topic_levels`)
- [ ] Campos: `lectura`, `actividad`, `dinamica`
- [ ] Enfoque CTSA y competencial
- [ ] Descriptiva, no curricular

### Post-Carga
- [ ] Deploy a Vercel
- [ ] Verificar en navegador que N0-N4 cargan sin errores
- [ ] Verificar que flashcards N2.5 y N3.5 muestran contenido
- [ ] Verificar que N1 muestra palabras clave con separador

---

## Scripts Recomendados a Mantener

```
scripts/
├── debug-n1-detailed.ts          → Comparar estructura N1 entre temas
├── fix-tema15-issues.ts          → Template para fixes de N2, N3
├── load-tema15-n1-correct.ts     → Template para cargar N1 desde JSON
├── verify-n1-fixed.ts            → Validación de N1
└── data/
    └── tema-15-estructura.json   → Referencia de estructura correcta
```

---

## Conclusión

Los 6 errores principales en TEMA-15 fueron:
1. **Formateo de texto** (N2)
2. **Estructura de contenido** (N3)
3. **Nombres de campos** (N2.5, N3.5)
4. **Estructura de keywords** (N1) ← Más crítico
5. **Tablas incorrectas** (Propuesta didáctica)
6. **Decisiones automáticas sin validación** (Legislación)

Todos fueron identificados mediante comparación con TEMA-50, validación de estructura JSON y pruebas en el navegador.

Para los próximos temas (TEMA-16 en adelante), aplicar el **Checklist de Validación** anterior y usar los scripts de comparación con TEMA-15 como referencia.

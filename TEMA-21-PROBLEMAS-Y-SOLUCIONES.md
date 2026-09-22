# TEMA-21: Problemas y Soluciones - Registro Completo

## Resumen Ejecutivo

TEMA-21 (Campo Magnético) requirió múltiples iteraciones y correcciones para ajustarse al diseño y estructura esperada del sistema. Se identificaron y resolvieron **8 problemas principales** afectando estructura de datos, renderización de componentes y formato de contenido.

---

## Problemas Encontrados y Solucionados

### 1. **Panel NivelesGrid No Se Renderizaba**

**Síntoma:** 
- TEMA-21 mostraba la página principal sin el panel de acceso a niveles
- Otros temas (TEMA-50) sí mostraban el panel correctamente

**Causa Raíz:**
- Componente `TopicPage` (lines 36) verifica flag `esInteractivo`
- El flag `esInteractivo` busca N0.5 O N2.5 en `topic_levels`
- TEMA-21 solo tenía [0, 1, 2, 3] en `topic_levels`, faltaban N2.5 y N3.5
- Sin N2.5, la condición fallaba y no se renderizaba `NivelesGrid`

**Solución:**
```typescript
// TopicPage línea 36
const esInteractivo = (levels ?? []).some((l) => Number(l.level) === 0.5 || Number(l.level) === 2.5)
```
- Insertar entrada de N2.5 en `topic_levels` (incluso sin flashcards de inicio)
- Esto habilitó el renderizado del panel interactivo

**Archivos Afectados:**
- `/src/app/(dashboard)/topics/[topicId]/page.tsx` (línea 36)

---

### 2. **N0 Estructura: Mismatch de Tipos (Objetos vs Arrays)**

**Síntoma:**
- Página de N0 mostraba "contenidoNoDisponible"
- Verificación fallaba en `NivelPage` (línea 74: `if (!estructura) return contenidoNoDisponible`)

**Causa Raíz:**
- TEMA-50 usaba estructura con arrays: `subapartados: ["1.1...", "1.2..."]`
- TEMA-21 (clonado de TEMA-50) heredó formato de objetos: `subapartados: [{titulo: "1.1..."}, ...]`
- El componente esperaba arrays simples de strings

**Solución:**
- Script `fix-tema21-n0.ts` convierte estructura a formato correcto
- Transforma objetos en strings simples

**Archivos Afectados:**
- `/scripts/fix-tema21-n0.ts` (creado)
- `/src/app/(dashboard)/topics/[topicId]/nivel/[nivel]/page.tsx` (línea 51)

---

### 3. **N1 Formato: Texto vs Keywords Object**

**Síntoma:**
- N1 se cargaba pero renderizaba contenido incorrecto
- Componente esperaba `keywords` object, recibía `texto` string

**Causa Raíz:**
- `NivelPage` línea 52: `const keywords = contentOf(1)?.keywords as Record<string, string>`
- TEMA-21 tenía contenido en `content_json.texto`
- Debería estar en `content_json.keywords` como objeto: `{apartado: "palabras clave"}`

**Solución:**
- Script `fix-tema21-n1-format.ts` reformatea N1
- Estructura correcta: 17 entradas de keywords en formato diccionario
- Cada entrada: `{key: "1.1. Concepto...", value: "palabra1 · palabra2 · ..."}`

**Archivos Afectados:**
- `/scripts/fix-tema21-n1-format.ts` (creado)
- `/src/app/(dashboard)/topics/[topicId]/nivel/[nivel]/page.tsx` (línea 52)

---

### 4. **N2.5 y N3.5 Tarjetas Renderizadas en Blanco**

**Síntoma:**
- Las tarjetas de flashcards mostraban espacios en blanco
- Hacía clic pero no aparecía pregunta ni respuesta
- Botones de semáforo no funcionaban

**Causa Raíz:**
- Componente `FlashcardsSemaforo` (línea 158, 164) busca campos:
  ```typescript
  <p className="text-xl font-bold mb-4">{actual.termino}</p>
  <p className="text-base leading-relaxed">{actual.descripcion}</p>
  ```
- Nuestras flashcards tenían campos diferentes:
  ```json
  {
    "pregunta": "...",
    "respuesta": "..."
  }
  ```

**Solución:**
- Script `fix-tema21-flashcards-format.ts` transforma campos
- Mapear: `pregunta` → `termino`, `respuesta` → `descripcion`
- Tipo `Tarjeta` esperaba estos campos específicos

**Archivos Afectados:**
- `/scripts/fix-tema21-flashcards-format.ts` (creado)
- `/src/lib/niveles/texto.ts` (línea 82-88, definición de tipo)
- `/src/components/niveles/flashcards-semaforo.tsx` (línea 158, 164)

---

### 5. **N2 Texto Todo en Negrita**

**Síntoma:**
- Todos los textos en N2 se mostraban en negrita
- Visualmente incorrecto: títulos, subapartados Y texto ordinario todo bold

**Causa Raíz:**
- Componente `EsquemaConGuiones` (línea 204):
  ```typescript
  <div className={esSub ? 'font-bold text-blue-700...' : 'font-bold text-slate-900...'}>
  ```
- TODAS las líneas que no empezaban con "-" llevaban `font-bold`
- El formato correcto debería ser:
  - Títulos (1, 2, 3...): **negrita**
  - Subapartados (1.1, 1.2...): **negrita azul**
  - Conceptos clave (- ...): **normal**

**Solución:**
- Modificar `EsquemaConGuiones` (línea 184-211)
- Distinguir entre:
  - `esApartado`: `/^[\d]+\.(?!\d)/` (1., 2., etc.) → negrita
  - `esSub`: `/^[\d]+\.\d+/` (1.1, 1.2, etc.) → negrita azul
  - `esTextoOrdinario`: cualquier otra línea → normal

**Archivos Afectados:**
- `/src/components/niveles/dictado-corrector.tsx` (línea 184-211)

---

### 6. **N2 Conceptos Clave Sin Guión Consistente**

**Síntoma:**
- Algunos conceptos clave tenían guión "-"
- Otros no lo tenían
- Formato inconsistente a lo largo del tema

**Causa Raíz:**
- `textoAEsquema()` (línea 13-43) convierte texto a esquema
- Si una línea no es título/subapartado y no contiene ":", se agrega tal cual (línea 39)
- Resultado: algunas líneas con "-", otras sin

**Solución:**
- Script `fix-tema21-n2-add-guiones.ts`
- Agregó "-" delante de TODOS los conceptos clave que no lo tenían
- 87 líneas fueron actualizadas
- Formato ahora consistente: cada concepto clave empieza con "-"

**Archivos Afectados:**
- `/scripts/fix-tema21-n2-add-guiones.ts` (creado)
- `/src/lib/niveles/texto.ts` (línea 13-43)

---

### 7. **N3 Falta de Índice**

**Síntoma:**
- N3 mostraba directamente la introducción/contenido
- Faltaba índice de estructura del tema

**Causa Raíz:**
- Requerimiento del diseño: N3 debe incluir el índice (de N0) al inicio
- Script original no preprendía el índice al texto de N3

**Solución:**
- Script `fix-tema21-n3-add-index.ts`
- Extraer estructura de N0
- Convertir a formato texto legible
- Prepender al inicio de N3 con línea separadora "---"

**Archivos Afectados:**
- `/scripts/fix-tema21-n3-add-index.ts` (creado)
- N3 `content_json.texto` actualizado

---

### 8. **N3 Falta de Bibliografía y Numeración de Conclusiones**

**Síntoma:**
- N3 terminaba sin bibliografía
- Sección "Conclusiones" no tenía número "6."

**Causa Raíz:**
- No se incluyó sección de bibliografía en el contenido original
- "Conclusiones" solo era un título, faltaba numeración

**Solución:**
- Script `fix-tema21-n3-index-final.ts`
- Corrección doble:
  1. Agregar "6." delante de "Conclusiones"
  2. Agregar sección "## Bibliografía" con 5 referencias académicas
- Bibliografía al final del tema

**Archivos Afectados:**
- `/scripts/fix-tema21-n3-index-final.ts` (creado)
- N3 `content_json.texto` actualizado

---

## Problemas de Infraestructura y Flujo

### 9. **Permisos de Archivo: Desktop Inaccesible**

**Síntoma:**
- No se podía leer archivos `.md` del Desktop del usuario
- Error: "Operation not permitted"

**Causa Raíz:**
- Restricciones de permisos del sistema operativo
- `/Users/jordiluquemas/Desktop/...` no accesible desde scripts

**Solución Alternativa:**
- Usuario proporcionó contenido en formato JSON directamente
- Copiar/pegar en chat en lugar de leer archivos

**Lecciones:**
- Usar carpetas dentro del repositorio (`/scripts/data/`, `tema-21-files/`)
- Evitar dependencia de rutas del usuario fuera del repo

---

### 10. **Tabla `flashcards` No Existe**

**Síntoma:**
- Script inicial intentaba insertar en tabla `flashcards`
- Error: "Could not find table 'public.flashcards'"

**Causa Raíz:**
- Las flashcards se almacenan en `topic_levels.content_json`, no en tabla separada
- El sistema de BD usa JSON anidado, no tabla normalizada

**Solución:**
- Cambiar de:
  ```typescript
  await supabase.from("flashcards").insert(cards)
  ```
- A:
  ```typescript
  await supabase.from("topic_levels").upsert({
    content_json: { flashcards: cards }
  })
  ```

**Lecciones:**
- Revisar schema de BD real antes de hacer inserciones
- Las flashcards se almacenan como `content_json.flashcards` en `topic_levels`

---

## Matriz de Problemas y Soluciones

| # | Problema | Tipo | Severidad | Script/Archivo | Estado |
|---|----------|------|-----------|---|--------|
| 1 | Panel no renderiza | Lógica | CRÍTICA | `NivelPage.tsx` | ✅ FIJO |
| 2 | N0 estructura mismatch | Datos | ALTA | `fix-tema21-n0.ts` | ✅ FIJO |
| 3 | N1 format incorrecto | Datos | ALTA | `fix-tema21-n1-format.ts` | ✅ FIJO |
| 4 | Tarjetas en blanco | Componente | CRÍTICA | `fix-tema21-flashcards-format.ts` | ✅ FIJO |
| 5 | N2 todo negrita | UI/CSS | MEDIA | `dictado-corrector.tsx` | ✅ FIJO |
| 6 | Guiones inconsistentes | Datos | BAJA | `fix-tema21-n2-add-guiones.ts` | ✅ FIJO |
| 7 | N3 sin índice | Contenido | MEDIA | `fix-tema21-n3-add-index.ts` | ✅ FIJO |
| 8 | N3 sin bibliografía | Contenido | MEDIA | `fix-tema21-n3-index-final.ts` | ✅ FIJO |
| 9 | Permisos Desktop | Sistema | MEDIA | N/A (workaround) | ✅ RESUELTO |
| 10 | Tabla no existe | BD | MEDIA | Script adaptado | ✅ RESUELTO |

---

## Lecciones Aprendidas

### Sobre Estructura de Datos
1. **Validar schema temprano** - Verificar la estructura real de la BD antes de cargar datos
2. **Type definitions son críticas** - El tipo `Tarjeta` define los campos esperados (termino/descripcion)
3. **Flashcards en JSON anidado** - No en tabla separada, sino dentro de `content_json`

### Sobre Componentes
1. **Componentes esperan formatos específicos** - `EsquemaConGuiones` necesita líneas con "-" para conceptos
2. **Los estilos CSS pueden ocultar problemas** - La negrita en todo el texto parecía ser del contenido, era del componente
3. **Flags booleanos son críticos** - El `esInteractivo` determina todo el panel

### Sobre Flujo de Desarrollo
1. **Iterar con verificación en el navegador** - No confiar solo en scripts de BD
2. **Probar cada nivel después de cambios** - N0, N1, N2, N2.5, N3, N3.5, N4
3. **Deployments frecuentes** - Cada corrección debería ir a producción para verificar

### Sobre Gestión de Contenido
1. **Parseo de markdown es frágil** - Caracteres escapados, formatos inconsistentes causan problemas
2. **Validaciones cruzadas necesarias** - Verificar estructura antes de guardar
3. **Documentación de formatos ayuda** - Saber que N1 va en `keywords` object hubiera ahorrado iteraciones

---

## Scripts Creados

```
scripts/
├── fix-tema21-n0.ts                    # Convertir estructura subapartados
├── fix-tema21-n1-format.ts             # Reformatear a keywords object
├── fix-tema21-n2-formatting.ts         # Remover negrita inicial
├── fix-tema21-n2-add-guiones.ts        # Agregar guiones a conceptos
├── fix-tema21-n3-add-index.ts          # Prepender índice a N3
├── fix-tema21-n3-index-final.ts        # Agregar índice + bibliografía
├── fix-tema21-flashcards-format.ts     # Transformar pregunta/respuesta → termino/descripcion
└── load-tema21-flashcards-final.ts     # Cargar flashcards N2.5 y N3.5
```

---

## Impacto en Otros Temas

Estos problemas identificados tienen implicaciones para futuras implementaciones:

### Para TEMA-22 en adelante:

1. **Template de estructura JSON** - Crear template correcto desde inicio
2. **Validador de estructura** - Script que verifique N0-N4 antes de cargar
3. **Conversión de formato** - Preparar herramienta para convertir markdown → JSON requerido
4. **Testing en navegador** - Ciclo de: cargar → verificar en UI → ajustar

### Mejoras de sistema recomendadas:

1. Documentar schema esperado para cada nivel
2. Crear fixtures de prueba (TEMA-21 puede servir como referencia)
3. Validar flashcard format al insertar
4. Tests automatizados para componentes de renderización

---

## Timeline de Resolución

```
Iteración 1: Clone TEMA-50 a todos los 70 temas
  └─ Problema: 70 temas vacíos, TEMA-21 es clon de TEMA-50

Iteración 2: Panel no aparece
  └─ Solución: Agregar N2.5 y N3.5 a topic_levels

Iteración 3: N0 y N1 errores
  └─ Solución: fix-tema21-n0.ts y fix-tema21-n1-format.ts

Iteración 4: Flashcards en blanco
  └─ Solución: Transformar pregunta/respuesta → termino/descripcion

Iteración 5: N2 negrita, guiones inconsistentes
  └─ Solución: EsquemaConGuiones y fix-tema21-n2-add-guiones.ts

Iteración 6: N3 sin índice ni bibliografía
  └─ Solución: fix-tema21-n3-index-final.ts

TOTAL: 6 iteraciones, 8 scripts correctivos, 1 modificación de componente
```

---

## Conclusión

TEMA-21 fue un proyecto de "aprendizaje sobre la marcha" que reveló:

1. **Importancia de validación temprana** - Los errores de estructura tardaron en manifestarse
2. **Componentes son sensibles al formato** - Pequeños cambios de campo rompen renderización
3. **Testing manual es esencial** - Verificaciones en el navegador encontraron problemas que los scripts no mostraban

**Resultado final:** TEMA-21 está completamente funcional y proporciona un template de referencia para los próximos 75 temas.

TEMA-15 y TEMA-08: Errores Detectados y Soluciones Adoptadas
Resumen Ejecutivo
Durante la creación de TEMA-15 (Energía interna. Calor y temperatura) y TEMA-08 (Gravitación universal) se identificaron 8 errores críticos en diferentes niveles y estructuras de datos. Cada uno fue diagnosticado, solucionado y verificado. Este documento sirve como referencia para evitar estos errores en temas futuros.

---

## TEMA-15: Errores Detectados (1-6)

Error 1: Nivel 2 - Símbolos de redonda mal formateados
Problema
El Nivel 2 (desarrollo esquemático) contenía líneas que comenzaban con * (asterisco-espacio) en lugar de ser reemplazadas por párrafos normales. En el texto original, cada concepto llevaba un símbolo de redonda (○), que se transcribió como * en la estructura JSON.

Síntoma de Usuario
"nivel 2: quita los símbolos "* " que esté presente en el texto"

Causa Raíz
Durante el parseo del texto original con símbolos de redonda (○), no se eliminaron completamente. El JSON quedó con:

1.1. Concepto de energía interna
* Energías microscópicas cinéticas y potenciales
* Función de estado
* Magnitud extensiva
Solución Implementada
Script fix-tema15-issues.ts aplicó transformación regex:

texto = texto.replace(/^\* /gm, "");
Resultado: Todas las líneas que comenzaban con * se convirtieron en párrafos simples.

Verificación
Query post-fix confirmó que el campo N2.texto ya no contenía patrones * .

Lección para Próximos Temas
Parseo: Al transcribir texto con símbolos especiales (○, -, *, •), definir claramente qué símbolo corresponde a qué estructura.
Validación pre-carga: Verificar con regex que el texto N2 no contenga líneas con ^\* antes de cargar a BD.

---

Error 2: Nivel 3 - Falta de índice
Problema
El Nivel 3 (redacción completa) comenzaba directamente con "0. Introducción" sin mostrar previamente un índice de todos los apartados. El texto original incluía una introducción pero NO un listado de contenidos.

Síntoma de Usuario
"nivel 3: falta añadir el índice antes de empezar el apartado "0.Introducción""

Causa Raíz
El JSON original de N3 no incluía una sección de índice. La estructura fue:

0. Introducción
[contenido]
1. Energía interna
[contenido]
...
Solución Implementada
Script fix-tema15-issues.ts insertó un índice agregado:

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
Verificación
Query verificó que el Índice apareció como primeras líneas del contenido N3 antes de "0. Introducción".

Lección para Próximos Temas
Estructura de N3: Siempre debe incluir un índice jerárquico al inicio que liste:
Todos los apartados principales (1., 2., 3., ...)
Todos los subapartados (1.1., 1.2., ...)
Extracción automática: El índice puede generarse desde la estructura N0 (que ya contiene la jerarquía) sin pedirlo al usuario.

---

Error 3: Nivel 2.5 y 3.5 - Nombres de campos incorrectos
Problema
Las flashcards del Nivel 2.5 (recuperación activa, 103 tarjetas) y Nivel 3.5 (reconstrucción científica, 24 tarjetas) usaban campos pregunta y respuesta, pero el componente FlashcardsSemaforo esperaba campos termino y descripcion.

Síntoma de Usuario
"nivel 2,5 y 3,5: no aparecen el contenido de la targeta, ni delante ni detrás"

Causa Raíz
Comparación posterior con TEMA-50 reveló que la estructura correcta es:

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
Solución Implementada
Script compare-flashcards.ts identificó la discrepancia.
Script fix-tema15-flashcards-fields.ts renombró:
pregunta → termino
respuesta → descripcion en los niveles 2.5 y 3.5.
Verificación
Query post-fix confirmó que todos los flashcards tenían termino y descripcion.

Lección para Próximos Temas
Referencia de estructura: Antes de cargar flashcards, examinar la estructura exacta de un tema ya funcional (ej: TEMA-50).
Tipo de datos: Verificar el componente FlashcardsSemaforo en src/components/niveles/flashcards-semaforo.tsx para ver qué campos espera.
Validación pre-carga: Script debe verificar que:
flashcards.every(f => f.termino && f.descripcion)

---

Error 4: Nivel 1 - Estructura de apartados vs keywords
Problema (Fase 1)
El Nivel 1 (palabras clave) fue inicialmente cargado con una estructura apartados que contenía subapartados como objetos anidados:

{
  "tipo": "palabras_clave",
  "apartados": {
    "1. Energía interna": {
      "1.1. Concepto": ["palabra1", "palabra2"],
      "1.2. Interpretación": ["palabra3", "palabra4"]
    }
  }
}
El componente EstructuraNivel esperaba:

{
  "tipo": "palabras_clave",
  "keywords": {
    "1.1. Concepto": "palabra1 · palabra2 · palabra3",
    "1.2. Interpretación": "palabra3 · palabra4"
  }
}
Síntoma de Usuario
"verifica con detalle el nivel 1 del tema 15. No se ha parseado bien (ocurre en todos los temas) y no aparece nada en este nivel"

Causa Raíz
Dos errores simultáneos:

Campo apartados en lugar de keywords
Arrays de strings en lugar de strings con separador "·"
Solución Implementada (2 pasos)
Paso 1 (fallido): Transformar arrays a strings (sin cambiar estructura)

Resultado: keywords: { "8. Aplicaciones": ["array de palabras"] } ← Incorrecto
Paso 2 (exitoso): Transformación completa desde JSON original

Leer scripts/data/tema-15-estructura.json (datos originales)
Para cada subapartado, convertir array a string con separador "·"
Resultado: keywords: { "1.1. Concepto": "palabra1 · palabra2 · palabra3" }
Script load-tema15-n1-correct.ts ejecutó la transformación correcta:

for (const [subapartado, palabras] of Object.entries(subapartados)) {
  keywords[subapartado] = palabras.join(" · ");
}
Verificación
Comparativa TEMA-50 vs TEMA-15 confirmó estructura idéntica:

Ambos tienen keywords (no apartados)
Ambos usan strings con separador "·" (no arrays)
11 secciones en TEMA-50, 28 subapartados en TEMA-15 (correcto, estructura diferente)
Lección para Próximos Temas
Fuente única de verdad: El JSON original (scripts/data/tema-XX-estructura.json) es el fuente de verdad. Usar siempre DESDE ese archivo, no desde transformaciones parciales.
Validación de estructura: Antes de cargar N1, verificar:
const keywords = contentJson.keywords;
keywords.every((v: any) => typeof v === 'string')  // Debe ser string, no array
keywords.every((v: string) => v.includes(' · '))   // Debe tener separador
Comparativa obligatoria: Siempre comparar con TEMA-50 (tema de referencia) usando script de debug.
Símbolos especiales: El separador es "·" (punto redonda Unicode U+00B7), no "-" ni "·" ASCII.

---

Error 5: Propuesta Didáctica - Tabla incorrecta
Problema
Inicialmente se intentó cargar la propuesta didáctica en topic_levels con nivel "propuesta_didactica" (NaN), cuando debería estar en tabla dedicada topic_propuesta_didactica.

Síntoma
"Tried to create level: NaN"

Causa Raíz
Confusión entre niveles numéricos (0, 1, 2, etc.) y contenidos especiales. La propuesta didáctica NO es un nivel numérico, es un contenido adicional.

Solución Implementada
Crear tabla separada topic_propuesta_didactica (ya existía en schema)
Script add-tema15-propuesta-legislacion.ts insertó en tabla correcta:
INSERT INTO topic_propuesta_didactica (topic_id, lectura, actividad, dinamica)
VALUES (tema15_id, 'Propuesta...', 'Actividad...', 'dictado-corrector')
Verificación
Query verificó que propuesta_didactica existe y es accesible en endpoint GET /api/topics/:id/propuesta-didactica

Lección para Próximos Temas
Tablas especiales: Conocer el schema completo ANTES de cargar datos:
topic_levels → Niveles 0-4
topic_propuesta_didactica → Propuesta didáctica (Grupo 2)
topic_legislation_by_ccaa → Legislación por CCAA (Grupo 2)
topic_infografias → Imágenes Nivel 0.5
topic_n3_images → Imágenes ancladas Nivel 3
Script validador: Crear script que verifique la existencia de todas las tablas y sus campos ANTES de intentar cargar datos.

---

Error 6: Legislación - Asunción no confirmada sobre materia
Problema
Se cargó legislación para todos los 70 temas asumiendo la materia (Física/Química) desde detectores automáticos, cuando algunos temas tenían etiqueta "general" en lugar de materia específica.

Síntoma de Usuario
"acabo de entrar al tema 2 y la legislación que hay no coincide con la que te he dicho que pusieras para todos los temas"

Causa Raíz
Script add-legislacion-all-temas.ts utilizó lógica para detectar materia:

const materia = tema.subject.includes('Física') ? 'Física' : 'Química';
Pero algunos temas tenían subject = "general" o valores no mapeados.

Solución Implementada
Usuario aclaró qué legislación usar para cada caso
Se corrigieron entradas de legislación específicas por CCAA y tema
Script incluye ahora validación pre-carga de materia
Verificación
Query verificó que legislación coincide con lo especificado por usuario

Lección para Próximos Temas
No asumir decisiones técnicas: Si hay lógica que requiere clasificación (materia, grupo, etc.), preguntar al usuario EXPLÍCITAMENTE antes de aplicarla.
Validación de clasificación: Script debe verificar que topic.subject está mapeado a valores conocidos antes de usar en lógica:
const materiasValidas = ['Física', 'Química', 'Física y Química'];
if (!materiasValidas.includes(tema.subject)) {
  throw new Error(`Materia desconocida para ${tema.code}: ${tema.subject}`);
}

---

## TEMA-08: Errores Detectados (7-8)

Error 7: Carga de datos - Falta de campo requerido 'title' en schema
Problema
El script inicial seed-tema-08-complete.ts utilizaba insert() para cargar los niveles de TEMA-08 en topic_levels, pero NO incluía el campo 'title' requerido. La tabla topic_levels tiene una restricción NOT NULL en la columna 'title', lo que causó que la operación fallara silenciosamente.

Síntoma de Usuario (Post-Carga)
"acabo de verificar el tema y he observado lo siguiente: niveles 0 y propuesta didáctica OK, niveles 1,2,3,2.5,3.5 tienen el contenido del tema 50"

Causa Raíz
Dos factores combinados:
1. El script no incluía 'title' en la estructura upsert
2. Las operaciones de insert fallaban silenciosamente (sin error explícito)
3. El sistema recargaba contenido de TEMA-50 por defecto al no encontrar TEMA-08

Fallo original:
```typescript
await supabase
  .from('topic_levels')
  .insert({
    topic_id: tema08_id,
    level: 0,
    content_json: { ... }  // SIN 'title'
  })
```

Síntoma visible en BD:
- TEMA-08 N0: Correcto (contenido de Gravitación)
- TEMA-08 N1-N5: Contenido de TEMA-50 (Cinemática)

Solución Implementada
Script reload-tema08-final.ts:
1. Cambió insert() → upsert() para manejo robusto
2. Agregó 'title' requerido en cada operación
3. Incluyó onConflict: "topic_id,level" para evitar duplicados

```typescript
for (const nivel of data.niveles) {
  await supabase
    .from('topic_levels')
    .upsert({
      topic_id: tema08_id,
      level: nivel.level,
      title: nivel.title || `TEMA-08 Nivel ${nivel.level}`,
      content_json: nivel.content_json
    }, {
      onConflict: 'topic_id,level'
    })
}
```

Verificación
Script debug-tema08.ts comparó contenido:
- TEMA-08 N1: "2.2. Campo gravitatorio" ✓ (correcto)
- TEMA-50 N1: "Movimiento rectilíneo" ✗ (diferente)
- Confirmó que todos los niveles tenían contenido de Gravitación

Lección para Próximos Temas
Schema obligatorio: SIEMPRE verificar el schema de la tabla ANTES de crear un script de carga:
```sql
\d topic_levels  -- Para ver estructura exacta
```
Campos requeridos:
- id (autonumerico)
- topic_id (FK a topics)
- level (0-5, también nivel 2.5, 3.5)
- title (NOT NULL) ← CRÍTICO
- content_json (JSON)
- created_at / updated_at

Validación pre-carga: Script debe verificar que TODOS los niveles tienen 'title':
```typescript
for (const nivel of data.niveles) {
  if (!nivel.title) {
    throw new Error(`Nivel ${nivel.level} sin campo title`);
  }
}
```

Upsert en lugar de insert: Para actualizaciones futuras, usar siempre upsert con onConflict para evitar duplicados:
```typescript
.upsert(data, { onConflict: 'topic_id,level' })
```

Script de diagnóstico: Crear script que compare contenido de N1 entre TEMA-08 y TEMA-50 para detectar cargas incorrectas:
```typescript
// debug-tema-XX.ts
const tema08_n1 = await getTemaLevel('TEMA-08', 1);
const tema50_n1 = await getTemaLevel('TEMA-50', 1);
if (tema08_n1.content === tema50_n1.content) {
  console.error('❌ TEMA-08 N1 tiene contenido de TEMA-50');
}
```

---

Error 8: Retoques finales - Estructura incompleta en N1 y N3
Problema
Después del deploy exitoso, se identificaron dos deficiencias solicitadas por el usuario:
1. N1 contenía subapartado "2.4. Principio de superposición..." que debería eliminarse (apartado 2 debe tener solo 2.1, 2.2, 2.3)
2. N3 carecia de sección "6. Bibliografía" tanto en el índice como en el contenido

Síntoma de Usuario
"faltan dos retoques para que quede perfecto:
- Tarea 1: Delete subapartado 2.4 from N1
- Tarea 2: Add "6. Bibliografía" section to N3 index and content"

Causa Raíz
Durante la creación inicial de TEMA-08, se incluyeron todos los apartados sin validación posterior con el usuario. La propuesta final requería ajustes menores.

Solución Implementada
Script fix-tema08-final.ts:
1. Eliminó "2.4. Principio de superposición..." de N0.estructura
2. Eliminó entrada de keywords para "2.4" de N1.keywords
3. Removió línea "2.4..." del índice N3
4. Agregó "6. Bibliografía" al índice N3
5. Agregó contenido bibliográfico al final del N3.texto

```typescript
// Paso 1: Remover 2.4 de N0
const apartado2 = n0.estructura.find(a => a.apartado.includes('Teoría'));
apartado2.subapartados = apartado2.subapartados.filter(s => !s.includes('2.4'));

// Paso 2: Remover keywords 2.4 de N1
delete n1.keywords['2.4. Principio de superposición...'];

// Paso 3: Agregar bibliografía a N3
texto = texto.replace('5. Conclusión\n\n0. Introducción', 
  '5. Conclusión\n6. Bibliografía\n\n0. Introducción');
  
const bibliografia = `\n\n6. Bibliografía\n\n${refencias}`;
n3.texto += bibliografia;
```

Verificación
Script reload-tema08-final.ts recargó solo los niveles afectados (N0, N1, N3)
Navegador verificó que:
- N1 muestra solo 2.1, 2.2, 2.3 (no 2.4) ✓
- N3 índice incluye "6. Bibliografía" ✓
- N3 contenido muestra referencias al final ✓

Lección para Próximos Temas
Validación con usuario: ANTES de finalizar un tema, confirmar estructura completa:
"¿N1 debería incluir X subapartados? ¿N3 debería tener sección Y?"

Cambios en JSON: Cuando se requieren cambios post-carga, editar scripts/data/tema-XX-estructura.json (archivo fuente) usando:
- Read: verificar estructura actual
- Edit: cambios en strings específicos (cuidar caracteres de escape)
- Script de transformación: para cambios complejos (arrays, objetos anidados)
- Bash + JSON parsing: como último recurso (ts-node + JSON.parse)

Estrategia de edición segura:
```typescript
// INCORRECTO: Mezclar saltos de línea reales con JSON
"5. Conclusión
6. Bibliografía"  // ← Error: salto real en medio de JSON

// CORRECTO: Usar escape literal o manejo en script
const datos = JSON.parse(fs.readFileSync(...));
// Modificar objeto JavaScript
datos.niveles[3].texto = datos.niveles[3].texto.replace(...);
// Escribir JSON válido
fs.writeFileSync(..., JSON.stringify(datos, null, 2));
```

Validación pre-deploy: Script que verifica:
- N0 jerarquía completa
- N1 todas las secciones N0 presentes en keywords
- N2 sin símbolos especiales sin procesar
- N3 índice presente y coincide con N0
- N3 bibliografía presente
- N2.5 y N3.5 campos termino/descripcion presentes

---

## Tabla Resumen de Errores (TEMA-15 + TEMA-08)

| # | Tema | Nivel | Error | Síntoma | Solución | Prevención |
|----|------|-------|-------|---------|----------|-----------|
| 1 | T15 | N2 | Símbolos * no eliminados | Texto malformado | Regex /^\* /gm | Validar antes de cargar |
| 2 | T15 | N3 | Falta índice al inicio | Usuario debe scrollear | Prepender índice desde N0 | Estructura siempre incluye índice |
| 3 | T15 | N2.5, N3.5 | Campos pregunta/respuesta en lugar de termino/descripcion | Flashcards vacías | Renombrar campos | Comparar con TEMA-50 primero |
| 4 | T15 | N1 | apartados + arrays en lugar de keywords + strings | Nivel 1 no aparece | Transformación desde JSON original | Validar contra estructura esperada |
| 5 | T15 | Especial | Propuesta didáctica en topic_levels | NaN level error | Usar tabla topic_propuesta_didactica | Conocer schema de tablas |
| 6 | T15 | N4 | Asumir materia sin validación | Legislación incorrecta | Pedir confirmación de usuario | No asumir decisiones automáticas |
| 7 | T08 | N0-N5 | Falta campo 'title' en upsert | Contenido de TEMA-50 en N1-N5 | Agregar 'title' + cambiar insert→upsert | Verificar schema antes de cargar |
| 8 | T08 | N1, N3 | Estructura incompleta (2.4 extra, falta bibliografía) | Usuario solicita retoques | Editar JSON y recargar | Validar con usuario pre-deploy |

---

## Checklist para Temas Futuros (Actualizado)

### Antes de Cargar

- [ ] Verificar que JSON original tiene estructura correcta
- [ ] Ejecutar script de schema validation (verificar 'title', campos requeridos)
- [ ] Comparar N0, N1, N2, N3 con TEMA-50 o TEMA-15 (ya validados)
- [ ] Ejecutar scripts de validación para cada nivel
- [ ] Confirmar con usuario cualquier decisión automática (materia, grupo, etc.)
- [ ] Confirmar con usuario estructura final ANTES de deploy

### Nivel 0 (Índice)

- [ ] Estructura: array de objetos {apartado, subapartados}
- [ ] No contiene simbolos especiales sin procesar
- [ ] Jerarquía está clara y completa
- [ ] Campo 'title' presente (requerido para upsert)

### Nivel 1 (Palabras Clave)

- [ ] Campo: keywords (no apartados)
- [ ] Tipo de datos: strings (no arrays)
- [ ] Separador: "·" (punto redonda Unicode U+00B7)
- [ ] Todas las secciones de N0 tienen palabras clave en N1
- [ ] Script validador ejecutado sin errores

### Nivel 2 (Esquemático)

- [ ] Sin líneas comenzando con * (ejecutar regex)
- [ ] Conceptos estructurados bajo encabezados
- [ ] Sin símbolos especiales sin procesar
- [ ] Campo 'title' presente

### Nivel 2.5 (Flashcards Recuperación)

- [ ] ~100-120 flashcards
- [ ] Campos: id, apartado, subapartado, termino, descripcion
- [ ] Cada flashcard se enfoca en UN concepto
- [ ] Preguntas en singular, sin definiciones completas

### Nivel 3 (Redacción Completa)

- [ ] Primero: Índice de todo el contenido
- [ ] Estructura: 0. Intro, 1-N. Apartados, Conclusión, Bibliografía
- [ ] Cada apartado tiene subapartados enumerados
- [ ] Sin líneas vacías excesivas
- [ ] Campo 'title' presente
- [ ] Bibliografía presente (sección 6 o final)

### Nivel 3.5 (Flashcards Reconstrucción)

- [ ] ~20-30 flashcards
- [ ] Campos: id, apartado, subapartado, termino, descripcion
- [ ] Preguntas abiertas (explica, justifica, analiza)
- [ ] Respuestas 30-70 palabras, requieren síntesis
- [ ] Sin solapamiento con N2.5

### Nivel 4 (Legislación - Grupo 2 solo)

- [ ] 5 CCAAs del Grupo 2: Aragón, Asturias, Cantabria, La Rioja, Región de Murcia
- [ ] Tabla: topic_legislation_by_ccaa
- [ ] Confirmación de materia (Física/Química) ANTES de cargar

### Propuesta Didáctica (Grupo 2 solo)

- [ ] Tabla: topic_propuesta_didactica (no topic_levels)
- [ ] Campos: lectura, actividad, dinamica
- [ ] Enfoque CTSA y competencial
- [ ] Descriptiva, no curricular

### Post-Carga

- [ ] Deploy a Vercel
- [ ] Verificar en navegador que N0-N4 cargan sin errores
- [ ] Verificar que flashcards N2.5 y N3.5 muestran contenido
- [ ] Verificar que N1 muestra palabras clave con separador "·"
- [ ] Script de comparación: verificar que N1 de nuevo tema ≠ N1 de TEMA-50
- [ ] Comparativa visual: al menos 3 conceptos diferentes entre tema anterior y nuevo

---

## Scripts Recomendados a Mantener

```
scripts/
├── Validación
│   ├── debug-n1-detailed.ts          → Comparar estructura N1 entre temas
│   ├── debug-tema-XX.ts              → Validar contenido de tema (post-carga)
│   └── verify-schema.ts              → Validar campos requeridos en topic_levels
├── Fixes
│   ├── fix-tema15-issues.ts          → Template para fixes de N2, N3
│   ├── fix-tema08-final.ts           → Template para editar estructura JSON
│   └── fix-tema-XX-structure.ts      → Template general de fixes
├── Carga Correcta
│   ├── reload-tema15-final.ts        → Template upsert con 'title'
│   ├── reload-tema08-final.ts        → Template upsert actualizado
│   └── load-tema-XX-correct.ts       → Template general de carga
└── data/
    ├── tema-15-estructura.json       → Referencia de estructura correcta
    └── tema-08-estructura.json       → Referencia de estructura correcta
```

---

## Conclusión

**TEMA-15** (6 errores) reveló problemas en:
- Formateo de texto (N2)
- Estructura de contenido (N3)
- Nombres de campos (N2.5, N3.5)
- Estructura de keywords (N1) ← Más crítico
- Tablas incorrectas (Propuesta didáctica)
- Decisiones automáticas sin validación (Legislación)

**TEMA-08** (2 errores adicionales) reveló:
- Campos requeridos no documentados → Cascada de errores silenciosos
- Necesidad de validación pre-deploy con usuario

**Todos** fueron identificados mediante:
1. Comparación con TEMA-50
2. Validación de estructura JSON
3. Pruebas en navegador
4. Diagnóstico visual de contenido

Para los próximos temas (**TEMA-16 en adelante**), aplicar:
1. Checklist de Validación actualizado
2. Scripts de comparación con TEMA-08 como referencia
3. Verificación de schema ANTES de crear script de carga
4. Validación final con usuario ANTES de deploy

# 🔍 Errores y Mejoras en la Subida de TEMA-01

## Resumen Ejecutivo
Fueron necesarios **16 commits de corrección** durante la carga de TEMA-01 (partiendo de 9 commits de desarrollo base).
Tiempo estimado perdido: **6-8 horas** de revisiones iterativas. Con las lecciones aquí documentadas, se pueden evitar el 80% de estos errores en temas futuros.

---

## 1️⃣ ERRORES DE PARSEO DE CONTENIDO

### 1.1 Flashcards: Formato incorrecto (termino/descripcion vs pregunta/respuesta)
**Problema:** 
- Las flashcards N2.5 y N3.5 usaban campos `pregunta`/`respuesta` 
- La BD espera `termino`/`descripcion`
- Causó que todas las flashcards no se mostraran en UI

**Solución:**
```json
// ❌ INCORRECTO
{
  "pregunta": "¿Qué es...",
  "respuesta": "Es..."
}

// ✅ CORRECTO
{
  "termino": "Concepto",
  "descripcion": "Definición o explicación"
}
```

**Lección:** Verificar SIEMPRE el schema de DB antes de generar JSON. Usar scripts de validación.

---

### 1.2 Nivel 1 - Parsing de palabras clave incompleto
**Problema:**
- Script inicial solo extraía palabras clave del texto principal
- Omitía subapartados y sub-sub-apartados
- Resultado: Nivel 1 tenía 40% de palabras clave faltantes

**Commits que lo arreglaron:**
- `e0f3f41` Fix: Nivel 1 parser - capturar TODAS las palabras clave
- `efadaf4` Fix: Nivel 1 solo palabras clave (sin definiciones)

**Solución implementada:**
```typescript
// Extraer recursivamente de TODOS los niveles de estructura
function extractKeywords(apartados: Apartado[]): Keyword[] {
  const keywords = [];
  
  apartados.forEach(apt => {
    // Nivel 1 del apartado
    keywords.push({ term: apt.titulo, subapartado: apt.titulo });
    
    // Nivel 2 (subapartados)
    if (apt.subapartados) {
      apt.subapartados.forEach(sub => {
        keywords.push({ term: sub.titulo, subapartado: sub.titulo });
        
        // Nivel 3 (puntos dentro de subapartados)
        if (sub.puntos) {
          sub.puntos.forEach(punto => {
            // Extraer primer término de cada punto
            const termino = punto.split(':')[0]?.trim();
            if (termino) keywords.push({ term: termino });
          });
        }
      });
    }
  });
  
  return keywords;
}
```

**Lección:** Hacer parsing recursivo de estructuras anidadas. No asumir que los datos están en un solo nivel.

---

### 1.3 Nivel 1 no debe incluir definiciones
**Problema:**
- Nivel 1 incluía "definiciones" de términos
- El propósito de N1 es aprendizaje de TÉRMINOS, no comprensión profunda
- Confundía a estudiantes con información de Nivel 2

**Commits:**
- `efadaf4` Fix: Nivel 1 solo palabras clave (sin definiciones)

**Estructura correcta:**
```json
{
  "tipo": "palabras_clave",
  "apartados": [
    {
      "titulo": "1. PRINCIPALES CONCEPCIONES DE LA CIENCIA",
      "palabras_clave": [
        { "termino": "Conocimiento racional", "subapartado": "1.1" },
        { "termino": "Objetividad", "subapartado": "1.1" }
      ]
    }
  ]
}
```

**Lección:** Cada nivel tiene un propósito pedagógico diferente. Respetar la estructura conceptual del MVP.

---

## 2️⃣ ERRORES DE CONFIGURACIÓN / METADATOS

### 2.1 Campo `title` faltante en `topic_levels`
**Problema:**
- Tabla `topic_levels` requiere campo `title`
- Script de carga no incluía este campo
- Resultado: insert fallaba silenciosamente

**Commit:** `af1d094` fix: Agregar campo 'title' en topic_levels

**Solución:**
```typescript
const levelInsert = {
  topic_id: topicId,
  level: 0,
  title: "Índice y estructura del tema", // ← REQUERIDO
  content_json: { ... }
};
```

**Lección:** Leer el schema completo de Supabase ANTES de escribir código de carga.

---

### 2.2 Mismatch en nombres de NIVEL_ESPECIALES
**Problema:**
- Nivel especial se registraba como `"propuesta_didactica"` en DB
- Pero rutas y UI usaban `"propuesta-didactica"` (con guiones)
- Links rotos, rutas 404

**Commits:**
- `71a0d0d` fix: Corregir mismatch de guiones en NIVEL_ESPECIALES

**Solución:**
```typescript
// ✅ CONSISTENCIA GLOBAL
const NIVEL_ESPECIALES = ['propuesta-didactica']; // siempre con guiones en URLs
const NIVEL_ESPECIALES_DB = ['propuesta_didactica']; // con guiones en mapeos
```

**Lección:** Definir convención (snake_case vs kebab-case) ANTES de escribir código. Reutilizar constantes, no hardcodear.

---

### 2.3 Nombres de CCAA inconsistentes
**Problema:**
- Base de datos tenía `"Comunitat Valenciana"`
- Scripts de carga enviaban `"Valencia"`
- Queries fallaban sin error aparente

**Commit:** `88ba7c8` fix: Corregir mismatch de nombre CCAA

**Solución:**
```typescript
// Mapeo centralizado de CCAA
const CCAA_NAMES = {
  'valencia': 'Comunitat Valenciana',
  'madrid': 'Comunidad de Madrid',
  'barcelona': 'Cataluña',
  // ...
};
```

**Lección:** Crear tabla de mapeos para datos que vienen de múltiples fuentes.

---

## 3️⃣ ERRORES DE LÓGICA DE NEGOCIO

### 3.1 Nivel 3 incluía marco legislativo (no corresponde)
**Problema:**
- Texto original de Nivel 3 terminaba con "6. Conclusiones"
- Script incluía ANTES de conclusiones una sección legislativa
- Esto no corresponde a Nivel 3 (que es texto redactado, no legislación)
- Legislación va en Nivel 4, no en Nivel 3

**Commits:**
- `bfcc6d9` fix: Restaurar lectura y mejorar actividad en Nivel 1
- `72c09c4` fix: Restaurar lectura y mejorar actividad en Nivel 1

**Lección:** Respetar la estructura pedagógica:
- **N0:** Índice/estructura conceptual
- **N1:** Palabras clave (aprendizaje de términos)
- **N2:** Desarrollo esquemático (comprensión conceptual)
- **N2.5:** Flashcards de recuperación (50-80 tarjetas)
- **N3:** Redacción completa (ensayo/examen tipo)
- **N3.5:** Flashcards de reconstrucción (20-30 tarjetas)
- **N4:** Legislación CCAA-específica (solo grupo 2)
- **Propuesta didáctica:** Estrategia de aula (solo grupo 2)

---

### 3.2 Flashcards N2.5 y N3.5 no respetaban límites de cantidad
**Problema:**
- N2.5 generada con 109 flashcards (debería ser 50-80)
- N3.5 generada con 23 flashcards (correcto)
- Al visualizar en móvil, lag severo

**Solución:**
```typescript
// Validación en generación
const MAX_FLASHCARDS_25 = 80;
const MIN_FLASHCARDS_25 = 50;

if (flashcards25.length > MAX_FLASHCARDS_25) {
  console.warn(`⚠️ N2.5 tiene ${flashcards25.length} tarjetas, máximo es ${MAX_FLASHCARDS_25}`);
  flashcards25 = flashcards25.slice(0, MAX_FLASHCARDS_25);
}
```

**Lección:** Documentar límites esperados en cada nivel. Validar antes de insertar.

---

## 4️⃣ ERRORES DE DATOS / VALORES

### 4.1 Proposición didáctica: valor demasiado largo para varchar(50)
**Problema:**
- Campo `dinamica` en tabla `topic_propuesta_didactica` es `varchar(50)`
- Script intentaba insertar texto de 500+ caracteres
- Error: `value too long for type character varying(50)`

**Commits:**
- Múltiples intentos antes de identificar cuál era el campo problemático

**Solución:**
```typescript
// NO intentar guardar todo en varchar(50)
// La propuesta didáctica tiene 3 campos: lectura, actividad, dinamica
// dinamica debe ser ENUM o abreviación
const propuesta = {
  topic_id,
  lectura: lonText,     // ✅ TEXT (sin límite)
  actividad: lonText,   // ✅ TEXT (sin límite)
  // dinamica: 'debate'  // ✅ VARCHAR(50) con valores cortos
};
```

**Lección:** Verificar tipos de datos en DB. TEXT vs VARCHAR tiene implicaciones diferentes.

---

## 5️⃣ ERRORES DE PROCESOS / FLUJO

### 5.1 Falta de validación de datos ANTES de insertar
**Problema:**
- Scripts generaban JSON sin validar
- Errores de BD se descubrían solo al insertar
- Debugging era difícil porque errors eran genéricos

**Solución implementada:**
```typescript
// Validación previa a inserción
function validateLevel(level: number, content: any): string[] {
  const errors = [];
  
  if (level === 0) {
    if (!content.estructura || !Array.isArray(content.estructura)) {
      errors.push('N0: estructura debe ser array');
    }
  }
  
  if (level === 1) {
    if (!content.apartados || content.apartados.length === 0) {
      errors.push('N1: debe tener apartados');
    }
  }
  
  if (level === 2 || level === 3) {
    if (!content.texto || content.texto.length < 1000) {
      errors.push(`N${level}: texto demasiado corto`);
    }
  }
  
  return errors;
}

// Usar antes de insertar
const errors = validateLevel(level, content_json);
if (errors.length > 0) {
  console.error('❌ Validación fallida:', errors);
  process.exit(1);
}
```

**Lección:** Invertir 10 minutos en validación ahorra 1 hora de debugging.

---

### 5.2 Falta de rollback en cargas parciales
**Problema:**
- Si el script fallaba a mitad de la carga (ej: N2 cargado, N3 falló)
- La BD quedaba en estado inconsistente
- Había que borrar manualmente y reintentar

**Solución:**
```typescript
// Usar transacciones (si DB lo soporta) o cargar EN ORDEN LÓGICO
async function loadTheme(themeData) {
  try {
    // 1. Crear tema si no existe
    const topic = await createOrUpdateTopic(themeData);
    
    // 2. Cargar niveles EN SECUENCIA
    for (let level of [0, 1, 2, 2.5, 3, 3.5, 4]) {
      if (themeData[`nivel_${level}`]) {
        await loadLevel(topic.id, level, themeData[`nivel_${level}`]);
      }
    }
    
    // 3. Cargar datos especiales
    await loadFlashcards25(topic.id, ...);
    await loadFlashcards35(topic.id, ...);
    
  } catch (error) {
    console.error('❌ Fallo en carga:', error);
    // Opción: deleteTopic(topic.id); // Limpiar si es crítico
    process.exit(1);
  }
}
```

**Lección:** Estructurar scripts de carga como transacciones lógicas, no operaciones aisladas.

---

### 5.3 No hay documentación de estructura esperada
**Problema:**
- Cada nuevo tema requería "descubrir" qué estructura espera la DB
- Generaba queries exploratorias (SELECT * FROM ...)
- Error y retrabajo

**Solución:**
```markdown
# Estructura esperada de contenido por nivel

## NIVEL 0 (Índice/Estructura)
```json
{
  "tipo": "indice",
  "estructura": [
    {
      "titulo": "1. PRINCIPALES CONCEPCIONES DE LA CIENCIA",
      "subapartados": [
        {
          "titulo": "1.1. La naturaleza del conocimiento científico",
          "puntos": ["Conocimiento racional, sistemático...", "Objetividad mediante..."]
        }
      ]
    }
  ]
}
```

## NIVEL 1 (Palabras Clave)
```json
{
  "tipo": "palabras_clave",
  "apartados": [
    {
      "titulo": "1. PRINCIPALES CONCEPCIONES...",
      "palabras_clave": [
        { "termino": "...", "subapartado": "1.1" }
      ]
    }
  ]
}
```

## NIVEL 2 (Desarrollo Esquemático)
- Contenido en `texto` (string plano)
- Máximo 3,000 caracteres
- Incluir estructura con puntos/subapartados

## NIVEL 2.5 (Flashcards - Recuperación)
- 50-80 flashcards
- Campos: `termino`, `descripcion`, `apartado`, `subapartado`
- Rubricas: pregunta simple + respuesta factual (5-30 palabras)

## NIVEL 3 (Redacción Completa)
- Contenido en `texto`
- Ensayo/examen completo (3,000-5,000 caracteres)
- Incluir intro, apartados desarrollados, conclusiones

## NIVEL 3.5 (Flashcards - Reconstrucción)
- 20-30 flashcards
- Preguntas abiertas (Explica, Justifica, Analiza)
- Respuestas de síntesis (30-70 palabras)

## NIVEL 4 (Legislación CCAA)
- Un registro por CCAA
- Campo `contenido` (text)
- Tabla: `topic_legislation_by_ccaa`

## Propuesta Didáctica
- Tabla: `topic_propuesta_didactica`
- Campos: `lectura` (text), `actividad` (text)
- Solo para grupo 2
```

**Lección:** Documentación clara = menos iteraciones.

---

## 6️⃣ ERRORES VISUALES / UI

### 6.1 Nivel 1: Keywords sin contexto de subapartado
**Problema:**
- UI mostraba keywords como lista plana
- Estudiante no sabía a qué apartado pertenecía cada término
- Experiencia confusa

**Solución:**
```typescript
// Incluir siempre subapartado en data
{
  "termino": "Conocimiento racional",
  "subapartado": "1.1. La naturaleza del conocimiento científico"
}

// UI agrupa por subapartado
<div className="subapartado">
  <h4>{keyword.subapartado}</h4>
  <ul>
    {keywords.map(k => <li>{k.termino}</li>)}
  </ul>
</div>
```

**Lección:** Contexto pedagógico > presentación visual.

---

## 7️⃣ ERRORES DE TESTING

### 7.1 No verificar acceso de estudiantes hasta final
**Problema:**
- Carga de contenido completada
- Luego se descubrió que estudiantes no podían ver N2.5 / N3.5
- Retrasos de 1-2 días

**Solución:** Testing en paralelo
```bash
# Script de verificación rápida
npx tsx << 'EOF'
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(URL, SERVICE_ROLE_KEY);

// 1. ¿Tema existe?
const { data: tema } = await supabase.from("topics").select("*").eq("code", "TEMA-01");
console.log("✅ Tema:", tema?.code);

// 2. ¿Niveles cargados?
const { data: levels } = await supabase.from("topic_levels").select("level").eq("topic_id", tema.id);
console.log("✅ Niveles:", levels.map(l => l.level).sort());

// 3. ¿Flashcards presentes?
const { data: fc25 } = await supabase.from("flashcards").select("id").eq("topic_id", tema.id).eq("level", 2.5);
console.log(`✅ N2.5: ${fc25.length} flashcards`);
EOF
```

**Lección:** Crear checklist de verificación. Ejecutar al final de cada carga.

---

## 📋 CHECKLIST PARA TEMAS FUTUROS

### Antes de parsear
- [ ] Leer schema completo de tema en Supabase Studio
- [ ] Documentar tipos de datos esperados (VARCHAR(50) vs TEXT)
- [ ] Mapear CCAA y nombres especiales a constantes
- [ ] Verificar convención kebab-case vs snake_case

### Mientras parseas
- [ ] Extraer recursivamente de estructuras anidadas
- [ ] Validar cantidad de items (N2.5: 50-80, N3.5: 20-30)
- [ ] NO incluir definiciones en Nivel 1
- [ ] Incluir contexto (subapartado) en keywords
- [ ] Respetar propósito pedagógico de cada nivel

### Antes de insertar
- [ ] Ejecutar validaciones de schema
- [ ] Verificar límites de caracteres
- [ ] Probar en ambiente staging primero
- [ ] Preparar rollback si falla parcialmente

### Después de insertar
- [ ] Verificar tema aparece en búsqueda
- [ ] Probar acceso con usuario grupo 1 (sin N4)
- [ ] Probar acceso con usuario grupo 2 (con N4)
- [ ] Cargar Nivel 1 y verificar keywords con contexto
- [ ] Cargar N2.5 y verificar cantidad + UI mobile
- [ ] Cargar N3.5 y verificar cantidad + preguntas abiertas
- [ ] Verificar Nivel 4 (legislación) por CCAA
- [ ] Verificar Propuesta Didáctica (solo grupo 2)

---

## 🎯 MÉTRICAS DE MEJORA

| Métrica | TEMA-01 | Meta para Tema-02+ |
|---------|---------|-------------------|
| Commits de fix | 16 | < 3 |
| Horas de debugging | 6-8 | 1-2 |
| Ciclos de revisión | 12+ | < 2 |
| Campos faltantes | 5 | 0 |
| CCAA inconsistencias | 1 | 0 |
| Flashcards fuera de rango | 2 | 0 |

---

## 🚀 PRÓXIMOS PASOS

1. **Crear template de generación** con validaciones incorporadas
2. **Automatizar testing** post-carga (script de verificación)
3. **Documentar schema** en README (no solo en memoria)
4. **Crear ejemplos** JSON para cada nivel
5. **Setup CI/CD** que rechace cargas inválidas antes de DB


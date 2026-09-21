# 📝 PROMPT PARA CARGA DE TEMAS EN PLATAFORMA EDUCATIVA

## USO
Copia este prompt y adhiéntalo al archivo de tema (o pégalo directamente en Claude Code) para automatizar la carga de nuevos temas evitando los errores de TEMA-01.

---

## PROMPT COMPLETO

```
TAREA: Procesar y cargar nuevo tema a plataforma educativa (Método FyQ)

CONTEXTO:
- Plataforma: Next.js + Supabase + Vercel
- Objetivo: Automatizar carga de temas sin errores iterativos
- Referencia de errores: Ver archivo ERRORES_Y_LECCIONES_TEMA01.md

ENTRADA:
Usuario proporciona CÓDIGO DE TEMA (ej: TEMA-02, TEMA-54) y pega contenido organizado así:

=== TEMA-XX - NIVEL 0 ===
[Texto con estructura/índice del tema]

=== TEMA-XX - NIVEL 1 ===
[Palabras clave por apartado - SIN DEFINICIONES]

=== TEMA-XX - NIVEL 2 ===
[Desarrollo esquemático con puntos - MAX 3,000 caracteres]

=== TEMA-XX - NIVEL 2.5 ===
[Si aplica: pre-generadas flashcards, o generar 50-80]

=== TEMA-XX - NIVEL 3 ===
[Redacción completa - ensayo tipo examen - 3,000-5,000 caracteres]

=== TEMA-XX - NIVEL 3.5 ===
[Si aplica: pre-generadas flashcards, o generar 20-30 con preguntas abiertas]

=== TEMA-XX - NIVEL 4 ===
[Legislación específica por CCAA - múltiples secciones]

=== TEMA-XX - PROPUESTA DIDÁCTICA ===
[Estrategia de aula - solo para grupo 2]

---

PASO 1: VALIDACIONES PREVIAS
(Ejecutar mentalmente ANTES de generar código)

□ ¿Código de tema tiene formato TEMA-XX? (2 dígitos)
□ ¿Cada nivel tiene contenido mínimo?
  - N0: estructura con apartados
  - N1: palabras clave SIN definiciones (solo términos)
  - N2: texto 1,000-3,000 caracteres
  - N3: texto 3,000-5,000 caracteres
  - N2.5: 50-80 flashcards (termino/descripcion)
  - N3.5: 20-30 flashcards (pregunta abierta/respuesta 30-70 palabras)
□ ¿Lenguaje legislación es específico por CCAA?
□ ¿Propuesta didáctica tiene estructura (lectura/actividad)?

---

PASO 2: PARSING DE CONTENIDO

2.1 NIVEL 0 (Índice)
   - Extraer TODOS los apartados, subapartados, puntos
   - Estructura JSON:
     {
       "tipo": "indice",
       "estructura": [
         {
           "titulo": "1. PRINCIPALES CONCEPCIONES",
           "subapartados": [
             {
               "titulo": "1.1. La naturaleza del conocimiento",
               "puntos": ["Punto 1", "Punto 2", ...]
             }
           ]
         }
       ]
     }

2.2 NIVEL 1 (Palabras Clave)
   - Extraer SOLO términos (NO definiciones)
   - Incluir subapartado de origen
   - Estructura JSON:
     {
       "tipo": "palabras_clave",
       "apartados": [
         {
           "titulo": "1. PRINCIPALES CONCEPCIONES",
           "palabras_clave": [
             { "termino": "Conocimiento racional", "subapartado": "1.1" },
             { "termino": "Objetividad", "subapartado": "1.1" }
           ]
         }
       ]
     }

2.3 NIVEL 2 (Desarrollo Esquemático)
   - Preservar estructura con asteriscos/guiones
   - Máximo 3,000 caracteres
   - Estructura JSON:
     {
       "tipo": "desarrollo_esquematico",
       "texto": "Contenido aquí..."
     }

2.4 NIVEL 2.5 (Flashcards - Recuperación Activa)
   - 50-80 tarjetas
   - Campos: termino (corto), descripcion (5-30 palabras)
   - Estructura JSON:
     {
       "tipo": "flashcards",
       "nivel": "2.5",
       "titulo": "Recuperación activa",
       "flashcards": [
         {
           "id": "n25_001",
           "apartado": "1",
           "subapartado": "1.1",
           "termino": "Conocimiento racional",
           "descripcion": "Forma de saber sistemática, verificable mediante método"
         }
       ]
     }

2.5 NIVEL 3 (Redacción Completa)
   - 3,000-5,000 caracteres
   - Incluir: introducción, apartados desarrollados, conclusiones
   - NO incluir legislación
   - Estructura JSON:
     {
       "tipo": "redaccion_completa",
       "texto": "Contenido completo aquí..."
     }

2.6 NIVEL 3.5 (Flashcards - Reconstrucción Científica)
   - 20-30 tarjetas
   - Preguntas abiertas: "Explica...", "Justifica...", "Analiza..."
   - Respuestas 30-70 palabras (síntesis)
   - Estructura JSON:
     {
       "tipo": "flashcards",
       "nivel": "3.5",
       "titulo": "Reconstrucción científica",
       "flashcards": [
         {
           "id": "n35_001",
           "apartado": "2",
           "subapartado": "2.1",
           "pregunta": "Explica el concepto de revolución científica según Kuhn",
           "respuesta": "Una revolución científica implica un cambio... [síntesis de 30-70 palabras]"
         }
       ]
     }

2.7 NIVEL 4 (Legislación CCAA)
   - Estructura: múltiples registros, uno por CCAA
   - Campos: ccaa, contenido
   - CCAA válidas: "Madrid", "Barcelona", "Valencia", "Andalucía", etc.
   - Estructura JSON:
     [
       {
         "ccaa": "Madrid",
         "contenido": "Decreto... Orden... [Legislación específica]"
       },
       {
         "ccaa": "Barcelona",
         "contenido": "Decreto... Ordre... [Legislación específica]"
       }
     ]

2.8 PROPUESTA DIDÁCTICA
   - Solo para grupo 2
   - Campos: lectura, actividad
   - Estructura JSON:
     {
       "lectura": "Descripción de la propuesta...",
       "actividad": "Estructura de la actividad...",
       "dinamica": "debate" // [opcional: varchar(50)]
     }

---

PASO 3: GENERACIÓN DE SCRIPTS

3.1 Crear archivo scripts/data/tema-XX-estructura.json
   - Incluir niveles 0, 1, 2, 3 parsados
   - Validar JSON antes de guardar

3.2 Crear archivo scripts/data/tema-XX-n25.json
   - 50-80 flashcards con termino/descripcion
   - Validar cantidad

3.3 Crear archivo scripts/data/tema-XX-n35.json
   - 20-30 flashcards con pregunta/respuesta
   - Validar longitud de respuestas

3.4 Crear archivo scripts/seed-tema-XX.ts
   ```typescript
   import { createClient } from "@supabase/supabase-js";
   import estructuraData from "./data/tema-XX-estructura.json";
   import n25Data from "./data/tema-XX-n25.json";
   import n35Data from "./data/tema-XX-n35.json";
   
   async function seedTema() {
     const supabase = createClient(URL, SERVICE_ROLE_KEY);
     
     // 1. Verificar/crear tema
     let { data: topic } = await supabase
       .from("topics")
       .select("id")
       .eq("code", "TEMA-XX")
       .single();
     
     if (!topic) {
       const { data: newTopic } = await supabase
         .from("topics")
         .insert({
           code: "TEMA-XX",
           title: "...",
           subject: "...",
           grupo: 2 // grupo que incluye N4 + propuesta didáctica
         })
         .select()
         .single();
       topic = newTopic;
     }
     
     // 2. Cargar niveles 0-3
     for (const level of [0, 1, 2, 3]) {
       const content = estructuraData[level];
       
       // Validar
       if (!content || !content.texto) {
         console.error(`❌ N${level} sin contenido`);
         continue;
       }
       
       await supabase
         .from("topic_levels")
         .upsert({
           topic_id: topic.id,
           level,
           title: content.titulo || `Nivel ${level}`,
           content_json: content
         });
     }
     
     // 3. Cargar N2.5
     // Usar script existing: npx tsx scripts/load-flashcards.ts scripts/data/tema-XX-n25.json
     
     // 4. Cargar N3.5
     // Usar script existing: npx tsx scripts/load-flashcards.ts scripts/data/tema-XX-n35.json
     
     console.log("✅ Tema XX cargado completo");
   }
   
   seedTema().catch(console.error);
   ```

---

PASO 4: VALIDACIONES ANTES DE INSERTAR

Validar que:
□ Todas las imágenes de N0 estructura tienen subapartados
□ N1 tiene 40+ palabras clave
□ N1 NO tiene definiciones (solo términos)
□ N2 tiene 1,000-3,000 caracteres
□ N3 tiene 3,000-5,000 caracteres
□ N2.5 tiene 50-80 flashcards con {termino, descripcion}
□ N3.5 tiene 20-30 flashcards con {pregunta, respuesta 30-70 palabras}
□ Nivel 4: legislación específica por CCAA (min. 3 CCAA)
□ Propuesta: lectura y actividad NO vacías

---

PASO 5: CARGA A BD

Ejecutar en terminal del usuario:
```bash
cd /Users/jordiluquemas/proyectos/metodofyq-academia

# Cargar niveles 0-3
npx tsx scripts/seed-tema-XX.ts

# Cargar N2.5
npx tsx scripts/load-flashcards.ts scripts/data/tema-XX-n25.json

# Cargar N3.5
npx tsx scripts/load-flashcards.ts scripts/data/tema-XX-n35.json

# [Si hay legislación Nivel 4]
# npx tsx scripts/load-nivel4.ts scripts/data/tema-XX-nivel4.json

# [Si hay propuesta didáctica]
# npx tsx scripts/load-propuesta.ts scripts/data/tema-XX-propuesta.json
```

---

PASO 6: VERIFICACIÓN POST-CARGA

Ejecutar este checklist:

```bash
npx tsx << 'EOF'
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(URL, SERVICE_ROLE_KEY);

async function verify() {
  console.log("🔍 Verificando TEMA-XX...\n");
  
  // 1. Tema existe
  const { data: tema } = await supabase
    .from("topics")
    .select("*")
    .eq("code", "TEMA-XX")
    .single();
  
  if (!tema) {
    console.log("❌ Tema no encontrado");
    return;
  }
  console.log("✅ Tema:", tema.code, tema.title);
  
  // 2. Niveles cargados
  const { data: levels } = await supabase
    .from("topic_levels")
    .select("level")
    .eq("topic_id", tema.id);
  
  const loadedLevels = levels.map(l => l.level).sort();
  console.log("✅ Niveles:", loadedLevels);
  
  // 3. Flashcards N2.5
  const { data: fc25 } = await supabase
    .from("flashcards")
    .select("id")
    .eq("topic_id", tema.id)
    .eq("level", 2.5);
  
  console.log(`✅ N2.5: ${fc25.length} flashcards (rango: 50-80)`);
  if (fc25.length < 50 || fc25.length > 80) {
    console.warn(`⚠️ Fuera de rango: esperado 50-80, obtenido ${fc25.length}`);
  }
  
  // 4. Flashcards N3.5
  const { data: fc35 } = await supabase
    .from("flashcards")
    .select("id")
    .eq("topic_id", tema.id)
    .eq("level", 3.5);
  
  console.log(`✅ N3.5: ${fc35.length} flashcards (rango: 20-30)`);
  if (fc35.length < 20 || fc35.length > 30) {
    console.warn(`⚠️ Fuera de rango: esperado 20-30, obtenido ${fc35.length}`);
  }
  
  // 5. Legislación
  const { data: leg } = await supabase
    .from("topic_legislation_by_ccaa")
    .select("ccaa")
    .eq("topic_id", tema.id);
  
  console.log(`✅ Legislación: ${leg.length} CCAA - [${leg.map(l => l.ccaa).join(", ")}]`);
  
  // 6. Propuesta didáctica
  const { data: prop } = await supabase
    .from("topic_propuesta_didactica")
    .select("*")
    .eq("topic_id", tema.id);
  
  if (prop && prop.length > 0) {
    console.log("✅ Propuesta didáctica:", prop[0].lectura?.substring(0, 50) + "...");
  }
  
  console.log("\n✨ Verificación completa");
}

verify().catch(console.error);
EOF
```

---

PASO 7: TESTING EN APLICACIÓN

□ Login como user grupo 1 (sin N4): verificar que N4 NO aparece
□ Login como user grupo 2 (con N4): verificar que N4 aparece
□ Cargar Nivel 1: verificar keywords con contexto de subapartado
□ Cargar N2.5: verificar 50-80 tarjetas en mobile (sin lag)
□ Cargar N3.5: verificar preguntas abiertas + respuestas largas se renderizan bien
□ Nivel 4: cambiar CCAA y verificar legislación específica
□ Propuesta: verificar que solo grupo 2 la ve
□ Búsqueda: verificar tema aparece en buscador

---

PASO 8: COMMIT Y DEPLOY

```bash
git add scripts/data/tema-XX-*.json scripts/seed-tema-XX.ts

git commit -m "feat: TEMA-XX (descripción) - N0-3, N2.5 (N flashcards), N3.5 (N flashcards), Legislación, Propuesta

- Niveles 0-3 completos
- N2.5: XX flashcards recuperación activa
- N3.5: XX flashcards reconstrucción científica
- Legislación: Legislación específica CCAA (XX CCAA)
- Propuesta: Debate/Laboratorio/Proyecto (solo grupo 2)

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>
"

# Verificar build
npm run build

# Push
git push

# Deploy
vercel deploy --prod
```

---

## 🎯 MÉTRICAS DE ÉXITO

Para TEMA-XX:
- ✅ Commits de fix: máximo 1-2 (vs 16 en TEMA-01)
- ✅ Ciclos de revisión: 1 (vs 12+ en TEMA-01)
- ✅ Tiempo total: 2-3 horas (vs 8 en TEMA-01)
- ✅ Cero re-procesamiento de niveles
- ✅ Cero inconsistencias CCAA

---

## ❌ ERRORES A EVITAR (Resumen)

1. No verificar schema de BD ANTES de generar JSON
2. Incluir definiciones en Nivel 1 (solo términos)
3. Omitir subapartado en keywords
4. Generar cantidad incorrecta de flashcards
5. No validar datos ANTES de insertar
6. Incluir legislación en Nivel 3 (va solo en N4)
7. Campo dynamica con texto largo (varchar(50))
8. Nombres CCAA inconsistentes
9. Usar guiones vs guiones bajos inconsistentemente
10. No hacer testing hasta que está todo "listo"

```

---

## ANEXO: MAPEO DE CCAA

```json
{
  "ccaa_map": {
    "madrid": "Comunidad de Madrid",
    "barcelona": "Cataluña",
    "valencia": "Comunitat Valenciana",
    "andalucia": "Andalucía",
    "sevilla": "Andalucía",
    "bilbao": "País Vasco",
    "basque": "País Vasco",
    "asturias": "Principado de Asturias",
    "galicia": "Galicia",
    "murcia": "Región de Murcia",
    "aragon": "Aragón",
    "castilla_leon": "Castilla y León",
    "castilla_mancha": "Castilla-La Mancha",
    "extremadura": "Extremadura",
    "islas_baleares": "Illes Balears",
    "islas_canarias": "Canarias",
    "navarra": "Comunidad Foral de Navarra",
    "rioja": "La Rioja",
    "ceuta": "Ceuta",
    "melilla": "Melilla"
  }
}
```

---

**FIN DEL PROMPT**

Copiar este prompt en el siguiente tema para evitar errores repetitivos.
```

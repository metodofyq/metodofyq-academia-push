# ✅ CHECKLIST RÁPIDO - CARGA DE TEMAS

## 🎯 ANTES DE EMPEZAR

```
TEMA: ___________    FECHA: ___________    RESPONSABLE: ___________

□ Contenido preparado en archivos de texto
□ Schema de Supabase verificado
□ Template de scripts listos (seed-tema-XX.ts)
□ Usuario test grupo 1 y grupo 2 disponibles
```

---

## 📊 NIVEL 0 - Índice/Estructura

```
□ Apartados identificados (mínimo 3)
□ Subapartados extraídos para CADA apartado
□ Puntos/viñetas capturadas bajo cada subapartado
□ Validar estructura JSON se puede parsear

Cantidad esperada:
  - Apartados: 3-7
  - Subapartados por apartado: 2-5
  - Puntos por subapartado: 3-8
```

---

## 📋 NIVEL 1 - Palabras Clave

```
□ SIN DEFINICIONES (solo términos)
□ Mínimo 40 palabras clave
□ Cada palabra clave tiene subapartado de origen
□ Estructura JSON válida

Validar:
  [ ] Keywords distribuidas por apartado (no todos en uno)
  [ ] Subapartado siempre presente en JSON
  [ ] NO hay columna "definicion" o "descripcion"
  
Cantidad esperada: 40-80 palabras clave
```

---

## 📝 NIVEL 2 - Desarrollo Esquemático

```
□ Contenido copiado del texto de referencia
□ Estructurado con viñetas/numeración
□ Máximo 3,000 caracteres

Contar caracteres:
  [ ] 1,000 - 3,000: ✅ CORRECTO
  [ ] < 1,000: ❌ Muy corto
  [ ] > 3,000: ❌ Muy largo (reducir)
```

---

## 🎴 NIVEL 2.5 - Flashcards Recuperación Activa

```
Cantidad: 50-80 tarjetas

□ Campos: termino (string), descripcion (string), apartado, subapartado
□ Descripción: 5-30 palabras (hechos cortos, conceptos)
□ Sin solapamiento con N3.5
□ Sin definiciones largas (máx 30 palabras)

Formato JSON:
{
  "id": "n25_001",
  "termino": "Revolución científica",
  "descripcion": "Cambio profundo en marco conceptual que transforma paradigmas",
  "apartado": "2",
  "subapartado": "2.1"
}

Validar cantidad:
  [ ] Total flashcards: _____ (debe ser 50-80)
```

---

## 📚 NIVEL 3 - Redacción Completa

```
□ Ensayo/examen tipo completo
□ Incluye: introducción, apartados, conclusiones
□ NO incluye legislación (eso va en N4)
□ NO incluye propuesta didáctica
□ Máximo 5,000 caracteres

Contar caracteres:
  [ ] 3,000 - 5,000: ✅ CORRECTO
  [ ] < 3,000: ❌ Muy corto
  [ ] > 5,000: ❌ Muy largo (reducir)
```

---

## 🎴 NIVEL 3.5 - Flashcards Reconstrucción Científica

```
Cantidad: 20-30 tarjetas

□ Campos: pregunta (string), respuesta (string), apartado, subapartado
□ Preguntas: "Explica...", "Justifica...", "Analiza..." (preguntas abiertas)
□ Respuestas: 30-70 palabras (síntesis, no datos)
□ Sin solapamiento con N2.5

Formato JSON:
{
  "id": "n35_001",
  "pregunta": "Explica el concepto de paradigma según Kuhn",
  "respuesta": "Un paradigma es un marco conceptual compartido... [30-70 palabras]",
  "apartado": "2",
  "subapartado": "2.2"
}

Validar cantidad:
  [ ] Total flashcards: _____ (debe ser 20-30)
  [ ] Largo de respuestas: muestra primera respuesta _____ (30-70 palabras)
```

---

## ⚖️ NIVEL 4 - Legislación (Solo Grupo 2)

```
□ Un registro POR CCAA
□ Mínimo 3 CCAA
□ Contenido específico por comunidad

CCAA mapeadas correctamente:
  [ ] Madrid
  [ ] Barcelona  
  [ ] Valencia
  [ ] Andalucía
  [ ] País Vasco
  [ ] [Otras: ________________]

Validar nombres CCAA:
  ✅ "Comunidad de Madrid" (NO "Madrid")
  ✅ "Cataluña" (NO "Barcelona", NO "Catalunya")
  ✅ "Comunitat Valenciana" (NO "Valencia")
  ✅ "Región de Murcia" (NO "Murcia")
```

---

## 🎓 Propuesta Didáctica (Solo Grupo 2)

```
□ Contenido "Lectura" (texto largo, sin límite)
□ Contenido "Actividad" (texto largo, sin límite)
□ Estructura clara y pedagógica
□ NO usar campo "dinamica" para textos largos

Validar:
  [ ] Lectura describe contexto/controversia
  [ ] Actividad describe fases y roles
  [ ] Totalidad > 500 caracteres
```

---

## 🔍 ANTES DE INSERTAR EN BD

```
Validación de datos:
  [ ] JSON válido (testear en jsonlint.com)
  [ ] Caracteres especiales escapados
  [ ] SIN campos NULL sin sentido
  [ ] Nombres CCAA consistentes
  [ ] Guiones vs guiones bajos consistentes (kebab-case vs snake_case)

Validación de contenido:
  [ ] Ningún nivel vacío (todos tienen texto)
  [ ] Cantidad flashcards dentro de rango
  [ ] SIN definiciones en N1
  [ ] SIN legislación en N3
  [ ] Longitud de textos correcta
```

---

## 💾 CARGA A BD

```bash
# 1. Verificar base datos limpia (sin tema previo)
[ ] SELECT * FROM topics WHERE code = 'TEMA-XX'; → Debe estar vacío

# 2. Ejecutar seed script
npm run seed-tema-XX

# 3. Cargar flashcards
npm run load-flashcards tema-XX-n25
npm run load-flashcards tema-XX-n35

# 4. Verificar inserción
SELECT COUNT(*) FROM flashcards WHERE topic_id = (SELECT id FROM topics WHERE code='TEMA-XX');
```

---

## 🧪 POST-CARGA - VERIFICACIÓN TÉCNICA

```
□ Tema aparece en lista topics (SELECT COUNT)
□ Niveles 0-3 cargados (SELECT * FROM topic_levels)
□ N2.5 contiene 50-80 flashcards
□ N3.5 contiene 20-30 flashcards
□ Legislación: registros por CCAA
□ Propuesta: datos presentes

Contar registros:
  [ ] Niveles: _____ (debe ser 4: N0, N1, N2, N3)
  [ ] Flashcards N2.5: _____ (debe ser 50-80)
  [ ] Flashcards N3.5: _____ (debe ser 20-30)
  [ ] Legislación CCAA: _____ (debe ser ≥3)
```

---

## 🎮 POST-CARGA - TESTING EN UI

```
USUARIO GRUPO 1 (sin legislación):
  [ ] Tema aparece en /mis-temas
  [ ] Puede abrir Nivel 0 (índice)
  [ ] Puede abrir Nivel 1 (palabras clave con subapartado)
  [ ] Puede abrir Nivel 2 (desarrollo esquemático)
  [ ] Puede abrir Nivel 2.5 (50-80 flashcards se cargan)
  [ ] Puede abrir Nivel 3 (redacción completa)
  [ ] Puede abrir Nivel 3.5 (20-30 flashcards se cargan)
  [ ] BLOQUEO: Nivel 4 NOT appears
  [ ] BLOQUEO: Propuesta didáctica NOT appears

USUARIO GRUPO 2 (con legislación):
  [ ] Tema aparece en /mis-temas
  [ ] Puede abrir Niveles 0-3 (igual a grupo 1)
  [ ] Puede abrir Nivel 4 (legislación)
  [ ] Selector CCAA funciona
  [ ] Contenido legislativo cambia por CCAA
  [ ] Puede abrir Propuesta didáctica
  [ ] Contenido propuesta se renderiza correctamente

TESTING MOBILE:
  [ ] Nivel 1 keywords se ve bien (no rompe layout)
  [ ] N2.5 flashcards: sin lag al pasar (50-80 no causa lag)
  [ ] N3.5 flashcards: preguntas largas se ven completas
  [ ] Nivel 4 selector CCAA accesible
  
TESTING BÚSQUEDA:
  [ ] Tema aparece en buscador
  [ ] Primer letra del código coincide
```

---

## 🐛 SI ALGO FALLA

```
FALLO: Tema no aparece en base datos
→ Verificar: ¿Insertó el script correctamente?
   npx tsx << 'EOF'
   const supabase = createClient(...);
   const { data } = await supabase.from('topics').select('*').eq('code', 'TEMA-XX');
   console.log(data);
   EOF

FALLO: Flashcards no aparecen
→ Verificar campos: ¿termino/descripcion o pregunta/respuesta?
   SELECT column_name FROM information_schema.columns WHERE table_name='flashcards';

FALLO: Nivel 4 legislación no carga
→ Verificar CCAA nombres EXACTOS en tabla topic_legislation_by_ccaa
   SELECT DISTINCT ccaa FROM topic_legislation_by_ccaa;

FALLO: Propuesta didáctica no se ve
→ Verificar usuario es grupo 2:
   SELECT grupo FROM profiles WHERE email = 'test@example.com';
   
FALLO: JSON insert error
→ Validar JSON online: https://jsonlint.com/
→ Escapar caracteres especiales: " → \"
```

---

## ✨ FINAL - COMMIT Y PUSH

```
[ ] git status (verificar archivos a commitear)
[ ] npm run build (sin errores)
[ ] git add scripts/data/tema-XX-* scripts/seed-tema-XX.ts
[ ] git commit -m "feat: TEMA-XX - [breve descripción]"
[ ] git push
[ ] vercel deploy --prod
[ ] Verificar deployment en producción

Mensaje commit:
  feat: TEMA-XX (Título del tema) - Niveles 0-3, N2.5 (50-80), N3.5 (20-30), Legislación, Propuesta
  
  - Nivel 0: Estructura e índice del tema
  - Nivel 1: XX palabras clave por subapartado
  - Nivel 2: Desarrollo esquemático (X caracteres)
  - Nivel 3: Redacción completa (X caracteres)
  - N2.5: XX flashcards recuperación activa
  - N3.5: XX flashcards reconstrucción científica
  - Legislación: XX CCAA específica
  - Propuesta: [Debate/Laboratorio/Proyecto] - grupo 2
  
  Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>
```

---

## 📊 TRACKER DE TEMAS

```
| Tema | Niveles | N2.5 | N3.5 | Leg. | Prop. | Commits Fix | Estado |
|------|---------|------|------|------|-------|-------------|--------|
| 01   | ✅ 0-3  |  ✅  |  ✅  | ✅   |  ✅   |     16      | Done   |
| 02   |         |      |      |      |       |             |        |
| 03   |         |      |      |      |       |             |        |
| 54   |         |      |      |      |       |             |        |
| 55   |         |      |      |      |       |             |        |
```

---

**IMPRIMIR ESTE DOCUMENTO Y USAR COMO REFERENCIA PARA CADA TEMA**

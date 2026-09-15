# 📚 Guía: Scripts Reutilizables para Cargar Temas

Este directorio contiene scripts universales para cargar, validar y verificar temas completos en la aplicación.

---

## 📋 Flujo de Trabajo Completo

### Paso 1: Preparar los JSONs

Crea 4 archivos en `scripts/data/`:

```bash
scripts/data/
├── tema-XX-nivel25.json           # 109 flashcards (recuperación activa)
├── tema-XX-nivel35.json           # 23 flashcards (reconstrucción científica)
├── tema-XX-propuesta-didactica.json  # Actividad didáctica
└── tema-XX-legislacion.json       # Legislación por CCAA (5 regiones)
```

### Paso 2: Validar los JSONs

```bash
npx tsx scripts/validate-tema-json.ts TEMA-XX
```

**Qué verifica:**
- ✅ Formato JSON válido
- ✅ Campos requeridos
- ✅ Número de flashcards
- ✅ Longitud de respuestas (N2.5: ≤30 palabras, N3.5: 30-70 palabras)
- ✅ Tipos de preguntas (N3.5 debe comenzar con: Explica, Justifica, Analiza, Compara, Deduce)
- ✅ Todas las CCAA presentes (Aragón, Castilla y León, Valencia, Navarra, La Rioja)

### Paso 3: Cargar el Tema

```bash
npx tsx scripts/seed-tema-generic.ts TEMA-XX
```

**Opciones:**
```bash
# Saltar componentes específicos
npx tsx scripts/seed-tema-generic.ts TEMA-XX --skip-n25
npx tsx scripts/seed-tema-generic.ts TEMA-XX --skip-n35
npx tsx scripts/seed-tema-generic.ts TEMA-XX --skip-propuesta
npx tsx scripts/seed-tema-generic.ts TEMA-XX --skip-legislacion
```

### Paso 4: Verificar la Carga

```bash
npx tsx scripts/verify-tema.ts TEMA-XX
```

**Salida:**
```
📌 Topic:
  ✅ Encontrado (ID: xxxx-xxxx-xxxx-xxxx)
  ℹ️  Grupo: 2

📚 Flashcards:
  ✅ N2.5: 109 flashcards
  ✅ N3.5: 23 flashcards

💭 Propuesta Didáctica:
  ✅ Cargada

⚖️  Legislación por CCAA:
  ✅ Aragón
  ✅ Castilla y León
  ✅ La Rioja
  ✅ Navarra
  ✅ Valencia

==================================================
✅ ESTADO GENERAL: COMPLETO
==================================================
```

---

## 📄 Formatos de JSON

### N2.5: Recuperación Activa (nivel25.json)

```json
{
  "tema": "TEMA-XX",
  "nivel": "2.5",
  "titulo": "Recuperación activa - Conceptos clave",
  "flashcards": [
    {
      "id": 1,
      "apartado": "1. Sección",
      "subapartado": "1.1. Subsección",
      "pregunta": "¿Qué es...?",
      "respuesta": "Definición corta (máx 30 palabras)"
    }
  ]
}
```

**Requisitos:**
- `id`: Número único (1-109)
- `pregunta`: Tipo: "¿Qué...", "¿Cómo...", "¿Cuáles...", etc.
- `respuesta`: ≤ 30 palabras

---

### N3.5: Reconstrucción Científica (nivel35.json)

```json
{
  "tema": "TEMA-XX",
  "nivel": "3.5",
  "titulo": "Reconstrucción científica - Síntesis y justificación",
  "flashcards": [
    {
      "id": 1,
      "apartado": "1. Sección",
      "subapartado": "1.1. Subsección",
      "pregunta": "Explica por qué...",
      "respuesta": "Respuesta con razonamiento (30-70 palabras)"
    }
  ]
}
```

**Requisitos:**
- `id`: Número único (1-23)
- `pregunta`: Debe comenzar con: "Explica", "Justifica", "Analiza", "Compara", "Deduce"
- `respuesta`: 30-70 palabras

---

### Propuesta Didáctica (propuesta-didactica.json)

```json
{
  "tema": "TEMA-XX",
  "grupo": 2,
  "lectura": "Introducción a la actividad...",
  "actividad": "Descripción de la actividad y evaluación...",
  "dinamica": "debate_argumentacion"
}
```

**Tipos de dinámicas disponibles:**
- `debate_argumentacion`: Debate científico
- `proyecto_colaborativo`: Trabajo en grupo
- `investigacion`: Investigación guiada
- `estudio_casos`: Análisis de casos

---

### Legislación (legislacion.json)

```json
{
  "tema": "TEMA-XX",
  "nivel": 4,
  "tipo": "legislacion_por_ccaa",
  "registros": [
    {
      "ccaa": "Aragón",
      "titulo": "Legislación - Aragón",
      "contenido": "Texto completo de legislación autonómica..."
    },
    {
      "ccaa": "Castilla y León",
      "titulo": "Legislación - Castilla y León",
      "contenido": "Texto completo..."
    }
    // ... repetir para: Valencia, Navarra, La Rioja
  ]
}
```

**Requisitos:**
- ✅ 5 CCAA exactas: Aragón, Castilla y León, Valencia, Navarra, La Rioja
- ✅ Campo `contenido`: Texto de legislación autonómica

---

## 🔄 Scripts Disponibles

### 1. `validate-tema-json.ts`

Valida que los JSONs estén bien formados.

```bash
npx tsx scripts/validate-tema-json.ts TEMA-02
```

### 2. `seed-tema-generic.ts`

Carga todos los datos a Supabase.

```bash
# Cargar todo
npx tsx scripts/seed-tema-generic.ts TEMA-02

# Cargar solo flashcards, saltando propuesta y legislación
npx tsx scripts/seed-tema-generic.ts TEMA-02 --skip-propuesta --skip-legislacion
```

### 3. `verify-tema.ts`

Verifica que todo está cargado correctamente.

```bash
npx tsx scripts/verify-tema.ts TEMA-02
```

### 4. `check-tema-id.ts`

Busca o crea un tema y devuelve su ID.

```bash
npx tsx scripts/check-tema-id.ts
```

---

## ⚡ Comando Rápido (Todo en Uno)

```bash
# 1. Validar
npx tsx scripts/validate-tema-json.ts TEMA-02 && \

# 2. Cargar
npx tsx scripts/seed-tema-generic.ts TEMA-02 && \

# 3. Verificar
npx tsx scripts/verify-tema.ts TEMA-02
```

---

## 📖 Ejemplo Completo: TEMA-02

### 1. Crear archivos en `scripts/data/`

```bash
scripts/data/
├── tema-02-nivel25.json
├── tema-02-nivel35.json
├── tema-02-propuesta-didactica.json
└── tema-02-legislacion.json
```

### 2. Validar

```bash
$ npx tsx scripts/validate-tema-json.ts TEMA-02

✅ N2.5: 109 flashcards
✅ N3.5: 23 flashcards
✅ Propuesta didáctica
✅ Legislación: 5 CCAA

✅ VALIDACIÓN EXITOSA (4/4 archivos válidos)
```

### 3. Cargar

```bash
$ npx tsx scripts/seed-tema-generic.ts TEMA-02

✅ Topic ya existe
✅ N2.5 cargado: 109 flashcards
✅ N3.5 cargado: 23 flashcards
✅ Propuesta didáctica cargada
⚖️  Legislación:
  ✅ Aragón
  ✅ Castilla y León
  ✅ La Rioja
  ✅ Navarra
  ✅ Valencia

🎉 Carga completada
```

### 4. Verificar

```bash
$ npx tsx scripts/verify-tema.ts TEMA-02

✅ ESTADO GENERAL: COMPLETO
```

---

## 🐛 Troubleshooting

### Error: "Archivo no encontrado"

**Causa:** Los JSONs están en una ubicación incorrecta o mal nombrados.

**Solución:** Verifica que los archivos estén en `scripts/data/` con nombres en minúsculas:
```bash
ls scripts/data/tema-02-*.json
```

### Error: "JSON inválido"

**Causa:** Sintaxis JSON incorrecta.

**Solución:** Valida el JSON con un linter:
```bash
node -e "console.log(JSON.parse(require('fs').readFileSync('scripts/data/tema-02-nivel25.json', 'utf-8')))"
```

### Error: "Falta CCAA"

**Causa:** Legislación no tiene todas las 5 CCAA.

**Solución:** Asegúrate de que `legislacion.json` incluya exactamente:
- Aragón
- Castilla y León
- Valencia
- Navarra
- La Rioja

### Error: "Respuesta demasiado larga en N2.5"

**Causa:** Respuesta > 30 palabras.

**Solución:** Reduce la respuesta a máximo 30 palabras.

### Error: "Pregunta no comienza con verbo (N3.5)"

**Causa:** Pregunta no comienza con: Explica, Justifica, Analiza, Compara, Deduce.

**Solución:** Cambia la pregunta:
```
❌ ¿Cómo funciona...?
✅ Explica cómo funciona...
```

---

## 📚 Referencias Rápidas

**N2.5 Rubric:**
- Preguntas cortas que piden recordar
- Respuestas ≤ 30 palabras
- Sin explicaciones largas

**N3.5 Rubric:**
- Preguntas que piden análisis/síntesis
- Respuestas 30-70 palabras
- Requieren razonamiento

**Legislación:**
- 5 CCAA obligatorias
- Contenido específico por región
- Se muestra según CCAA del estudiante

---

## 🚀 Next Steps

Después de cargar un tema:

1. **Deploy a producción:**
   ```bash
   git add scripts/data/tema-XX-*.json
   git commit -m "feat: Agregar Tema XX"
   npx vercel deploy --prod --yes
   ```

2. **Verificar en la app:**
   - Login con un usuario del grupo 2
   - Buscar el tema en "Todos los temas"
   - Navegar por los niveles

3. **Asignar a estudiantes:**
   - Ir a `/teacher/plans`
   - Crear un plan y asignar temas

---

**¿Preguntas?** Revisa los scripts en `scripts/` o contacta al equipo.

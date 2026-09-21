# 🚀 GUÍA RÁPIDA - CARGAR TEMA-19 CON EL SISTEMA

## 📋 Resumen: 2-3 Horas de Trabajo

```
Paso 1: Claude Code (30 min) → Genera archivos
Paso 2: Terminal (15 min) → Sube a Supabase  
Paso 3: Git + Vercel (10 min) → Deploy
Paso 4: Testing (20 min) → Verifica

TOTAL: 2.5 horas vs 8 horas en TEMA-01
```

---

## ⏰ PASO 1: PREPARAR TEMA-19 (10 min)

```
Necesitas tener listos 7 archivos de texto con:

1️⃣ TEMA-19-NIVEL0.txt
   → Estructura/índice del tema
   → Apartados, subapartados, puntos

2️⃣ TEMA-19-NIVEL1.txt
   → Palabras clave (SIN definiciones)
   → Una por línea o separadas por comas

3️⃣ TEMA-19-NIVEL2.txt
   → Desarrollo esquemático
   → Max 3,000 caracteres

4️⃣ TEMA-19-NIVEL3.txt
   → Redacción completa (ensayo)
   → Max 5,000 caracteres

5️⃣ TEMA-19-NIVEL4.txt (Legislación CCAA)
   → Madrid: [contenido legislación Madrid]
   → Barcelona: [contenido legislación Barcelona]
   → Valencia: [contenido legislación Valencia]
   → [Otras CCAA...]

6️⃣ TEMA-19-PROPUESTA.txt
   → Estrategia didáctica
   → Lectura: [contexto/debate]
   → Actividad: [estructura de actividad]

7️⃣ TEMA-19-FLASHCARDS.txt (Opcional)
   → Si ya tienes generadas
   → Si no, Claude las genera (50-80 N2.5, 20-30 N3.5)
```

---

## 🤖 PASO 2: CLAUDE CODE (30 min)

### 2.1 Abre nueva conversación en Claude Code

```
Menú → New Conversation
(En la misma sesión de Claude Code)
```

### 2.2 Copia el prompt completo

```
Abre: PROMPT_PARA_PROXIMOS_TEMAS.md
Selecciona TODO desde "TAREA: Procesar y cargar nuevo tema..."
Hasta "FIN DEL PROMPT"
Copiar (Ctrl+C)
```

### 2.3 Pega el prompt en Claude Code

```
Claude Code:
Pega el prompt (Ctrl+V)
Presiona Enter
```

### 2.4 Pega el contenido de TEMA-19

```
Formato esperado:

=== TEMA-19 - NIVEL 0 ===
[Contenido aquí]

=== TEMA-19 - NIVEL 1 ===
[Contenido aquí]

=== TEMA-19 - NIVEL 2 ===
[Contenido aquí]

=== TEMA-19 - NIVEL 3 ===
[Contenido aquí]

=== TEMA-19 - NIVEL 4 ===
[Contenido aquí]

=== TEMA-19 - PROPUESTA DIDÁCTICA ===
[Contenido aquí]
```

### 2.5 Espera a que Claude genere archivos

Claude Code generará automáticamente:
```
✅ scripts/data/tema-19-estructura.json
✅ scripts/data/tema-19-n25.json
✅ scripts/data/tema-19-n35.json
✅ scripts/seed-tema-19.ts
✅ Validaciones y checklist
```

**Tiempo:** 20-30 minutos

---

## 💾 PASO 3: EJECUTAR EN TERMINAL (15 min)

### 3.1 Abre Terminal en tu Mac

```
Cmd + Space → Busca "Terminal" → Abre
```

### 3.2 Navega al proyecto

```bash
cd /Users/jordiluquemas/proyectos/metodofyq-academia
```

### 3.3 Ejecuta los 3 comandos de carga

```bash
# Comando 1: Cargar estructura (N0-3)
npx tsx scripts/seed-tema-19.ts

# Comando 2: Cargar flashcards N2.5 (recuperación)
npx tsx scripts/load-flashcards.ts scripts/data/tema-19-n25.json

# Comando 3: Cargar flashcards N3.5 (reconstrucción)
npx tsx scripts/load-flashcards.ts scripts/data/tema-19-n35.json
```

**Esperado:**
```
✅ Tema 19 creado/actualizado
✅ Niveles 0-3 insertados
✅ N2.5: 78 flashcards insertadas
✅ N3.5: 23 flashcards insertadas
```

**Tiempo:** 5-10 minutos

---

## 🔄 PASO 4: GIT + VERCEL (10 min)

### 4.1 Agregar archivos a Git

```bash
git add scripts/data/tema-19-* scripts/seed-tema-19.ts
```

### 4.2 Crear commit

```bash
git commit -m "feat: TEMA-19 (Título del tema) - N0-3 + N2.5 (78) + N3.5 (23) + Legislación + Propuesta

- Nivel 0: Estructura e índice
- Nivel 1: palabras clave por subapartado
- Nivel 2: Desarrollo esquemático
- Nivel 3: Redacción completa
- N2.5: 78 flashcards recuperación activa
- N3.5: 23 flashcards reconstrucción científica
- Legislación: 6 CCAA específica
- Propuesta: Debate científico (grupo 2)

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>
"
```

### 4.3 Push a GitHub

```bash
git push
```

### 4.4 Deploy a Vercel

```bash
vercel deploy --prod
```

**Esperado:**
```
Vercel will now build and deploy your project to production
✓ Production deployment created
✓ https://metodofyq-academia.vercel.app
```

**Tiempo:** 3-5 minutos (Vercel tarda ~2-3 min en deployar)

---

## 🧪 PASO 5: TESTING EN APLICACIÓN (20 min)

### 5.1 Espera 2-3 minutos a que Vercel termina

```
Vercel está deployando... (status en https://vercel.com)
```

### 5.2 Abre la aplicación en navegador

```
https://metodofyq-academia.vercel.app/login
```

### 5.3 Testing GRUPO 1 (Sin legislación)

```
Email: testalumno.verificar@example.com
Password: StudentPassword123!

Verificar:
  ✅ Tema 19 aparece en /mis-temas
  ✅ Nivel 0: Índice se carga (estructura visible)
  ✅ Nivel 1: Palabras clave con subapartado contexto
  ✅ Nivel 2: Desarrollo esquemático se ve
  ✅ Nivel 2.5: 78 flashcards cargan (sin lag)
  ✅ Nivel 3: Redacción completa se ve
  ✅ Nivel 3.5: 23 flashcards cargan (preguntas abiertas)
  ❌ Nivel 4: NO debe aparecer (grupo 1 no lo ve)
  ❌ Propuesta: NO debe aparecer (grupo 1 no la ve)
```

### 5.4 Testing GRUPO 2 (Con legislación)

```
Email: test-teacher@example.com
Password: TestPassword123!

Verificar:
  ✅ Tema 19 aparece
  ✅ Niveles 0-3 igual que grupo 1
  ✅ Nivel 4: Aparece (legislación)
    - Selector CCAA funciona
    - Cambia contenido por CCAA seleccionada
  ✅ Propuesta: Aparece (debate/actividad)
    - Texto "Lectura" se carga
    - Texto "Actividad" se carga
```

### 5.5 Testing Mobile

```
Abrir en navegador:
  Dev Tools (F12) → Toggle device toolbar (Ctrl+Shift+M)
  Emular iPhone 12
  
Verificar:
  ✅ Nivel 1: Se ve bien (no rompe layout)
  ✅ N2.5: 78 flashcards sin lag
  ✅ N3.5: Preguntas largas legibles
  ✅ Nivel 4: Selector CCAA accesible
```

**Tiempo:** 10-15 minutos (1 problema = 5 min extra debugging)

---

## ✅ CHECKLIST FINAL

```
ANTES DE EMPEZAR:
  □ Textos de Tema 19 listos en 7 archivos
  □ Terminal disponible
  □ Vercel CLI logueado (vercel whoami)
  □ Navegador con sesión Vercel abierto

PASO 1 (Claude Code):
  □ Nuevo conversation en Claude Code
  □ Pegué PROMPT_PARA_PROXIMOS_TEMAS.md
  □ Pegué contenido de Tema 19
  □ Claude generó 4 archivos JSON + scripts

PASO 2 (Terminal):
  □ Ejecuté: npx tsx scripts/seed-tema-19.ts
  □ Ejecuté: npx tsx scripts/load-flashcards.ts N2.5
  □ Ejecuté: npx tsx scripts/load-flashcards.ts N3.5
  □ Resultado: ✅ Datos en Supabase

PASO 3 (Git + Vercel):
  □ git add scripts/data/tema-19-*
  □ git commit -m "feat: TEMA-19..."
  □ git push
  □ vercel deploy --prod
  □ Resultado: ✅ Deploy en progreso

PASO 4 (Testing):
  □ Grupo 1: Niveles 0-3.5 funcionan, N4 + propuesta bloqueados ✅
  □ Grupo 2: Todos niveles + legislación + propuesta funcionan ✅
  □ Mobile: Sin lag, layout correcto ✅
  □ Resultado: ✅ Todo funciona

🎉 TEMA-19 COMPLETAMENTE CARGADO Y DEPLOYADO
```

---

## 🆘 SOLUCIÓN RÁPIDA SI ALGO FALLA

### Error: "El tema no aparece en /mis-temas"
```bash
# Verificar en terminal:
npx tsx << 'EOF'
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const { data } = await supabase.from("topics").select("*").eq("code", "TEMA-19");
console.log(data);
EOF
```

Si aparece tema pero no se ve: Espera 2 minutos y recarga navegador

### Error: "Flashcards no cargan"
```bash
# Verificar cantidad:
npx tsx << 'EOF'
const supabase = createClient(...);
const { data: tema } = await supabase.from("topics").select("id").eq("code", "TEMA-19").single();
const { data: fc25 } = await supabase.from("flashcards").select("id").eq("topic_id", tema.id).eq("level", 2.5);
console.log("N2.5:", fc25.length, "flashcards");
EOF
```

### Error: "Nivel 4 aparece en grupo 1"
```bash
# El usuario grupo 1 está mal configurado
# Verifica en Supabase:
SELECT grupo FROM profiles WHERE email = 'testalumno.verificar@example.com';
# Debe devolver: 1
```

---

## 📊 COMPARATIVA

| Métrica | TEMA-01 (Sin Sistema) | TEMA-19 (Con Sistema) |
|---------|----------------------|----------------------|
| Tiempo | 8 horas | 2-3 horas |
| Commits de fix | 16 | 0-1 |
| Iteraciones | 12+ | 1 |
| Errores de schema | 5 | 0 |
| Flashcards out of range | 2 | 0 |

---

## 🎯 RESULTADO ESPERADO

**Cuando termines:**
- ✅ Tema 19 en producción
- ✅ 4 niveles cargados (0-3)
- ✅ Flashcards N2.5 + N3.5 funcionando
- ✅ Legislación visible para grupo 2
- ✅ Propuesta didáctica accesible (grupo 2)
- ✅ Deploy completado
- ✅ Cero commits de fix necesarios

**¿Cuándo está listo?**
→ Cuando termines Paso 4 y los tests de Paso 5 pasen ✅

---

## 💡 TIPS PARA IR RÁPIDO

1. **Mientras Claude genera** (Paso 2):
   - Prepara terminal
   - Ten copiadera lista
   - Abre la BD de Supabase

2. **Mientras Vercel deploya** (Paso 4):
   - Ya puedes hacer testing
   - El tema estará online en 2-3 min

3. **Si algo falla**:
   - NO elimines archivos
   - Consulta ERRORES_Y_LECCIONES_TEMA01.md
   - Puedes reintentar sin problema

---

**¡Listo! Adelante con TEMA-19 🚀**

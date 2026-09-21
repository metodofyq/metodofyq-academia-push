# 📚 GUÍA COMPLETA - CARGA DE TEMAS A PLATAFORMA EDUCATIVA

## 🗂️ Documentación Generada

Esta carpeta contiene 3 documentos esenciales para evitar errores en la carga de futuros temas:

### 1. **ERRORES_Y_LECCIONES_TEMA01.md** 
**Propósito:** Análisis detallado de todos los errores ocurridos en TEMA-01

**Contenido:**
- 7 categorías de errores (parseo, configuración, lógica, datos, procesos, visualización, testing)
- 15+ errores específicos identificados
- Soluciones implementadas con código de ejemplo
- Commits que arreglaron cada problema

**Cuándo leerlo:**
- Primera vez que trabajas en carga de temas
- Cuando te encuentras con un error similar
- Para entender POR QUÉ ciertas validaciones son críticas

**Tiempo de lectura:** 15-20 minutos

---

### 2. **PROMPT_PARA_PROXIMOS_TEMAS.md** ⭐ PRINCIPAL
**Propósito:** Prompt reutilizable para Claude Code que automatiza la carga de nuevos temas

**Contenido:**
- 8 pasos estructurados (validaciones → parsing → scripts → carga → verificación)
- Estructura JSON esperada para cada nivel
- Scripts de validación listos para copiar-pegar
- Checklist de testing
- Mapeo de CCAA

**Cuándo usarlo:**
- Al cargar cada nuevo tema (TEMA-02, TEMA-54, etc.)
- Copia el prompt completo en una nueva conversación de Claude Code
- Pega el contenido del tema (N0-N4, propuesta, legislación)
- Claude generará automáticamente JSON + scripts validados

**Tiempo de setup:** 5 minutos por tema

---

### 3. **CHECKLIST_CARGA_TEMAS.md** ✅ REFERENCIA RÁPIDA
**Propósito:** Checklist imprimible de referencia rápida

**Contenido:**
- Checklist visual por cada nivel (N0-N4, propuesta)
- Cantidades esperadas de items
- Validaciones antes de insertar
- Testing post-carga (grupo 1 vs grupo 2)
- Pasos de debugging si algo falla
- Tracker de temas cargados

**Cuándo usarlo:**
- Mientras estás cargando un tema (usar en paralelo)
- Imprimir o tener abierto en otra pestaña
- Marcar casillas mientras avanzas
- Referencia cuando algo no funciona

**Tiempo de referencia:** 2-5 minutos (es checklist, no lectura)

---

## 🚀 FLUJO DE TRABAJO PARA PRÓXIMOS TEMAS

### Opción A: MÉTODO RÁPIDO (Recomendado)

```
1. Preparar contenido
   └─ Textos de N0-N4 listos
   └─ Propuesta didáctica (si aplica)

2. Copiar PROMPT_PARA_PROXIMOS_TEMAS.md
   └─ Abrir una nueva conversación en Claude Code
   └─ Pegar el prompt completo
   └─ Pegar contenido del tema

3. Claude genera automáticamente:
   └─ scripts/data/tema-XX-estructura.json
   └─ scripts/data/tema-XX-n25.json
   └─ scripts/data/tema-XX-n35.json
   └─ scripts/seed-tema-XX.ts
   └─ scripts de validación

4. Ejecutar en terminal:
   └─ npx tsx scripts/seed-tema-XX.ts
   └─ npx tsx scripts/load-flashcards.ts scripts/data/tema-XX-n25.json
   └─ npx tsx scripts/load-flashcards.ts scripts/data/tema-XX-n35.json

5. Verificar con checklist
   └─ Abrir CHECKLIST_CARGA_TEMAS.md
   └─ Marcar cada validación

Tiempo total: 2-3 horas (vs 8 horas en TEMA-01)
Commits de fix esperados: 0-1 (vs 16 en TEMA-01)
```

### Opción B: MÉTODO MANUAL (Si prefieres control total)

```
1. Leer ERRORES_Y_LECCIONES_TEMA01.md
   └─ Entiende qué salió mal antes

2. Leer PROMPT_PARA_PROXIMOS_TEMAS.md sección PASO 2
   └─ Entiende qué estructura JSON espera cada nivel

3. Crear JSON manualmente
   └─ scripts/data/tema-XX-estructura.json
   └─ scripts/data/tema-XX-n25.json
   └─ scripts/data/tema-XX-n35.json

4. Crear script de carga
   └─ scripts/seed-tema-XX.ts

5. Validar + cargar
   └─ Usar checklist

Tiempo total: 4-5 horas
Mejor si: Ya entiendes la estructura, quieres máximo control
```

---

## 🔑 PUNTOS CRÍTICOS (No Olvidar)

### ❌ ERRORES MÁS COMUNES EN TEMA-01 (Evita estos)

| Error | Síntoma | Prevención |
|-------|---------|-----------|
| Flashcards con campo `pregunta/respuesta` | Flashcards no se cargan | Usar siempre `termino/descripcion` (N2.5) y `pregunta/respuesta` (N3.5) |
| Palabras clave con definiciones | Nivel 1 confunde a estudiantes | N1 = SOLO términos, sin explicaciones |
| N2.5 con >80 flashcards | Lag en móvil | Limitar a 50-80 tarjetas |
| Legislación en Nivel 3 | Contenido duplicado/confuso | Legislación solo en N4 |
| CCAA inconsistentes | Legislación no se carga | Mapear nombres exactos: "Comunidad de Madrid", no "Madrid" |
| Campo `dinamica` con texto largo | Error varchar(50) | Dinamica = varchar(50), textos largos en `lectura`/`actividad` |

### ✅ LO QUE FUNCIONÓ BIEN EN TEMA-01

```
✓ Estructura JSON limpia por nivel
✓ Validación previa a inserción
✓ Scripts reutilizables (load-flashcards.ts)
✓ Testing con usuarios grupo 1 vs grupo 2
✓ Commits claros documentando cada fix
✓ Commit final = tema 100% funcional
```

---

## 📋 CHECKLIST PRE-TEMA

Antes de empezar con cualquier nuevo tema:

```
□ Leí ERRORES_Y_LECCIONES_TEMA01.md (por lo menos, los títulos)
□ Tengo PROMPT_PARA_PROXIMOS_TEMAS.md abierto en otra pestaña
□ Tengo CHECKLIST_CARGA_TEMAS.md para marcar mientras trabajo
□ Contenido de tema está en archivos separados (N0.txt, N1.txt, etc.)
□ Base de datos verificada (sin tema previo)
□ Usuario test grupo 1 y grupo 2 disponibles
□ Terminal lista para ejecutar comandos
□ 2-3 horas bloqueadas en calendario (sin interrupciones)
```

---

## 🎯 MÉTRICAS DE ÉXITO

Compara TEMA-01 vs TUS TEMAS NUEVOS:

```
TEMA-01:
- Commits de fix: 16
- Horas de debugging: 6-8
- Ciclos de revisión: 12+
- Errores de schema: 5
- Flashcards fuera de rango: 2

META para TEMA-XX:
- Commits de fix: ≤ 1-2 ✅
- Horas de debugging: ≤ 1-2 ✅
- Ciclos de revisión: 1 ✅
- Errores de schema: 0 ✅
- Flashcards fuera de rango: 0 ✅
```

---

## 🆘 TROUBLESHOOTING RÁPIDO

**Problema:** Error "value too long for type character varying(50)"
→ Ir a: ERRORES_Y_LECCIONES_TEMA01.md → sección 5.1
→ Solución: Campo `dinamica` es varchar(50), no usar para textos largos

**Problema:** Flashcards no se cargan en UI
→ Ir a: ERRORES_Y_LECCIONES_TEMA01.md → sección 1.1
→ Solución: Verificar campos: ¿termino/descripcion o pregunta/respuesta?

**Problema:** Nivel 1 sin contexto de subapartado
→ Ir a: PROMPT_PARA_PROXIMOS_TEMAS.md → PASO 2.2
→ Solución: Incluir siempre `subapartado` en cada palabra clave

**Problema:** CCAA legislación no se carga
→ Ir a: ERRORES_Y_LECCIONES_TEMA01.md → sección 2.3
→ Solución: Mapear nombres exactos de CCAA (ver anexo en prompt)

**Problema:** Nivel 4 aparece para grupo 1 (no debería)
→ Ir a: CHECKLIST_CARGA_TEMAS.md → Testing Grupo 1
→ Solución: Verificar configuración de grupo en tabla profiles

---

## 🔄 LOOP DE MEJORA

Para cada nuevo tema que cargues:

```
1. Ejecuta PROMPT_PARA_PROXIMOS_TEMAS.md
2. Completa CHECKLIST_CARGA_TEMAS.md
3. Anota CUALQUIER error nuevo (aunque sea pequeño)
4. Actualiza ERRORES_Y_LECCIONES_TEMA01.md con el nuevo error
5. Usa ese conocimiento en el siguiente tema

Esto es CI/CD para aprendizaje 🚀
```

---

## 📞 CONTACTO Y MANTENIMIENTO

Estos documentos fueron generados el **2026-09-21** basado en **16 commits de fix** en TEMA-01.

Si encuentras un error NO listado aquí:
1. Documéntalo en ERRORES_Y_LECCIONES_TEMA01.md
2. Actualiza la solución en PROMPT_PARA_PROXIMOS_TEMAS.md
3. Agrega checklist en CHECKLIST_CARGA_TEMAS.md

Así cada tema mejora el proceso para el siguiente. 🎯

---

## 📖 ORDEN RECOMENDADO DE LECTURA

```
Primera vez:
  1. LEE: ERRORES_Y_LECCIONES_TEMA01.md (20 min)
  2. LEE: PROMPT_PARA_PROXIMOS_TEMAS.md (30 min)
  3. IMPRIME: CHECKLIST_CARGA_TEMAS.md

Antes de cada tema nuevo:
  1. ABRE: PROMPT_PARA_PROXIMOS_TEMAS.md (cópialo a Claude)
  2. ABIERTO: CHECKLIST_CARGA_TEMAS.md (marca mientras trabajas)
  3. CONSULT: ERRORES_Y_LECCIONES_TEMA01.md (si aparece error)

Cuando algo falla:
  1. SEARCH en ERRORES_Y_LECCIONES_TEMA01.md por palabra clave
  2. SOLUCIÓN en sección correspondiente
  3. VERIFY en CHECKLIST_CARGA_TEMAS.md
```

---

**¡Éxito en la carga de temas! 🚀**

Esperamos que con esta documentación reduzcas el tiempo de carga de temas de 8 horas a 2-3 horas, 
y evites el 80% de los errores que ocurrieron en TEMA-01.

Usa el prompt, sigue el checklist, y consulta los errores cuando necesites.

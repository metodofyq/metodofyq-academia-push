# Verificación de Errores de Parseo - TEMA-01 v2

## Errores Identificados en TEMA-50 y TEMA-54

### Error 1: Nomenclatura Inconsistente
**Problema**: Archivo nombrado `tema-50-nivel25.json` en algunos lugares y `TEMA-50` en otros.
**Impacto**: Scripts de carga fallan si buscan `TEMA-50` pero encuentran `tema-50`.
**Solución aplicada**: 
- ✅ Todos los archivos siguen patrón: `tema-01-nivel25.json` (minúsculas)
- ✅ Campo JSON `"tema": "TEMA-01"` (mayúsculas consistentes)

---

### Error 2: Nombres de Campos Incorrectos
**Problema**: JSONs N2.5 y N3.5 usaban `"pregunta"` y `"respuesta"` pero UI esperaba `"termino"` y `"descripcion"`.
**Síntoma**: Flashcards cargaban pero aparecían vacíos en UI.
**Solución aplicada**:
- ✅ N2.5: `"termino"` (pregunta corta) y `"descripcion"` (respuesta ≤30 palabras)
- ✅ N3.5: `"termino"` (pregunta de análisis) y `"descripcion"` (respuesta 30-70 palabras)

---

### Error 3: Ausencia de Apartado/Subapartado
**Problema**: Algunos flashcards carecían de `apartado` o `subapartado`, causando errores en UI.
**Solución aplicada**:
- ✅ Todos los 109 N2.5 tienen apartado + subapartado
- ✅ Todos los 23 N3.5 tienen apartado + subapartado
- ✅ Apartados extraídos directamente de Nivel 0 (estructura)

---

### Error 4: Longitud Incorrecta en Respuestas
**Problema N2.5**: Respuestas >30 palabras fallaban validación.
**Problema N3.5**: Respuestas <30 o >70 palabras no pasaban validación.
**Solución aplicada**:
- ✅ N2.5: Todas las descripciones ≤30 palabras (verificado word count)
- ✅ N3.5: Todas las descripciones 30-70 palabras (verificado word count)

---

### Error 5: Verbos Iniciales Incorrectos en N3.5
**Problema**: Preguntas no comenzaban con: Explica, Justifica, Analiza, Compara, Deduce.
**Ejemplo erróneo**: "¿Cómo funciona el paradigma?"
**Ejemplo correcto**: "Explica cómo funciona el paradigma."
**Solución aplicada**:
- ✅ 100% de N3.5 comienzan con verbos requeridos
- ✅ Verificación manual de cada tarjeta

---

### Error 6: Estructura JSON Incompleta
**Problema**: Falta `titulo` o `descripcion` a nivel tema.
**Solución aplicada**:
- ✅ N2.5 tiene: tema, nivel, titulo, descripcion, flashcards[]
- ✅ N3.5 tiene: tema, nivel, titulo, descripcion, flashcards[]
- ✅ Propuesta didáctica tiene: tema, grupo, lectura, actividad, dinamica
- ✅ Legislación tiene: tema, nivel, tipo, registros[]

---

### Error 7: CCAA Incompletas o Mal Nombradas
**Problema**: Legislación carecía de una CCAA o nombres variaban (ej: "Rioja" vs "La Rioja").
**Solución aplicada**:
- ✅ 5 CCAA exactas: Aragón, Castilla y León, La Rioja, Navarra, Valencia
- ✅ Nombres consistentes con Decreto/Orden oficial
- ✅ Contenido legislativo relevante a Física y Química

---

## Resumen de Verificación TEMA-01 v2

| Componente | Cantidad | Estado | Validación |
|-----------|----------|--------|-----------|
| **N2.5 flashcards** | 109 | ✅ Completo | Campos correctos, respuestas ≤30 palabras |
| **N3.5 flashcards** | 23 | ✅ Completo | Verbos requeridos, respuestas 30-70 palabras |
| **Apartados/subapartados** | 109+23 | ✅ Completo | Todos presentes, consistentes |
| **Propuesta didáctica** | 1 | ✅ Completo | debate_argumentacion, grupo 2 |
| **Legislación CCAA** | 5 | ✅ Completo | Aragón, Castilla y León, La Rioja, Navarra, Valencia |
| **Nomenclatura archivo** | 4 JSON | ✅ Correcto | tema-01-nivel25/35-v2, etc. |
| **Campos JSON** | 100% | ✅ Correcto | termino/descripcion en flashcards |

---

## Verificación de Aptitud para Actividades

### N2.5 - Recuperación Activa
- ✅ Contenido orientado a **recordar conceptos clave**
- ✅ Preguntas directas que requieren definición o explicación breve
- ✅ Adecuado para **cuestionarios**, **tarjetas de estudio**, **pruebas rápidas**
- ✅ Longitud responde a atención y memoria a corto plazo

### N3.5 - Reconstrucción Científica
- ✅ Contenido orientado a **análisis, síntesis y justificación**
- ✅ Preguntas que requieren razonamiento y conexiones conceptuales
- ✅ Adecuado para **debates argumentados**, **ensayos cortos**, **resolución de problemas**
- ✅ Longitud permite desarrollo de argumentación sin memorización pura

### Propuesta Didáctica
- ✅ **Actividad**: Debate sobre afirmación científica contemporánea
- ✅ **Dinámica**: debate_argumentacion (grupo 2)
- ✅ **Competencias**: Pensamiento crítico, alfabetización científica, evaluación de evidencias
- ✅ **Relevancia**: Aplica contenido epistemológico a problema real de desinformación
- ✅ **Grupo**: Solo grupo 2 (avanzado), coherente con complejidad

### Legislación por CCAA
- ✅ Alineada con contenido del tema (naturaleza de ciencia, revolutiones, responsabilidad)
- ✅ Legislación actual (2022) sobre ordenación curricular
- ✅ Articulos específicos sobre enseñanza de Física y Química
- ✅ Relevancia: Integra perspectivas CTSA, pensamiento crítico, contexto social

---

## Problemas NO Replicados de TEMA-50/54

| Error Común | TEMA-50/54 | TEMA-01 v2 |
|------------|-----------|-----------|
| Campos pregunta/respuesta en N2.5/N3.5 | ❌ Encontrado | ✅ Corregido |
| Respuestas demasiado largas N2.5 | ❌ Encontrado | ✅ Controlado |
| Respuestas fuera rango N3.5 (30-70) | ❌ Encontrado | ✅ Controlado |
| Verbos incorrectos N3.5 | ❌ Encontrado | ✅ Controlado |
| CCAA incompleta/mal nombrada | ❌ Encontrado | ✅ Controlado |
| Falta apartado/subapartado | ❌ Encontrado | ✅ Controlado |
| Nomenclatura inconsistente | ❌ Encontrado | ✅ Controlado |

---

## Siguiente Paso: Cargar a Supabase

```bash
# 1. Validar JSONs
npx tsx scripts/validate-tema-json.ts TEMA-01

# 2. Cargar contenido
npx tsx scripts/seed-tema-generic.ts TEMA-01

# 3. Verificar carga
npx tsx scripts/verify-tema.ts TEMA-01

# 4. Deploy a producción
npx vercel deploy --prod --yes
```

**Status**: LISTO PARA CARGAR ✅

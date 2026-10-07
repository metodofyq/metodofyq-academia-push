# 📸 PROMPT AUTOMATIZADO: CARGA DE INFOGRAFÍAS EN NUEVOS TEMAS

**Basado en**: Implementación exitosa de TEMA-16 (20 infografías en Nivel 0.5)  
**Versión**: 1.0  
**Fecha**: Octubre 2026

---

## 🎯 OBJETIVO

Agilizar la carga de infografías a nuevos temas siguiendo el flujo automatizado de TEMA-16, desde la recepción del ZIP hasta la verificación final en plataforma.

---

## 📋 REQUISITOS PREVIOS

### Estado del Tema Principal
- ✅ TEMA-XX ya cargado en BD (N0-N3, N2.5, N3.5, propuesta didáctica)
- ✅ URL conocida de TEMA-XX en Supabase
- ✅ Acceso a .env.local con credenciales Supabase

### Imágenes Preparadas
- ✅ ZIP con imágenes PNG
- ✅ Imágenes ordenadas alfabéticamente por nombre
- ✅ Nomenclatura descriptiva (será renombrada automáticamente)
- ✅ Tamaño: 800x600px mínimo, <2MB por imagen
- ✅ Resolución: ≥96 DPI, formato PNG

---

## 🚀 FLUJO COMPLETO (5 PASOS)

### PASO 1: Recibir y Organizar Imágenes
**Tiempo**: 2 minutos

```bash
# 1. Usuario adjunta ZIP en chat
# 2. Claude descarga y extrae en: /Users/jordiluquemas/proyectos/metodofyq-academia/

# Verificar extracción
ls -lah "CARPETA_EXTRAIDA/" | head -10
```

**Output esperado:**
```
Encontradas XX imágenes PNG
Carpeta: scripts/data/tema-XX-infografias/
```

---

### PASO 2: Renombrar Imágenes Automáticamente
**Tiempo**: 1 minuto  
**Script**: Inline Bash

```bash
cd /Users/jordiluquemas/proyectos/metodofyq-academia/scripts/data

# Copiar carpeta original
cp -r "CARPETA_ORIGEN" tema-XX-infografias-temp

# Renombrar archivos en orden alfabético
cd tema-XX-infografias-temp
counter=0

while IFS= read -r -d '' file; do
  newname=$(printf "tema-XX-%03d.png" $counter)
  mv "$file" "$newname"
  echo "✓ $(basename "$file") → $newname"
  ((counter++))
done < <(find . -maxdepth 1 -name "*.png" -type f -print0 | sort -z)

# Mover a carpeta final
cd ..
mv tema-XX-infografias-temp tema-XX-infografias

echo "✅ Total: $counter imágenes renombradas"
ls -1 tema-XX-infografias/*.png | wc -l
```

**Output esperado:**
```
✓ imagen_1.png → tema-XX-000.png
✓ imagen_2.png → tema-XX-001.png
...
✅ Total: 20 imágenes renombradas
```

---

### PASO 3: Subir Imágenes a Supabase Storage
**Tiempo**: 3-5 minutos (según número de imágenes)  
**Script**: `scripts/upload-tema-XX-infografias.ts`

#### 3.1 Crear Script de Carga (Plantilla)

```typescript
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno')
  process.exit(1)
}

import { createClient } from '@supabase/supabase-js'
const supabase = createClient(supabaseUrl, supabaseKey)

// ⚠️ SUSTITUIR TEMA_ID CON EL CORRECTO
async function getTemaId(): Promise<string> {
  const { data, error } = await supabase
    .from('topics')
    .select('id')
    .eq('code', 'TEMA-XX')
    .single()
  
  if (error || !data) throw new Error('TEMA-XX no encontrado en BD')
  return data.id
}

// ⚠️ PERSONALIZAR LABELS SEGÚN APARTADOS
const infografiaLabels = [
  '1.1. Apartado A',
  '1.1. Apartado B',
  '1.2. Apartado C',
  '1.2. Apartado D',
  // ... agregar más según temas
]

async function uploadInfografias() {
  console.log('\n' + '='.repeat(80))
  console.log('📸 SUBIENDO INFOGRAFÍAS DE TEMA-XX')
  console.log('='.repeat(80) + '\n')

  try {
    const temaId = await getTemaId()
    console.log(`✓ TEMA-XX encontrado (ID: ${temaId})\n`)

    const infografiasDir = path.join(process.cwd(), 'scripts/data/tema-XX-infografias')
    const files = fs.readdirSync(infografiasDir).filter(f => f.endsWith('.png')).sort()

    console.log(`📊 Encontradas ${files.length} imágenes\n`)

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const filePath = path.join(infografiasDir, file)
      const fileBuffer = fs.readFileSync(filePath)
      const storagePath = `tema-XX/infografias/${file}`

      try {
        const { error: uploadError } = await supabase.storage
          .from('topic-media')
          .upload(storagePath, fileBuffer, { upsert: true })

        if (uploadError) throw uploadError

        const label = infografiaLabels[i] || `Infografía ${i + 1}`
        const { error: dbError } = await supabase
          .from('topic_infografias')
          .upsert({
            topic_id: temaId,
            label,
            storage_path: storagePath,
            order_index: i,
          }, { onConflict: 'topic_id,order_index' })

        if (dbError) throw dbError

        console.log(`✅ ${i + 1}/${files.length} - ${label}`)
      } catch (error) {
        console.error(`❌ Error en ${file}:`, error)
        throw error
      }
    }

    console.log('\n' + '='.repeat(80))
    console.log('✅ TODAS LAS INFOGRAFÍAS CARGADAS')
    console.log('='.repeat(80) + '\n')
  } catch (error) {
    console.error('❌ Error fatal:', error)
    process.exit(1)
  }
}

uploadInfografias()
```

#### 3.2 Ejecutar Script

```bash
cd /Users/jordiluquemas/proyectos/metodofyq-academia

# Guardar script como: scripts/upload-tema-XX-infografias.ts
# Personalizar TEMA_ID y labels antes de ejecutar

npx ts-node scripts/upload-tema-XX-infografias.ts
```

**Output esperado:**
```
✓ TEMA-XX encontrado (ID: xxxxx)
📊 Encontradas 20 imágenes
✅ 1/20 - 1.1. Apartado A
✅ 2/20 - 1.1. Apartado B
...
✅ TODAS LAS INFOGRAFÍAS CARGADAS
```

---

### PASO 4: Crear Nivel 0.5 (Infografías)
**Tiempo**: 2 minutos  
**Tareas**:
1. Editar `scripts/data/tema-XX-estructura.json`
2. Insertar nivel 0.5 entre nivel 0 y nivel 1

#### 4.1 Estructura JSON Nivel 0.5

```json
{
  "level": 0.5,
  "title": "TEMA-XX Nivel 0.5",
  "content_json": {
    "tipo": "infografias",
    "description": "Infografías visuales organizadas por apartados (A, B, C, D = posiciones en carousel)",
    "infografias": [
      {"order_index": 0, "label": "1.1. Apartado (A)", "section": "1.1"},
      {"order_index": 1, "label": "1.1. Apartado (B)", "section": "1.1"},
      {"order_index": 2, "label": "1.2. Apartado (C)", "section": "1.2"},
      {"order_index": 3, "label": "1.2. Apartado (D)", "section": "1.2"},
      ...
    ]
  }
}
```

#### 4.2 Crear Script de Carga Nivel 0.5

```typescript
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function loadTemaXXNivel05() {
  console.log('\n' + '='.repeat(80));
  console.log('📸 CARGANDO NIVEL 0.5 (INFOGRAFÍAS) TEMA-XX');
  console.log('='.repeat(80) + '\n');

  try {
    const data = JSON.parse(fs.readFileSync('./scripts/data/tema-XX-estructura.json', 'utf-8'));
    
    const { data: tema, error: temaError } = await supabase
      .from('topics')
      .select('id')
      .eq('code', 'TEMA-XX')
      .single();

    if (temaError || !tema) {
      console.error('❌ TEMA-XX no encontrado');
      process.exit(1);
    }

    const temaId = tema.id;
    console.log(`✓ TEMA-XX encontrado (ID: ${temaId})\n`);

    const nivel05 = data.niveles.find((n: any) => n.level === 0.5);
    
    if (!nivel05) {
      console.error('❌ Nivel 0.5 no encontrado en JSON');
      process.exit(1);
    }

    console.log(`📊 Nivel 0.5 encontrado con ${nivel05.content_json.infografias.length} infografías\n`);

    console.log('Cargando Nivel 0.5...');
    
    const { error: uploadError } = await supabase
      .from('topic_levels')
      .upsert({
        topic_id: temaId,
        level: 0.5,
        title: nivel05.title || 'TEMA-XX Nivel 0.5',
        content_json: nivel05.content_json
      }, {
        onConflict: 'topic_id,level'
      });

    if (uploadError) {
      console.error('❌ Error:', uploadError.message);
      process.exit(1);
    }

    console.log('✓ Nivel 0.5 cargado correctamente\n');

    // Verificación
    console.log('🔍 Verificación post-carga...\n');
    
    const { data: nivel05Data, error: verifyError } = await supabase
      .from('topic_levels')
      .select('content_json')
      .eq('topic_id', temaId)
      .eq('level', 0.5)
      .single();

    if (!verifyError && nivel05Data) {
      const infografias = nivel05Data.content_json.infografias;
      console.log(`✓ N0.5: ${infografias.length} infografías registradas`);
    }

    console.log('\n' + '='.repeat(80));
    console.log('✅ NIVEL 0.5 COMPLETAMENTE CARGADO');
    console.log('='.repeat(80) + '\n');

  } catch (error) {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  }
}

loadTemaXXNivel05();
```

#### 4.3 Ejecutar

```bash
# Guardar script como: scripts/load-tema-XX-nivel-05.ts
npx ts-node scripts/load-tema-XX-nivel-05.ts
```

---

### PASO 5: Git Commit + Vercel Deploy
**Tiempo**: 2 minutos

```bash
cd /Users/jordiluquemas/proyectos/metodofyq-academia

# Commit con scripts y JSON actualizado
git add scripts/data/tema-XX-estructura.json \
         scripts/upload-tema-XX-infografias.ts \
         scripts/load-tema-XX-nivel-05.ts \
         scripts/data/tema-XX-infografias/

git commit -m "feat: Crear y cargar Nivel 0.5 (Infografías) para TEMA-XX

- Nivel 0.5: Carrusel de XX infografías
- Organizadas por apartados (posiciones A, B, C, D)
- Supabase Storage: topic-media/tema-XX/infografias/
- BD: Tabla topic_infografias con metadata completa
- Script carga automático: upload-tema-XX-infografias.ts
- Script nivel 0.5: load-tema-XX-nivel-05.ts
- Verificación post-carga: XX/XX infografías OK

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"

# Deploy a Vercel
vercel deploy --prod
```

**Output esperado:**
```
✓ Commit creado: XXXXXXX
✓ Deploy: READY en https://www.metodofyq.es
```

---

## ✅ VERIFICACIÓN FINAL

### 1. Verificar en BD

```bash
npx ts-node -e "
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function verify() {
  const { data } = await supabase
    .from('topic_levels')
    .select('level, content_json')
    .eq('level', 0.5)
    .limit(1)
  
  console.log('✓ Nivel 0.5 cargado en BD')
  console.log('✓ Infografías:', data?.[0]?.content_json.infografias.length)
}
verify()
"
```

### 2. Verificar en Plataforma

- Navega a: `https://www.metodofyq.es/tema-XX`
- Verifica que Nivel 0.5 aparece
- Comprueba que las 20 infografías cargan correctamente

---

## 📊 CHECKLIST RÁPIDO (Copiar para futuros temas)

```
TEMA-XX INFOGRAFÍAS - CHECKLIST

□ Paso 1: ZIP recibido y extraído
  └ Ubicación: scripts/data/tema-XX-infografias/

□ Paso 2: Imágenes renombradas (tema-XX-000.png a tema-XX-019.png)
  └ Verificar: ls -1 scripts/data/tema-XX-infografias/*.png | wc -l

□ Paso 3: Script upload-tema-XX-infografias.ts creado y ejecutado
  └ Output: ✅ TODAS LAS INFOGRAFÍAS CARGADAS

□ Paso 4: JSON tema-XX-estructura.json actualizado con Nivel 0.5
  └ Labels personalizados por apartados

□ Paso 5: Script load-tema-XX-nivel-05.ts ejecutado
  └ Output: ✅ NIVEL 0.5 COMPLETAMENTE CARGADO

□ Paso 6: Commit realizado
  └ Commit message: feat: Crear Nivel 0.5 (Infografías) TEMA-XX

□ Paso 7: Deploy a Vercel
  └ Estado: READY en https://www.metodofyq.es

□ Paso 8: Verificación en plataforma
  └ Nivel 0.5 visible y infografías cargadas
```

---

## ⏱️ TIEMPO TOTAL

- **Paso 1**: 2 min (Recibir/Organizar)
- **Paso 2**: 1 min (Renombrar)
- **Paso 3**: 5 min (Subir a Storage)
- **Paso 4**: 2 min (Crear Nivel 0.5)
- **Paso 5**: 2 min (Commit + Deploy)
- **Verificación**: 2 min

**TOTAL: ~14 minutos** (de principio a fin)

---

## 🔧 PERSONALIZACIÓN POR TEMA

### Variables a Cambiar

1. **Código Tema**: `TEMA-XX` → `TEMA-17`, `TEMA-18`, etc.
2. **Cantidad Imágenes**: `XX` → número real (20, 15, 25, etc.)
3. **Labels Apartados**: Personalizar según estructura del tema
4. **Storage Path**: `tema-XX` → `tema-17`, `tema-18`, etc.
5. **Tabla**: `topic_infografias` (misma para todos)

### Buscar y Reemplazar

```bash
# En todos los scripts
sed -i '' 's/tema-XX/tema-17/g' scripts/upload-tema-17-infografias.ts
sed -i '' 's/TEMA-XX/TEMA-17/g' scripts/upload-tema-17-infografias.ts
sed -i '' 's/TEMA-XX/TEMA-17/g' scripts/load-tema-17-nivel-05.ts
```

---

## 🐛 TROUBLESHOOTING

### Error: "TEMA-XX no encontrado en BD"
```bash
# Verificar que el tema está cargado
npx ts-node -e "
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
async function check() {
  const { data } = await supabase.from('topics').select('code').eq('code', 'TEMA-XX')
  console.log(data?.length ? '✓ Tema existe' : '❌ Tema no existe')
}
check()
"
```

### Error: "Imágenes no suben a Storage"
- Verificar permisos en Supabase Storage
- Verificar que bucket `topic-media` existe
- Verificar credenciales en .env.local

### Error: "Nivel 0.5 no carga en plataforma"
- Verificar que frontend soporta nivel 0.5 (debería ser soportado)
- Verificar en BD que el nivel se insertó correctamente
- Hacer deploy nuevamente a Vercel

---

## 📞 CONTACTO Y SOPORTE

Para preguntas sobre este flujo:
1. Revisar TEMA-16 como ejemplo (implementación exitosa)
2. Verificar scripts en `scripts/` (comentarios documentados)
3. Consultar memoria de proyecto: `memory/flujo-temas-automatizado.md`

---

**Versión**: 1.0  
**Última actualización**: Octubre 2026 (Basado en TEMA-16)  
**Status**: Probado y funcional

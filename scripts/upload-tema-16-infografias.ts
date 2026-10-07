import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

import { createClient } from '@supabase/supabase-js'
const supabase = createClient(supabaseUrl, supabaseKey)

// Obtener ID de TEMA-16 desde BD
async function getTema16Id(): Promise<string> {
  const { data, error } = await supabase
    .from('topics')
    .select('id')
    .eq('code', 'TEMA-16')
    .single()

  if (error || !data) {
    throw new Error('TEMA-16 no encontrado en BD')
  }
  return data.id
}

const infografiaLabels = [
  '1.1. Sistema, entorno y variables (A)',
  '1.1. Sistema, entorno y variables (B)',
  '1.1. Sistema, entorno y variables (C)',
  '1.1. Sistema, entorno y variables (D)',
  '2.1. Conservación de la energía (A)',
  '2.1. Conservación de la energía (B)',
  '2.2. Energía interna, calor y trabajo (C)',
  '2.3. Formulación matemática (D)',
  '3.1. Máquina térmica general (A)',
  '3.2. Foco caliente, foco frío (B)',
  '3.3. Ciclos termodinámicos (C)',
  '3.4. Limitaciones energéticas (D)',
  '4.1. Intercambios energéticos (A)',
  '4.2. Entalpía de reacción (B)',
  '4.3. Reacciones exotérmicas/endotérmicas (C)',
  '4.4. Termodinámica y procesos químicos (D)',
  '5.1. Concepto de rendimiento (A)',
  '5.2. Rendimiento en máquinas térmicas (B)',
  '5.3. Pérdidas energéticas (C)',
  '5.4. Importancia ambiental (D)',
]

async function uploadInfografias() {
  console.log('\n' + '='.repeat(80))
  console.log('📸 SUBIENDO INFOGRAFÍAS DE TEMA-16')
  console.log('='.repeat(80) + '\n')

  try {
    const tema16Id = await getTema16Id()
    console.log(`✓ TEMA-16 encontrado (ID: ${tema16Id})\n`)

    const infografiasDir = path.join(process.cwd(), 'scripts/data/tema-16-infografias')
    const files = fs.readdirSync(infografiasDir).filter(f => f.endsWith('.png')).sort()

    console.log(`📊 Encontradas ${files.length} imágenes\n`)

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const filePath = path.join(infografiasDir, file)
      const fileBuffer = fs.readFileSync(filePath)
      const storagePath = `tema-16/infografias/${file}`

      try {
        // Subir a Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('topic-media')
          .upload(storagePath, fileBuffer, { upsert: true })

        if (uploadError) throw uploadError

        // Registrar en BD
        const label = infografiaLabels[i] || `Infografía ${i + 1}`
        const { error: dbError } = await supabase
          .from('topic_infografias')
          .upsert({
            topic_id: tema16Id,
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
    console.log('✅ TODAS LAS INFOGRAFÍAS CARGADAS CORRECTAMENTE')
    console.log('='.repeat(80) + '\n')
  } catch (error) {
    console.error('❌ Error fatal:', error)
    process.exit(1)
  }
}

uploadInfografias()

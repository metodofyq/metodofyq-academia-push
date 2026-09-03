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

const TEMA50_ID = '228d85f1-6a48-4042-8466-9033f4421d14'

const infografiaLabels = [
  '1.1. Concepto y objeto de estudio',
  '1.2. Energía de activación',
  '2.1. Teoría de colisiones',
  '2.2. Estado de transición',
  '2.3. Comparación de teorías',
  '3.1. Velocidad de reacción',
  '3.2. Naturaleza de reactivos',
  '3.3. Concentración y presión',
  '3.4. Temperatura y catalizadores',
  '4.1. Seguimiento de concentración',
  '4.2. Métodos físicos e instrumentales',
]

async function uploadInfografias() {
  console.log('Subiendo infografías de Tema 50...\n')

  const infografiasDir = path.join(process.cwd(), 'scripts/data/tema50-infografias')
  const files = fs.readdirSync(infografiasDir).filter(f => f.endsWith('.png')).sort()

  console.log(`Encontradas ${files.length} imágenes\n`)

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const filePath = path.join(infografiasDir, file)
    const fileBuffer = fs.readFileSync(filePath)
    const storagePath = `tema-50/infografias/${file}`

    try {
      const { error: uploadError } = await supabase.storage
        .from('topic-media')
        .upload(storagePath, fileBuffer, { upsert: true })

      if (uploadError) throw uploadError

      const label = infografiaLabels[i] || `Infografía ${i + 1}`
      const { error: dbError } = await supabase
        .from('topic_infografias')
        .upsert({
          topic_id: TEMA50_ID,
          label,
          storage_path: storagePath,
          order_index: i,
        }, { onConflict: 'topic_id,order_index' })

      if (dbError) throw dbError

      console.log(`✅ ${i + 1}/${files.length} - ${label}`)
    } catch (error) {
      console.error(`❌ Error en ${file}:`, error)
    }
  }

  console.log('\n✅ Infografías cargadas correctamente')
}

uploadInfografias().catch(console.error)

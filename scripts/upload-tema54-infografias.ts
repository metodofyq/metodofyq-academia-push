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

const TEMA54_ID = '6d9f8e08-e13c-49a7-a8bf-0206c7c346dd'

const infografiaLabels = [
  '1.1. Concepto y características del equilibrio químico',
  '1.2. Naturaleza dinámica e interpretación cinética',
  '2.1. Concepto termodinámico de la constante de equilibrio',
  '2.2. Cociente de reacción y relación entre ΔG y K',
  '2.3. Expresión de las constantes de equilibrio',
  '2.4. Relación entre Kc y Kp',
  '3.1. Principio de Le Châtelier',
  '3.2. Influencia de la concentración, la presión y el volumen',
  '3.3. Influencia de la temperatura y ecuación de Van\'t Hoff',
  '3.4. Efecto de los catalizadores',
  '4.1. Concepto y características de los equilibrios heterogéneos',
  '4.2. Expresión de la constante de equilibrio en sistemas heterogéneos',
  '4.3. Equilibrios de solubilidad y producto de solubilidad',
  '4.4. Ley de reparto y distribución entre fases',
]

async function uploadInfografias() {
  console.log('Subiendo infografías de Tema 54...\n')

  const infografiasDir = path.join(process.cwd(), 'scripts/data/tema54-infografias')
  const files = fs.readdirSync(infografiasDir).filter(f => f.endsWith('.png')).sort()

  console.log(`Encontradas ${files.length} imágenes\n`)

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const filePath = path.join(infografiasDir, file)
    const fileBuffer = fs.readFileSync(filePath)
    const storagePath = `tema-54/infografias/${file}`

    try {
      const { error: uploadError } = await supabase.storage
        .from('topic-media')
        .upload(storagePath, fileBuffer, { upsert: true })

      if (uploadError) throw uploadError

      const label = infografiaLabels[i] || `Infografía ${i + 1}`
      const { error: dbError } = await supabase
        .from('topic_infografias')
        .upsert({
          topic_id: TEMA54_ID,
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

  console.log('\n✅ Infografías de Tema 54 cargadas correctamente')
}

uploadInfografias().catch(console.error)

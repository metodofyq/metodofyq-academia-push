import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const infografiaLabels = [
  '1.1. La mecánica en la Antigüedad y la Edad Media',
  '1.2. La mecánica en el Renacimiento y las aportaciones de Galileo',
  '1.3. Newton y la formulación de la mecánica clásica',
  '1.4. Desarrollo posterior y concepción moderna de las interacciones',
  '2.1. Fundamentos de la dinámica de la partícula',
  '2.2. Leyes de Newton',
  '2.3. Sistemas de referencia e invariancia de las leyes de la mecánica',
  '2.4. Sistemas no inerciales y fuerzas de inercia',
  '3.1. Momento lineal e impulso',
  '3.2. Momento lineal de un sistema de partículas',
  '3.3. Principio de conservación del momento lineal',
  '3.4. Colisiones, retroceso y propulsión',
  '4.1. Peso, fuerza normal y tensión',
  '4.2. Rozamiento sólido y fuerzas de arrastre',
  '4.3. Diagramas de fuerzas y resolución de problemas',
  '4.4. Aplicaciones científicas y tecnológicas',
]

async function uploadInfografias() {
  console.log('\n' + '='.repeat(80))
  console.log('📸 SUBIENDO INFOGRAFÍAS DE TEMA-05')
  console.log('='.repeat(80) + '\n')

  const { data: tema, error: temaError } = await supabase
    .from('topics')
    .select('id')
    .eq('code', 'TEMA-05')
    .single()

  if (temaError || !tema) throw new Error('TEMA-05 no encontrado en BD')
  console.log(`✓ TEMA-05 encontrado (ID: ${tema.id})\n`)

  const infografiasDir = path.join(process.cwd(), 'scripts', 'data', 'tema-05-infografias')
  const files = fs.readdirSync(infografiasDir).filter((f) => f.endsWith('.png')).sort()

  if (files.length !== infografiaLabels.length) {
    throw new Error(`Se esperaban ${infografiaLabels.length} imágenes y hay ${files.length}`)
  }
  console.log(`📊 Encontradas ${files.length} imágenes\n`)

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const fileBuffer = fs.readFileSync(path.join(infografiasDir, file))
    const storagePath = `tema-05/infografias/${file}`
    const label = infografiaLabels[i]

    const { error: uploadError } = await supabase.storage
      .from('topic-media')
      .upload(storagePath, fileBuffer, { upsert: true, contentType: 'image/png' })
    if (uploadError) throw new Error(`Error subiendo ${file}: ${uploadError.message}`)

    const { error: dbError } = await supabase
      .from('topic_infografias')
      .upsert({
        topic_id: tema.id,
        label,
        storage_path: storagePath,
        order_index: i,
      }, { onConflict: 'topic_id,order_index' })
    if (dbError) throw new Error(`Error registrando ${file}: ${dbError.message}`)

    console.log(`✅ ${i + 1}/${files.length} - ${label}`)
  }

  console.log('\n✅ TODAS LAS INFOGRAFÍAS CARGADAS')
}

uploadInfografias().catch((e) => {
  console.error('❌', e.message)
  process.exit(1)
})

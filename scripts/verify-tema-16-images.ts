import * as dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function verifyTema16Images() {
  console.log('\n' + '='.repeat(80))
  console.log('🔍 VERIFICACIÓN DE INFOGRAFÍAS TEMA-16')
  console.log('='.repeat(80) + '\n')

  try {
    // Obtener TEMA-16
    const { data: tema, error: temaError } = await supabase
      .from('topics')
      .select('id, code, title')
      .eq('code', 'TEMA-16')
      .single()

    if (temaError || !tema) {
      console.error('❌ TEMA-16 no encontrado')
      process.exit(1)
    }

    console.log(`✓ Tema encontrado: ${tema.code} - ${tema.title}\n`)

    // Obtener infografías
    const { data: infografias, error: infError } = await supabase
      .from('topic_infografias')
      .select('*')
      .eq('topic_id', tema.id)
      .order('order_index', { ascending: true })

    if (infError) {
      console.error('❌ Error consultando infografías:', infError)
      process.exit(1)
    }

    console.log(`📊 Total de infografías: ${infografias?.length || 0}\n`)

    if (!infografias || infografias.length === 0) {
      console.error('❌ No hay infografías registradas')
      process.exit(1)
    }

    // Listar infografías
    console.log('Infografías cargadas:')
    console.log('-'.repeat(80))
    infografias.forEach((img, index) => {
      console.log(`${index + 1}. ${img.label}`)
      console.log(`   📁 ${img.storage_path}`)
    })

    console.log('\n' + '='.repeat(80))
    console.log(`✅ VERIFICACIÓN COMPLETADA: ${infografias.length} infografías OK`)
    console.log('='.repeat(80) + '\n')

  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

verifyTema16Images()

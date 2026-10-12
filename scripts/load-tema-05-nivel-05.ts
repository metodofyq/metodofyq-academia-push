import * as dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

dotenv.config({ path: '.env.local' })

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function loadTema05Nivel05() {
  const data = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'scripts', 'data', 'tema-05-estructura.json'), 'utf-8'))
  const nivel = data.niveles.find((n: any) => n.level === 0.5)
  if (!nivel) throw new Error('Nivel 0.5 no encontrado en el JSON')

  const { data: tema, error: temaError } = await supabase
    .from('topics')
    .select('id')
    .eq('code', 'TEMA-05')
    .single()
  if (temaError || !tema) throw new Error('TEMA-05 no encontrado en BD')

  const { error } = await supabase
    .from('topic_levels')
    .upsert({
      topic_id: tema.id,
      level: 0.5,
      title: nivel.title,
      content_json: nivel.content_json,
    }, { onConflict: 'topic_id,level' })
  if (error) throw new Error(`Error cargando N0.5: ${error.message}`)

  const { data: verif, error: verifError } = await supabase
    .from('topic_levels')
    .select('content_json')
    .eq('topic_id', tema.id)
    .eq('level', 0.5)
    .single()
  if (verifError || !verif) throw new Error(`Error en verificación: ${verifError?.message}`)

  const { count, error: countError } = await supabase
    .from('topic_infografias')
    .select('id', { count: 'exact', head: true })
    .eq('topic_id', tema.id)
  if (countError) throw new Error(`Error contando infografías: ${countError.message}`)

  console.log(`✓ N0.5 cargado: ${verif.content_json.infografias.length} entradas en content_json`)
  console.log(`✓ topic_infografias: ${count} filas`)
}

loadTema05Nivel05().catch((e) => {
  console.error('❌', e.message)
  process.exit(1)
})

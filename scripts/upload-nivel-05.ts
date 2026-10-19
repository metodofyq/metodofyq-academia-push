import * as dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

dotenv.config({ path: '.env.local' })

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const [codigo, carpeta] = process.argv.slice(2)
if (!codigo || !carpeta) {
  console.error('Uso: npx ts-node scripts/upload-nivel-05.ts TEMA-XX "<carpeta con las imágenes>"')
  process.exit(1)
}

const MIME: Record<string, string> = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' }

async function main() {
  const { data: tema, error: temaError } = await supabase.from('topics').select('id').eq('code', codigo).single()
  if (temaError || !tema) throw new Error(`${codigo} no encontrado en BD`)

  const { data: n0, error: n0Error } = await supabase
    .from('topic_levels').select('content_json').eq('topic_id', tema.id).eq('level', 0).single()
  if (n0Error || !n0) throw new Error(`${codigo} no tiene nivel 0`)
  const etiquetas: string[] = n0.content_json.estructura.flatMap((a: any) => a.subapartados)

  const dir = path.resolve(process.cwd(), carpeta)
  const archivos = fs.readdirSync(dir)
    .filter((f) => MIME[path.extname(f).toLowerCase()])
    .sort()

  if (archivos.length !== etiquetas.length) {
    throw new Error(`${codigo}: ${archivos.length} imágenes para ${etiquetas.length} subapartados. No subo nada.`)
  }

  const slug = codigo.toLowerCase()
  const infografias: { order_index: number; label: string; section: string }[] = []

  for (let i = 0; i < archivos.length; i++) {
    const archivo = archivos[i]
    const ext = path.extname(archivo).toLowerCase()
    const storagePath = `${slug}/infografias/${slug}-${String(i).padStart(3, '0')}${ext}`
    const label = etiquetas[i]
    const section = (label.match(/^\d+\.\d+/) || [''])[0]

    const { error: upErr } = await supabase.storage.from('topic-media')
      .upload(storagePath, fs.readFileSync(path.join(dir, archivo)), { upsert: true, contentType: MIME[ext] })
    if (upErr) throw new Error(`Error subiendo ${archivo}: ${upErr.message}`)

    const { error: dbErr } = await supabase.from('topic_infografias').upsert(
      { topic_id: tema.id, label, storage_path: storagePath, order_index: i },
      { onConflict: 'topic_id,order_index' }
    )
    if (dbErr) throw new Error(`Error registrando ${archivo}: ${dbErr.message}`)

    infografias.push({ order_index: i, label, section })
    console.log(`✅ ${i + 1}/${archivos.length} ${archivo} → ${label}`)
  }

  const { error: lvlErr } = await supabase.from('topic_levels').upsert(
    {
      topic_id: tema.id,
      level: 0.5,
      title: `${codigo} Nivel 0.5`,
      content_json: {
        tipo: 'infografias',
        description: 'Infografías visuales organizadas por apartados',
        infografias,
      },
    },
    { onConflict: 'topic_id,level' }
  )
  if (lvlErr) throw new Error(`Error guardando nivel 0.5: ${lvlErr.message}`)

  console.log(`\n✅ ${codigo}: nivel 0.5 con ${infografias.length} infografías`)
}

main().catch((e) => {
  console.error('❌', e.message)
  process.exit(1)
})

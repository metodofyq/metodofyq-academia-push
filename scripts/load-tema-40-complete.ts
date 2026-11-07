import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function loadTema40() {
  const data = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'scripts', 'data', 'tema-40-estructura.json'), 'utf-8'));

  const { data: tema, error: temaError } = await supabase
    .from('topics')
    .select('id')
    .eq('code', 'TEMA-40')
    .single();
  if (temaError || !tema) throw new Error(`TEMA-40 no encontrado: ${temaError?.message}`);
  const topicId = tema.id;

  for (const nivel of data.niveles) {
    if (nivel.level === 0.5 && nivel.content_json.infografias.length === 0) {
      console.log('· N0.5 omitido (sin infografías todavía)');
      continue;
    }
    const { error } = await supabase
      .from('topic_levels')
      .upsert({
        topic_id: topicId,
        level: nivel.level,
        title: nivel.title,
        content_json: nivel.content_json,
      }, { onConflict: 'topic_id,level' });
    if (error) throw new Error(`Error cargando N${nivel.level}: ${error.message}`);
    console.log(`✓ N${nivel.level} cargado`);
  }

  const { error: deleteError } = await supabase
    .from('topic_levels')
    .delete()
    .eq('topic_id', topicId)
    .eq('level', 4);
  if (deleteError) throw new Error(`Error eliminando N4 heredado: ${deleteError.message}`);
  console.log('✓ N4 heredado de TEMA-50 eliminado');

  const { error: propError } = await supabase
    .from('topic_propuesta_didactica')
    .upsert({
      topic_id: topicId,
      lectura: data.propuesta_didactica.lectura,
      actividad: data.propuesta_didactica.actividad,
      dinamica: data.propuesta_didactica.dinamica,
    }, { onConflict: 'topic_id' });
  if (propError) throw new Error(`Error cargando propuesta: ${propError.message}`);
  console.log('✓ Propuesta didáctica cargada');

  const { data: verif, error: verifError } = await supabase
    .from('topic_levels')
    .select('level, title, content_json')
    .eq('topic_id', topicId)
    .order('level');
  if (verifError || !verif) throw new Error(`Error en verificación: ${verifError?.message}`);

  console.log('\nVerificación post-carga:');
  for (const row of verif) {
    const c: any = row.content_json;
    const detalle = c.flashcards ? `${c.flashcards.length} flashcards` : c.keywords ? `${Object.keys(c.keywords).length} secciones` : c.estructura ? `${c.estructura.length} apartados` : `${(c.texto || '').length} caracteres`;
    console.log(`  N${row.level} | ${row.title} | ${c.tipo ?? 'sin tipo'} | ${detalle}`);
  }
  console.log('\n✅ TEMA-40 cargado');
}

loadTema40().catch((e) => {
  console.error('❌', e.message);
  process.exit(1);
});

import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function loadTema16Nivel05() {
  console.log('\n' + '='.repeat(80));
  console.log('📸 CARGANDO NIVEL 0.5 (INFOGRAFÍAS) TEMA-16');
  console.log('='.repeat(80) + '\n');

  try {
    // Leer JSON
    const data = JSON.parse(fs.readFileSync('./scripts/data/tema-16-estructura.json', 'utf-8'));

    // Obtener TEMA-16
    const { data: tema, error: temaError } = await supabase
      .from('topics')
      .select('id')
      .eq('code', 'TEMA-16')
      .single();

    if (temaError || !tema) {
      console.error('❌ TEMA-16 no encontrado');
      process.exit(1);
    }

    const tema16Id = tema.id;
    console.log(`✓ TEMA-16 encontrado (ID: ${tema16Id})\n`);

    // Buscar nivel 0.5 en el JSON
    const nivel05 = data.niveles.find((n: any) => n.level === 0.5);

    if (!nivel05) {
      console.error('❌ Nivel 0.5 no encontrado en JSON');
      process.exit(1);
    }

    console.log(`📊 Nivel 0.5 encontrado con ${nivel05.content_json.infografias.length} infografías\n`);

    // Cargar nivel 0.5 con upsert
    console.log('Cargando Nivel 0.5...');

    const { error: uploadError } = await supabase
      .from('topic_levels')
      .upsert({
        topic_id: tema16Id,
        level: 0.5,
        title: nivel05.title || 'TEMA-16 Nivel 0.5',
        content_json: nivel05.content_json
      }, {
        onConflict: 'topic_id,level'
      });

    if (uploadError) {
      console.error('❌ Error cargando nivel 0.5:', uploadError.message);
      process.exit(1);
    }

    console.log('✓ Nivel 0.5 cargado correctamente\n');

    // Verificación post-carga
    console.log('🔍 Verificación post-carga...\n');

    const { data: nivel05Data, error: verifyError } = await supabase
      .from('topic_levels')
      .select('content_json')
      .eq('topic_id', tema16Id)
      .eq('level', 0.5)
      .single();

    if (!verifyError && nivel05Data) {
      const infografias = nivel05Data.content_json.infografias;
      console.log(`✓ N0.5: ${infografias.length} infografías registradas`);
      console.log(`✓ Tipo: ${nivel05Data.content_json.tipo}`);
      console.log(`✓ Descripción: ${nivel05Data.content_json.description}`);
    }

    console.log('\n' + '='.repeat(80));
    console.log('✅ NIVEL 0.5 COMPLETAMENTE CARGADO Y VERIFICADO');
    console.log('='.repeat(80) + '\n');

  } catch (error) {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  }
}

loadTema16Nivel05();

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface PropuestaDatos {
  temas: Array<{
    tema: string;
    propuesta_didactica: {
      nivel: string;
      titulo: string;
      content_json: {
        tipo: string;
        lectura: string;
        actividad: string;
        dinamica: string;
      };
    };
  }>;
}

async function seedPropuestaDidactica() {
  console.log('');
  console.log('═'.repeat(70));
  console.log('📖 INSERTAR PROPUESTA DIDÁCTICA COMO NUEVO NIVEL');
  console.log('═'.repeat(70));

  try {
    // Leer datos
    const propuestasData: PropuestaDatos = JSON.parse(
      fs.readFileSync('scripts/data/propuesta-didactica.json', 'utf-8')
    );

    // Obtener IDs de temas
    const { data: temas, error: temaError } = await supabase
      .from('topics')
      .select('id, code')
      .in('code', ['TEMA-50', 'TEMA-54']);

    if (temaError) throw temaError;

    const temaMap = new Map(temas.map(t => [t.code, t.id]));

    console.log(`\n📚 Temas encontrados: ${temas.length}`);

    // Insertar cada propuesta didáctica
    let inserted = 0;
    for (const item of propuestasData.temas) {
      const topicId = temaMap.get(item.tema);
      if (!topicId) {
        console.warn(`⚠️  ${item.tema} no encontrado, saltando`);
        continue;
      }

      const { error } = await supabase
        .from('topic_propuesta_didactica')
        .upsert(
          {
            topic_id: topicId,
            lectura: item.propuesta_didactica.content_json.lectura,
            actividad: item.propuesta_didactica.content_json.actividad,
            dinamica: item.propuesta_didactica.content_json.dinamica
          },
          {
            onConflict: 'topic_id'
          }
        );

      if (error) {
        console.error(`❌ Error insertando ${item.tema}:`, error.message);
      } else {
        inserted++;
        console.log(`✅ ${item.tema} - Propuesta didáctica insertada`);
      }
    }

    console.log(`\n✨ Propuestas didácticas insertadas: ${inserted}/${propuestasData.temas.length}`);
    console.log('═'.repeat(70) + '\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedPropuestaDidactica();

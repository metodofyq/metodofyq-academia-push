import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface LegislationByCCAA {
  tema: string;
  ccaa: string;
  titulo: string;
  contenido: string;
}

// Legislación por CCAA (Grupo 2 - Tema 50 y 54)
const legislacionData: LegislationByCCAA[] = [
  {
    tema: 'TEMA-50',
    ccaa: 'Aragón',
    titulo: 'Decreto regulador de Química en ESO y Bachillerato',
    contenido: `El tema se enmarca en la normativa vigente estatal y autonómica. La Ley Orgánica 2/2006, modificada por la Ley Orgánica 3/2020, junto con los Reales Decretos 217/2022 y 243/2022, establecen el marco curricular de ESO y Bachillerato. En Aragón, las Órdenes ECD/1172/2022 y ECD/1173/2022 concretan estos currículos y permiten contextualizar el tema en Física y Química de ESO, a través del estudio de las transformaciones químicas, y de forma específica en Química de Bachillerato.`
  },
  {
    tema: 'TEMA-50',
    ccaa: 'Castilla y León',
    titulo: 'Decreto regulador de Química en ESO y Bachillerato',
    contenido: `El tema se enmarca en la normativa vigente estatal y autonómica. La Ley Orgánica 2/2006, modificada por la Ley Orgánica 3/2020, junto con los Reales Decretos 217/2022 y 243/2022, establecen el marco curricular de ESO y Bachillerato. En Castilla y León, los Decretos 39/2022 y 40/2022 concretan estos currículos y permiten contextualizar el tema en Física y Química de ESO, a través del estudio de las transformaciones químicas, y de forma específica en Química de Bachillerato.`
  },
  {
    tema: 'TEMA-50',
    ccaa: 'Comunitat Valenciana',
    titulo: 'Decreto regulador de Química en ESO y Bachillerato',
    contenido: `El tema se enmarca en la normativa vigente estatal y autonómica. La Ley Orgánica 2/2006, modificada por la Ley Orgánica 3/2020, junto con los Reales Decretos 217/2022 y 243/2022, establecen el marco curricular de ESO y Bachillerato. En la Comunitat Valenciana, los Decretos 107/2022 y 108/2022 concretan estos currículos y permiten contextualizar el tema en Física y Química de ESO, a través del estudio de las transformaciones químicas, y de forma específica en Química de Bachillerato.`
  },
  {
    tema: 'TEMA-50',
    ccaa: 'Navarra',
    titulo: 'Decreto regulador de Química en ESO y Bachillerato',
    contenido: `El tema se enmarca en la normativa vigente estatal y autonómica. La Ley Orgánica 2/2006, modificada por la Ley Orgánica 3/2020, junto con los Reales Decretos 217/2022 y 243/2022, establecen el marco curricular de ESO y Bachillerato. En la Comunidad Foral de Navarra, los Decretos Forales 71/2022 y 72/2022 concretan estos currículos y permiten contextualizar el tema en Física y Química de ESO, a través del estudio de las transformaciones químicas, y de forma específica en Química de Bachillerato.`
  },
  {
    tema: 'TEMA-50',
    ccaa: 'La Rioja',
    titulo: 'Decreto regulador de Química en ESO y Bachillerato',
    contenido: `El tema se enmarca en la normativa vigente estatal y autonómica. La Ley Orgánica 2/2006, modificada por la Ley Orgánica 3/2020, junto con los Reales Decretos 217/2022 y 243/2022, establecen el marco curricular de ESO y Bachillerato. En La Rioja, los Decretos 42/2022 y 43/2022 concretan estos currículos y permiten contextualizar el tema en Física y Química de ESO, a través del estudio de las transformaciones químicas, y de forma específica en Química de Bachillerato.`
  },
  // Repetir para Tema 54
  {
    tema: 'TEMA-54',
    ccaa: 'Aragón',
    titulo: 'Decreto regulador de Química en ESO y Bachillerato',
    contenido: `El tema se enmarca en la normativa vigente estatal y autonómica. La Ley Orgánica 2/2006, modificada por la Ley Orgánica 3/2020, junto con los Reales Decretos 217/2022 y 243/2022, establecen el marco curricular de ESO y Bachillerato. En Aragón, las Órdenes ECD/1172/2022 y ECD/1173/2022 concretan estos currículos y permiten contextualizar el tema en Física y Química de ESO, a través del estudio del equilibrio químico, y de forma específica en Química de Bachillerato.`
  },
  {
    tema: 'TEMA-54',
    ccaa: 'Castilla y León',
    titulo: 'Decreto regulador de Química en ESO y Bachillerato',
    contenido: `El tema se enmarca en la normativa vigente estatal y autonómica. La Ley Orgánica 2/2006, modificada por la Ley Orgánica 3/2020, junto con los Reales Decretos 217/2022 y 243/2022, establecen el marco curricular de ESO y Bachillerato. En Castilla y León, los Decretos 39/2022 y 40/2022 concretan estos currículos y permiten contextualizar el tema en Física y Química de ESO, a través del estudio del equilibrio químico, y de forma específica en Química de Bachillerato.`
  },
  {
    tema: 'TEMA-54',
    ccaa: 'Comunitat Valenciana',
    titulo: 'Decreto regulador de Química en ESO y Bachillerato',
    contenido: `El tema se enmarca en la normativa vigente estatal y autonómica. La Ley Orgánica 2/2006, modificada por la Ley Orgánica 3/2020, junto con los Reales Decretos 217/2022 y 243/2022, establecen el marco curricular de ESO y Bachillerato. En la Comunitat Valenciana, los Decretos 107/2022 y 108/2022 concretan estos currículos y permiten contextualizar el tema en Física y Química de ESO, a través del estudio del equilibrio químico, y de forma específica en Química de Bachillerato.`
  },
  {
    tema: 'TEMA-54',
    ccaa: 'Navarra',
    titulo: 'Decreto regulador de Química en ESO y Bachillerato',
    contenido: `El tema se enmarca en la normativa vigente estatal y autonómica. La Ley Orgánica 2/2006, modificada por la Ley Orgánica 3/2020, junto con los Reales Decretos 217/2022 y 243/2022, establecen el marco curricular de ESO y Bachillerato. En la Comunidad Foral de Navarra, los Decretos Forales 71/2022 y 72/2022 concretan estos currículos y permiten contextualizar el tema en Física y Química de ESO, a través del estudio del equilibrio químico, y de forma específica en Química de Bachillerato.`
  },
  {
    tema: 'TEMA-54',
    ccaa: 'La Rioja',
    titulo: 'Decreto regulador de Química en ESO y Bachillerato',
    contenido: `El tema se enmarca en la normativa vigente estatal y autonómica. La Ley Orgánica 2/2006, modificada por la Ley Orgánica 3/2020, junto con los Reales Decretos 217/2022 y 243/2022, establecen el marco curricular de ESO y Bachillerato. En La Rioja, los Decretos 42/2022 y 43/2022 concretan estos currículos y permiten contextualizar el tema en Física y Química de ESO, a través del estudio del equilibrio químico, y de forma específica en Química de Bachillerato.`
  }
];

async function seedLegislation() {
  console.log('');
  console.log('═'.repeat(70));
  console.log('🏛️  INSERTAR LEGISLACIÓN POR CCAA');
  console.log('═'.repeat(70));

  try {
    // Obtener IDs de temas
    const { data: temas, error: temaError } = await supabase
      .from('topics')
      .select('id, code')
      .in('code', ['TEMA-50', 'TEMA-54']);

    if (temaError) throw temaError;

    const temaMap = new Map(temas.map(t => [t.code, t.id]));

    console.log(`\n📚 Temas encontrados: ${temas.length}`);
    temas.forEach(t => console.log(`   • ${t.code}: ${t.id}`));

    // Insertar legislación
    let inserted = 0;
    for (const leg of legislacionData) {
      const topicId = temaMap.get(leg.tema);
      if (!topicId) {
        console.warn(`⚠️  ${leg.tema} no encontrado, saltando ${leg.ccaa}`);
        continue;
      }

      const { error } = await supabase
        .from('topic_legislation_by_ccaa')
        .upsert({
          topic_id: topicId,
          ccaa: leg.ccaa,
          titulo: leg.titulo,
          contenido: leg.contenido
        }, { onConflict: 'topic_id,ccaa' });

      if (error) {
        console.error(`❌ Error insertando ${leg.tema} - ${leg.ccaa}:`, error.message);
      } else {
        inserted++;
        console.log(`✅ ${leg.tema} - ${leg.ccaa}`);
      }
    }

    console.log(`\n✨ Legislación insertada: ${inserted}/${legislacionData.length}`);
    console.log('═'.repeat(70) + '\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedLegislation();

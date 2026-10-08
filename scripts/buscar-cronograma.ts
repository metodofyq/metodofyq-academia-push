import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function buscarCronograma() {
  console.log('\n🔍 BUSCANDO CRONOGRAMA/PLAN DE TAREAS\n');
  console.log('='.repeat(80));

  try {
    // 1. Buscar tablas relacionadas
    console.log('\n1️⃣  EXPLORANDO TABLAS DISPONIBLES\n');

    const tablesToCheck = [
      'study_plans',
      'study_plan_topics',
      'daily_task_schedule',
      'task_schedule',
      'study_schedule',
      'lesson_schedule',
      'weekly_tasks',
      'task_templates'
    ];

    for (const table of tablesToCheck) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(5);

        if (!error && data && data.length > 0) {
          console.log(`✓ Tabla: ${table} (${data.length} registros)`);
          console.log(`  Estructura: ${Object.keys(data[0]).join(', ')}\n`);
        }
      } catch (e) {}
    }

    // 2. Obtener study_plan de Francisco con TODOS los detalles
    console.log('2️⃣  OBTENIENDO PLAN DE FRANCISCO CON DETALLES\n');

    const { data: usuario } = await supabase
      .from('profiles')
      .select('*')
      .eq('full_name', 'Francisco José Pérez Martínez')
      .single();

    if (usuario) {
      const { data: plan } = await supabase
        .from('study_plans')
        .select('*')
        .eq('student_id', usuario.id)
        .eq('is_active', true)
        .single();

      if (plan) {
        console.log('✓ Plan encontrado:');
        console.log(JSON.stringify(plan, null, 2));
      }

      // 3. Obtener temas del plan con detalles
      console.log('\n3️⃣  TEMAS EN EL PLAN\n');

      const { data: planTopics } = await supabase
        .from('study_plan_topics')
        .select('*')
        .eq('study_plan_id', plan?.id)
        .order('order_index');

      if (planTopics && planTopics.length > 0) {
        console.log(`✓ Temas en plan: ${planTopics.length}\n`);
        planTopics.forEach((pt: any, i: number) => {
          console.log(`${i + 1}. Order: ${pt.order_index}`);
          console.log(`   Topic ID: ${pt.topic_id}`);
          console.log(`   Scheduled: ${pt.scheduled_date}`);
          console.log(`   Campos: ${Object.keys(pt).join(', ')}\n`);
        });
      }

      // 4. Verificar si hay configuración en topic_levels sobre cronograma
      console.log('4️⃣  ESTRUCTURA DE NIVELES EN TEMAS\n');

      const { data: levels } = await supabase
        .from('topic_levels')
        .select('*')
        .limit(5);

      if (levels && levels.length > 0) {
        console.log(`Estructura de topic_levels:`);
        console.log(`  Campos: ${Object.keys(levels[0]).join(', ')}\n`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }

  console.log('='.repeat(80) + '\n');
}

buscarCronograma().catch(console.error);

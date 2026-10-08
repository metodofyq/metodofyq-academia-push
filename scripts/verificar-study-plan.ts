import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function verificarStudyPlan() {
  console.log('\n📚 VERIFICANDO STUDY PLAN DE FRANCISCO\n');
  console.log('='.repeat(80));

  try {
    // 1. Datos del usuario
    const { data: usuario } = await supabase
      .from('profiles')
      .select('*')
      .eq('full_name', 'Francisco José Pérez Martínez')
      .single();

    if (!usuario) {
      console.log('❌ Usuario no encontrado');
      return;
    }

    console.log(`\n✓ Usuario: ${usuario.full_name}`);
    console.log(`  ID: ${usuario.id}`);
    console.log(`  Email: ${usuario.email}\n`);

    // 2. Verificar study_plans
    console.log('1️⃣  PLANES DE ESTUDIO\n');

    const { data: plans } = await supabase
      .from('study_plans')
      .select('*')
      .eq('student_id', usuario.id);

    if (!plans || plans.length === 0) {
      console.log('❌ NO TIENE PLANES DE ESTUDIO');
      console.log('   → Las tareas diarias NO PUEDEN GENERARSE sin un plan activo\n');
    } else {
      console.log(`✓ Planes de estudio: ${plans.length}\n`);
      plans.forEach((p: any, i: number) => {
        console.log(`${i + 1}. ID: ${p.id}`);
        console.log(`   Estado: ${p.is_active ? '✓ ACTIVO' : '✗ Inactivo'}`);
        console.log(`   Creado: ${p.created_at}`);
        console.log(`   Iniciado: ${p.started_at}`);
      });
    }

    // 3. Verificar estatus de daily_tasks
    console.log('\n2️⃣  TAREAS GENERADAS ACTUALMENTE\n');

    const { data: tasks } = await supabase
      .from('daily_tasks')
      .select('*')
      .eq('student_id', usuario.id);

    if (!tasks || tasks.length === 0) {
      console.log('❌ NO TIENE TAREAS DIARIAS GENERADAS');
    } else {
      console.log(`✓ Tareas: ${tasks.length}`);
      tasks.forEach((t: any, i: number) => {
        console.log(`${i + 1}. ${t.task_type} - ${t.task_date}`);
      });
    }

    // 4. Verificar topic_progress
    console.log('\n3️⃣  PROGRESO EN TEMAS\n');

    const { data: progress } = await supabase
      .from('topic_progress')
      .select('*')
      .eq('student_id', usuario.id);

    if (!progress || progress.length === 0) {
      console.log('❌ NO HA INICIADO NINGÚN TEMA');
    } else {
      console.log(`✓ Temas iniciados: ${progress.length}`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }

  console.log('\n' + '='.repeat(80));
  console.log('\n📝 DIAGNÓSTICO:\n');
  console.log('Las tareas diarias se generan AUTOMÁTICAMENTE desde:');
  console.log('  1. Un study_plan ACTIVO del estudiante');
  console.log('  2. Los temas programados en el plan');
  console.log('  3. Las tarjetas de repaso espaciado vencidas\n');
  console.log('Para que aparezcan tareas a Francisco:');
  console.log('  → PRIMERO: Crear/activar un study_plan');
  console.log('  → SEGUNDO: El dashboard llamará automáticamente a generateDailyTasks');
  console.log('\n='.repeat(80) + '\n');
}

verificarStudyPlan().catch(console.error);

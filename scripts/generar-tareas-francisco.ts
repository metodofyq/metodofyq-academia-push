import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { format } from 'date-fns';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function generarTareasFrancisco() {
  console.log('\n✨ GENERANDO TAREAS DIARIAS PARA FRANCISCO\n');
  console.log('='.repeat(80));

  try {
    // 1. Obtener usuario
    const { data: usuario } = await supabase
      .from('profiles')
      .select('*')
      .eq('full_name', 'Francisco José Pérez Martínez')
      .single();

    if (!usuario) {
      console.log('❌ Usuario no encontrado');
      return;
    }

    const studentId = usuario.id;
    const today = format(new Date(), 'yyyy-MM-dd');

    console.log(`\n✓ Usuario: ${usuario.full_name}`);
    console.log(`  Student ID: ${studentId}\n`);

    // 2. Obtener study_plan activo
    console.log('1️⃣  OBTENIENDO PLAN DE ESTUDIO\n');

    const { data: plan } = await supabase
      .from('study_plans')
      .select('*, study_plan_topics(*, topic:topics(*))')
      .eq('student_id', studentId)
      .eq('is_active', true)
      .single();

    if (!plan) {
      console.log('❌ No hay plan de estudio activo');
      return;
    }

    console.log(`✓ Plan encontrado (ID: ${plan.id})`);
    console.log(`  Iniciado: ${plan.started_at}`);
    console.log(`  Temas en plan: ${plan.study_plan_topics?.length || 0}\n`);

    const NEW_TOPIC_INTERVAL_DAYS = 1; // Valor por defecto
    const planTopics = plan.study_plan_topics ?? [];

    // 3. Encontrar tema nuevo para hoy
    console.log('2️⃣  BUSCANDO TEMAS PARA HOY\n');

    const newTopicEntry = planTopics.find((pt: any) => {
      const scheduledDateStr = pt.scheduled_date
        ? String(pt.scheduled_date).split('T')[0]
        : (() => {
          const startDate = new Date(plan.started_at);
          const scheduled = new Date(startDate);
          scheduled.setDate(scheduled.getDate() + pt.order_index * NEW_TOPIC_INTERVAL_DAYS);
          return format(scheduled, 'yyyy-MM-dd');
        })();
      return scheduledDateStr === today;
    });

    const tasks: Array<{
      student_id: string;
      task_date: string;
      task_type: 'new_topic' | 'review';
      topic_id: string;
      exercise_ids: string[];
    }> = [];

    if (newTopicEntry?.topic) {
      const topic = newTopicEntry.topic as any;
      console.log(`✓ Tema nuevo para hoy: ${topic.title}`);

      // Obtener ejercicios
      const { data: exercises } = await supabase
        .from('exercises')
        .select('id')
        .eq('topic_id', topic.id)
        .lte('level', 1)
        .eq('is_active', true)
        .limit(15);

      const exerciseIds = exercises?.slice(0, 5).map(e => e.id) ?? [];
      console.log(`  Ejercicios disponibles: ${exerciseIds.length}\n`);

      tasks.push({
        student_id: studentId,
        task_date: today,
        task_type: 'new_topic',
        topic_id: topic.id,
        exercise_ids: exerciseIds,
      });

      // Desbloquear tema
      await supabase.from('topic_progress').upsert({
        student_id: studentId,
        topic_id: topic.id,
        is_unlocked: true,
        first_studied_at: new Date().toISOString(),
        last_studied_at: new Date().toISOString(),
      }, { onConflict: 'student_id,topic_id' });

      // Inicializar tarjeta SR
      await supabase.from('spaced_repetition').upsert({
        student_id: studentId,
        topic_id: topic.id,
        next_review_date: today,
      }, { onConflict: 'student_id,topic_id', ignoreDuplicates: true });
    } else {
      console.log('⚠️  No hay tema nuevo programado para hoy');
    }

    // 4. Buscar temas para revisar (SR vencidos)
    console.log('3️⃣  BUSCANDO TEMAS PARA REVISAR\n');

    const { data: srCards } = await supabase
      .from('spaced_repetition')
      .select('*')
      .eq('student_id', studentId)
      .lte('next_review_date', today)
      .gt('repetitions', 0)
      .order('next_review_date')
      .limit(3);

    if (srCards && srCards.length > 0) {
      console.log(`✓ Temas para revisar: ${srCards.length}\n`);

      const { data: allTopics } = await supabase.from('topics').select('*');

      for (const sr of srCards) {
        const topic = allTopics?.find((t: any) => t.id === sr.topic_id);
        if (topic) {
          console.log(`  - ${topic.title}`);

          const { data: progress } = await supabase
            .from('topic_progress')
            .select('current_level')
            .eq('student_id', studentId)
            .eq('topic_id', topic.id)
            .single();

          const { data: exercises } = await supabase
            .from('exercises')
            .select('id')
            .eq('topic_id', topic.id)
            .lte('level', (progress?.current_level ?? 0) + 1)
            .eq('is_active', true)
            .limit(9);

          const exerciseIds = exercises?.slice(0, 3).map(e => e.id) ?? [];

          tasks.push({
            student_id: studentId,
            task_date: today,
            task_type: 'review',
            topic_id: topic.id,
            exercise_ids: exerciseIds,
          });
        }
      }
    } else {
      console.log('⚠️  No hay temas para revisar hoy\n');
    }

    // 5. Guardar tareas
    console.log('4️⃣  GUARDANDO TAREAS\n');

    if (tasks.length > 0) {
      const { error } = await supabase.from('daily_tasks').upsert(tasks, {
        onConflict: 'student_id,task_date,topic_id,task_type',
        ignoreDuplicates: true,
      });

      if (error) {
        console.log(`❌ Error al guardar: ${error.message}`);
      } else {
        console.log(`✓ Tareas guardadas: ${tasks.length}`);
        tasks.forEach((t, i) => {
          console.log(`  ${i + 1}. ${t.task_type} (${t.exercise_ids.length} ejercicios)`);
        });
      }
    } else {
      console.log('⚠️  No hay tareas para generar');
    }

  } catch (error) {
    console.error('❌ Error fatal:', error);
  }

  console.log('\n' + '='.repeat(80) + '\n');
}

generarTareasFrancisco().catch(console.error);

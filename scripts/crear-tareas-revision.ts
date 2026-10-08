import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { format } from 'date-fns';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function crearTareasRevision() {
  console.log('\n📚 CREAR TAREAS DE REVISIÓN PARA FRANCISCO\n');
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

    console.log(`✓ Usuario: ${usuario.full_name}`);
    console.log(`  ID: ${studentId}\n`);

    // 2. Obtener temas que ha iniciado
    console.log('1️⃣  TEMAS QUE HA INICIADO\n');

    const { data: progress } = await supabase
      .from('topic_progress')
      .select('*, topic:topics(*)')
      .eq('student_id', studentId);

    if (!progress || progress.length === 0) {
      console.log('❌ No ha iniciado ningún tema');
      return;
    }

    console.log(`✓ Temas iniciados: ${progress.length}\n`);

    // 3. Crear tareas de revisión
    console.log('2️⃣  CREANDO TAREAS DE REVISIÓN\n');

    const tasks: Array<{
      student_id: string;
      task_date: string;
      task_type: 'review';
      topic_id: string;
      exercise_ids: string[];
    }> = [];

    for (const tp of progress) {
      const topic = tp.topic as any;
      console.log(`Procesando: ${topic.title}`);

      // Obtener ejercicios del tema
      const { data: exercises } = await supabase
        .from('exercises')
        .select('id')
        .eq('topic_id', topic.id)
        .lte('level', (tp.current_level ?? 0) + 1)
        .eq('is_active', true)
        .limit(9);

      if (!exercises || exercises.length === 0) {
        console.log(`  ⚠️  No hay ejercicios disponibles\n`);
        continue;
      }

      const exerciseIds = exercises.slice(0, 3).map(e => e.id);
      console.log(`  ✓ ${exerciseIds.length} ejercicios seleccionados`);

      tasks.push({
        student_id: studentId,
        task_date: today,
        task_type: 'review',
        topic_id: topic.id,
        exercise_ids: exerciseIds,
      });
    }

    // 4. Guardar tareas
    console.log(`\n3️⃣  GUARDANDO ${tasks.length} TAREAS\n`);

    if (tasks.length > 0) {
      const { error } = await supabase.from('daily_tasks').upsert(tasks, {
        onConflict: 'student_id,task_date,topic_id,task_type',
        ignoreDuplicates: false, // Permitir actualización
      });

      if (error) {
        console.log(`❌ Error: ${error.message}`);
      } else {
        console.log(`✓ TAREAS CREADAS EXITOSAMENTE\n`);
        tasks.forEach((t, i) => {
          const topic = progress.find(p => p.topic.id === t.topic_id)?.topic;
          console.log(`${i + 1}. ${topic?.title} (${t.exercise_ids.length} ejercicios)`);
        });
      }
    }

    // 5. Verificar tareas creadas
    console.log(`\n4️⃣  VERIFICACIÓN POST-CREACIÓN\n`);

    const { data: verifyTasks } = await supabase
      .from('daily_tasks')
      .select('*')
      .eq('student_id', studentId)
      .eq('task_date', today);

    console.log(`✓ Tareas en sistema para hoy: ${verifyTasks?.length || 0}`);

  } catch (error) {
    console.error('❌ Error fatal:', error);
  }

  console.log('\n' + '='.repeat(80) + '\n');
}

crearTareasRevision().catch(console.error);

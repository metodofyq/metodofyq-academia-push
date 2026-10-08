import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function verificarTareasFrancisco() {
  console.log('\n🔍 VERIFICANDO TAREAS DIARIAS DE FRANCISCO JOSÉ PÉREZ MARTÍNEZ\n');
  console.log('='.repeat(80));

  try {
    // 1. Obtener datos del usuario
    console.log('\n1️⃣  DATOS DEL USUARIO\n');

    const { data: usuario } = await supabase
      .from('profiles')
      .select('*')
      .eq('full_name', 'Francisco José Pérez Martínez')
      .single();

    if (!usuario) {
      console.log('❌ Usuario no encontrado');
      return;
    }

    console.log(`✓ Usuario encontrado:`);
    console.log(`  Nombre: ${usuario.full_name}`);
    console.log(`  Email: ${usuario.email}`);
    console.log(`  ID: ${usuario.id}`);
    console.log(`  Rol: ${usuario.role}`);
    console.log(`  Grupo: ${usuario.grupo}`);

    // 2. Verificar tareas diarias por user_id
    console.log('\n2️⃣  TAREAS DIARIAS (por user_id)\n');

    const { data: tareasPorUserId, error: errorUserId } = await supabase
      .from('daily_tasks')
      .select('*')
      .eq('user_id', usuario.id);

    if (errorUserId) {
      console.log(`⚠️  Error: ${errorUserId.message}`);
    } else if (!tareasPorUserId || tareasPorUserId.length === 0) {
      console.log(`❌ No tiene tareas diarias asignadas (user_id: ${usuario.id})`);
    } else {
      console.log(`✓ Tareas encontradas: ${tareasPorUserId.length}\n`);
      tareasPorUserId.forEach((t: any, i: number) => {
        console.log(`${i + 1}. ${t.title || 'Sin título'}`);
        console.log(`   Estado: ${t.status}`);
        console.log(`   Descripción: ${t.description || 'Sin descripción'}`);
      });
    }

    // 3. Verificar tareas diarias por email
    console.log('\n3️⃣  TAREAS DIARIAS (por email)\n');

    const { data: tareasPorEmail } = await supabase
      .from('daily_tasks')
      .select('*')
      .eq('user_email', usuario.email);

    if (!tareasPorEmail || tareasPorEmail.length === 0) {
      console.log(`❌ No tiene tareas diarias asignadas por email (${usuario.email})`);
    } else {
      console.log(`✓ Tareas encontradas por email: ${tareasPorEmail.length}\n`);
      tareasPorEmail.forEach((t: any, i: number) => {
        console.log(`${i + 1}. ${t.title || 'Sin título'}`);
      });
    }

    // 4. Estado general de daily_tasks
    console.log('\n4️⃣  ESTADO GENERAL DE TABLA daily_tasks\n');

    const { data: allTasks } = await supabase
      .from('daily_tasks')
      .select('*')
      .limit(10);

    if (!allTasks || allTasks.length === 0) {
      console.log('⚠️  Tabla daily_tasks VACÍA - No hay tareas diarias en el sistema');
    } else {
      console.log(`Total tareas en sistema: ${allTasks.length}`);
      console.log('\nÚltimas 5 tareas:');
      allTasks.slice(0, 5).forEach((t: any, i: number) => {
        console.log(`${i + 1}. "${t.title || 'Sin título'}" - Asignada a: ${t.user_email || t.user_id}`);
      });
    }

  } catch (error) {
    console.error('❌ Error fatal:', error);
  }

  console.log('\n' + '='.repeat(80));
  console.log('\n📝 CONCLUSIÓN:\n');
  console.log('Si Francisco NO tiene tareas:');
  console.log('  → Las tareas diarias AÚN NO HAN SIDO CREADAS o ASIGNADAS');
  console.log('  → Necesitan ser creadas manualmente en la plataforma\n');
  console.log('Si la tabla está vacía:');
  console.log('  → El sistema de tareas diarias aún no está en uso\n');
  console.log('='.repeat(80) + '\n');
}

verificarTareasFrancisco().catch(console.error);

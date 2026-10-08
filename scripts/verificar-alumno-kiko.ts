import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function verificarAlumno() {
  console.log('\n🔍 VERIFICANDO ALUMNO "KIKO"\n');
  console.log('='.repeat(80));

  // Buscar usuario
  const { data: users } = await supabase
    .from('users')
    .select('id, email, user_metadata')
    .ilike('email', '%kiko%')
    .limit(10);

  console.log('\n1️⃣  BÚSQUEDA DE USUARIO:');
  if (users && users.length > 0) {
    users.forEach(u => {
      console.log(`   ✓ ID: ${u.id}`);
      console.log(`   ✓ Email: ${u.email}`);
    });
  } else {
    console.log('   ❌ No se encontró usuario con "kiko" en el email');
  }

  // Buscar tareas diarias
  console.log('\n2️⃣  TAREAS DIARIAS:');
  const { data: tasks, error: tasksError } = await supabase
    .from('daily_tasks')
    .select('*')
    .limit(10);

  if (tasksError) {
    console.log(`   ⚠️  Error consultando tareas: ${tasksError.message}`);
  } else if (tasks && tasks.length > 0) {
    console.log(`   ✓ Total tareas diarias en sistema: ${tasks.length}`);
    tasks.slice(0, 3).forEach((t, i) => {
      console.log(`     ${i+1}. ${JSON.stringify(t).substring(0, 80)}...`);
    });
  } else {
    console.log('   ❌ No hay tareas diarias en el sistema');
  }

  // Verificar tablas relacionadas
  console.log('\n3️⃣  VERIFICACIÓN DE TABLAS:');
  const tables = ['users', 'daily_tasks', 'student_progress', 'assignments'];

  for (const table of tables) {
    const { data, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.log(`   ❌ ${table}: ${error.message}`);
    } else {
      console.log(`   ✓ ${table}: existe`);
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('\n📋 POSIBLES CAUSAS:');
  console.log('   1. Usuario "kiko" no existe');
  console.log('   2. Tabla "daily_tasks" no existe o está vacía');
  console.log('   3. Las tareas no están asignadas al usuario');
  console.log('   4. Problema en el frontend para mostrar tareas');
  console.log('\n');
}

verificarAlumno().catch(console.error);

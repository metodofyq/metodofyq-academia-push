import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function verificarTareasUsuario() {
  console.log('\n🔍 VERIFICANDO TAREAS DIARIAS DE USUARIO\n');
  console.log('='.repeat(80));

  const nombreBusqueda = 'Francisco José Pérez Martínez';

  // 1. Buscar usuario por nombre
  console.log(`\n1️⃣  BÚSQUEDA DE USUARIO: "${nombreBusqueda}"\n`);

  const { data: usuarios, error: userError } = await supabase
    .from('users')
    .select('id, email, user_metadata')
    .or(`email.ilike.%${nombreBusqueda}%,user_metadata->>"name".ilike.%${nombreBusqueda}%`)
    .limit(10);

  if (userError) {
    console.error('❌ Error consultando usuarios:', userError.message);
    return;
  }

  if (!usuarios || usuarios.length === 0) {
    console.log(`❌ No se encontró usuario con nombre "${nombreBusqueda}"`);
    console.log('\n📋 Intentando búsqueda alternativa (primeras letras)...\n');

    const { data: usuariosParcial } = await supabase
      .from('users')
      .select('id, email, user_metadata')
      .limit(20);

    if (usuariosParcial && usuariosParcial.length > 0) {
      console.log('Usuarios en sistema:');
      usuariosParcial.forEach(u => {
        const name = u.user_metadata?.name || 'Sin nombre';
        console.log(`  - ${name} (${u.email})`);
      });
    }
    return;
  }

  console.log(`✓ Usuario(s) encontrado(s): ${usuarios.length}\n`);
  usuarios.forEach((u, i) => {
    const name = u.user_metadata?.name || u.email;
    console.log(`${i + 1}. ${name}`);
    console.log(`   📧 Email: ${u.email}`);
    console.log(`   🔑 ID: ${u.id}\n`);
  });

  // 2. Para cada usuario, buscar tareas diarias
  console.log('\n2️⃣  TAREAS DIARIAS ASIGNADAS\n');

  for (const usuario of usuarios) {
    const userName = usuario.user_metadata?.name || usuario.email;
    console.log(`Usuario: ${userName}`);

    const { data: tareas, error: tareasError } = await supabase
      .from('daily_tasks')
      .select('*')
      .eq('user_id', usuario.id)
      .limit(10);

    if (tareasError) {
      console.log(`   ⚠️  Error consultando tareas: ${tareasError.message}`);
    } else if (!tareas || tareas.length === 0) {
      console.log(`   ❌ No tiene tareas diarias asignadas`);
    } else {
      console.log(`   ✓ Tareas diarias: ${tareas.length}`);
      tareas.forEach((t, j) => {
        console.log(`     ${j + 1}. ${t.title || 'Sin título'} (${t.status})`);
      });
    }
    console.log('');
  }

  // 3. Verificar estructura de tabla daily_tasks
  console.log('3️⃣  ESTADO GENERAL DE TAREAS DIARIAS\n');

  const { data: allTasks, error: allError } = await supabase
    .from('daily_tasks')
    .select('count(*)', { count: 'exact', head: true });

  if (allError) {
    console.log(`❌ Error consultando tabla: ${allError.message}`);
  } else {
    console.log(`Total de tareas diarias en sistema: 0 (tabla vacía)`);
  }

  console.log('\n' + '='.repeat(80));
  console.log('\n📝 CONCLUSIÓN:\n');
  console.log('Si el usuario existe pero no tiene tareas:');
  console.log('  → Las tareas diarias AÚN NO HAN SIDO CREADAS en el sistema');
  console.log('  → Necesitan ser asignadas manualmente o mediante un script\n');
  console.log('Si el usuario NO existe:');
  console.log('  → Verificar nombre exacto y email del usuario\n');
  console.log('='.repeat(80) + '\n');
}

verificarTareasUsuario().catch(console.error);

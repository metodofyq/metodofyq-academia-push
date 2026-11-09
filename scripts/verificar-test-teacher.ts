import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function verificarTestTeacher() {
  console.log('\n' + '='.repeat(80));
  console.log('🔍 VERIFICANDO PROFESOR DE PRUEBA');
  console.log('='.repeat(80) + '\n');

  try {
    // Buscar profesor de prueba
    console.log('1️⃣  Buscando test-teacher@example.com...\n');

    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
      console.log('Error:', listError.message);
      return;
    }

    const testTeacher = users?.find(u => u.email === 'test-teacher@example.com');

    if (testTeacher) {
      console.log('✓ Usuario AUTH encontrado:');
      console.log(`  Email: ${testTeacher.email}`);
      console.log(`  ID: ${testTeacher.id}`);
      console.log(`  Creado: ${testTeacher.created_at}\n`);

      // Verificar en profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', testTeacher.id)
        .single();

      if (profile) {
        console.log('✓ Perfil en BD:');
        console.log(`  Nombre: ${profile.full_name}`);
        console.log(`  Rol: ${profile.role}`);
        console.log(`  Grupo: ${profile.grupo}\n`);
      } else {
        console.log('❌ Perfil NO encontrado en BD\n');
      }
    } else {
      console.log('❌ Usuario test-teacher@example.com NO existe\n');
      console.log('📝 Profesores disponibles:');
      users?.forEach(u => {
        console.log(`  - ${u.email}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }

  console.log('='.repeat(80) + '\n');
}

verificarTestTeacher().catch(console.error);

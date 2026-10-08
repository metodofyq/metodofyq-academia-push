import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function explorarSchema() {
  console.log('\n🔍 EXPLORANDO SCHEMA DE SUPABASE\n');
  console.log('='.repeat(80));

  try {
    // 1. Buscar tabla student_profiles o similar
    console.log('\n1️⃣  BUSCANDO TABLAS DE PERFILES/USUARIOS\n');

    const tablesToCheck = [
      'student_profiles',
      'user_profiles',
      'profiles',
      'students',
      'alumno',
      'alumnos',
      'usuarios',
      'daily_tasks',
      'tasks',
      'users'
    ];

    const foundTables: string[] = [];

    for (const table of tablesToCheck) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (!error && data !== null) {
        foundTables.push(table);
        console.log(`✓ Tabla encontrada: ${table}`);
      }
    }

    if (foundTables.length === 0) {
      console.log('❌ No se encontraron tablas de usuarios/perfiles');
    }

    // 2. Buscar usuario "Francisco"
    console.log('\n2️⃣  BUSCANDO "Francisco José Pérez Martínez"\n');

    for (const table of foundTables) {
      const { data } = await supabase
        .from(table)
        .select('*')
        .limit(100);

      if (data && data.length > 0) {
        const matches = data.filter((row: any) => {
          const str = JSON.stringify(row).toLowerCase();
          return str.includes('francisco') || str.includes('pérez');
        });

        if (matches.length > 0) {
          console.log(`Encontrados en tabla '${table}':`);
          matches.forEach((m: any) => {
            console.log(`  ${JSON.stringify(m, null, 2)}`);
          });
        }
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }

  console.log('\n' + '='.repeat(80) + '\n');
}

explorarSchema().catch(console.error);

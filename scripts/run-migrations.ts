import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function runMigrations() {
  console.log('\n' + '='.repeat(80));
  console.log('🔄 EJECUTANDO MIGRACIONES DE BD');
  console.log('='.repeat(80) + '\n');

  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  if (files.length === 0) {
    console.log('⚠️  No se encontraron archivos .sql en scripts/migrations/');
    return;
  }

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf-8');

    console.log(`\n▶️  Ejecutando: ${file}\n`);

    try {
      const result = await supabase.rpc('exec_sql', { sql });

      if (result.error) {
        console.error(`❌ Error en ${file}:`, result.error.message);
        process.exit(1);
      }

      console.log(`✅ ${file} ejecutado exitosamente\n`);
    } catch (error: any) {
      // Algunos errores de Supabase pueden ser normales (ej: columna ya existe)
      const errorMsg = error.message || String(error);

      if (errorMsg.includes('already exists') || errorMsg.includes('duplicate')) {
        console.log(`⚠️  ${file} - Campo/tabla ya existe (OK)\n`);
      } else {
        console.error(`❌ Error en ${file}:`, errorMsg);
        process.exit(1);
      }
    }
  }

  console.log('='.repeat(80));
  console.log('✅ TODAS LAS MIGRACIONES COMPLETADAS');
  console.log('='.repeat(80) + '\n');
}

runMigrations().catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});

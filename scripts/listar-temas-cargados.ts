import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function listarTemas() {
  console.log('\n📚 REGISTRO DE TEMAS CARGADOS EN BD\n');
  console.log('='.repeat(80));

  const { data, error } = await supabase
    .from('topics')
    .select('code, title')
    .order('code', { ascending: true });

  if (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }

  console.log(`\n✅ Total de temas cargados: ${data.length}\n`);
  console.log('Formato: # | CODE | TÍTULO\n');
  console.log('-'.repeat(80));

  data.forEach((tema, index) => {
    console.log(`${String(index + 1).padEnd(3)} | ${tema.code.padEnd(10)} | ${tema.title.substring(0, 65)}`);
  });

  console.log('\n' + '='.repeat(80));
}

listarTemas().catch(console.error);

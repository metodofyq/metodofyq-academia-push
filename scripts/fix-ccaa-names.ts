import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Mapeo de nombres de CCAA
const ccaaMap: Record<string, string> = {
  'Comunitat Valenciana': 'Valencia',
  // Agregar más si es necesario
};

async function fixCCAANames() {
  console.log('\n═'.repeat(70));
  console.log('🔧 CORREGIR NOMBRES DE CCAA EN topic_legislation_by_ccaa');
  console.log('═'.repeat(70));

  let updated = 0;

  for (const [oldName, newName] of Object.entries(ccaaMap)) {
    const { data, error } = await supabase
      .from('topic_legislation_by_ccaa')
      .update({ ccaa: newName })
      .eq('ccaa', oldName);

    if (error) {
      console.log(`❌ Error actualizando "${oldName}" → "${newName}": ${error.message}`);
    } else {
      updated++;
      console.log(`✅ "${oldName}" → "${newName}"`);
    }
  }

  console.log(`\n✨ Actualizadas: ${updated} CCAA`);
  console.log('═'.repeat(70) + '\n');
}

fixCCAANames().catch(console.error);

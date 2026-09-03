import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkCCAA() {
  console.log('\n═'.repeat(70));
  console.log('🔍 VERIFICAR COINCIDENCIA DE CCAA');
  console.log('═'.repeat(70));

  // 1. Ver CCAA en profiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, ccaa, grupo')
    .not('ccaa', 'is', null)
    .limit(20);

  console.log('\n📋 CCAA en profiles:');
  const ccaaValues = new Set<string>();
  profiles?.forEach(p => {
    console.log(`   • "${p.ccaa}" (grupo: ${p.grupo})`);
    ccaaValues.add(p.ccaa || '');
  });

  // 2. Ver CCAA en topic_legislation_by_ccaa
  const { data: legislation } = await supabase
    .from('topic_legislation_by_ccaa')
    .select('ccaa, topic_id')
    .order('ccaa');

  console.log('\n🏛️ CCAA en topic_legislation_by_ccaa:');
  const legislationCCAA = new Set<string>();
  legislation?.forEach(l => {
    legislationCCAA.add(l.ccaa);
  });
  Array.from(legislationCCAA).forEach(ccaa => {
    const count = legislation?.filter(l => l.ccaa === ccaa).length;
    console.log(`   • "${ccaa}" (${count} registros)`);
  });

  // 3. Comparar
  console.log('\n⚠️  COMPARACIÓN:');
  Array.from(ccaaValues).forEach(ccaa => {
    if (legislationCCAA.has(ccaa)) {
      console.log(`   ✅ "${ccaa}" existe en ambas tablas`);
    } else {
      console.log(`   ❌ "${ccaa}" SOLO en profiles, NO en legislation`);
    }
  });

  console.log('\n═'.repeat(70) + '\n');
}

checkCCAA().catch(console.error);

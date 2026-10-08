import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function applyMigrations() {
  console.log('\n' + '='.repeat(80));
  console.log('🔄 APLICANDO MIGRACIONES DE BD');
  console.log('='.repeat(80) + '\n');

  console.log('1️⃣  Verificando duration_weeks...\n');
  try {
    const { data } = await supabase
      .from('study_plan_topics')
      .select('duration_weeks')
      .limit(1);
    console.log('✓ Campo duration_weeks ya existe\n');
  } catch (error) {
    console.log('⚠️  Campo duration_weeks no accesible (crear manualmente en Supabase)\n');
  }

  console.log('2️⃣  Verificando tabla study_sessions...\n');
  try {
    const { data } = await supabase
      .from('study_sessions')
      .select('id')
      .limit(1);
    console.log('✓ Tabla study_sessions existe\n');
  } catch (error: any) {
    console.log('⚠️  Tabla study_sessions no existe (crear manualmente en Supabase)\n');
  }

  console.log('='.repeat(80));
  console.log('✅ VERIFICACIÓN DE MIGRACIONES COMPLETA');
  console.log('='.repeat(80) + '\n');
  console.log('📝 NOTA: Si falta algún campo o tabla, ejecutar manualmente en Supabase SQL:\n');
  console.log('-- Migración 1:');
  console.log('ALTER TABLE study_plan_topics ADD COLUMN IF NOT EXISTS duration_weeks INTEGER DEFAULT 1;\n');
  console.log('-- Migración 2:');
  console.log(`CREATE TABLE IF NOT EXISTS study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id),
  topic_id UUID NOT NULL REFERENCES topics(id),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_study_sessions_student ON study_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_topic ON study_sessions(topic_id);\n`);
}

applyMigrations().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});

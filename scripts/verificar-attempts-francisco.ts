import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { format, subDays } from 'date-fns';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function verificarAttempts() {
  console.log('\n📊 VERIFICAR LEVEL_ATTEMPTS - FRANCISCO\n');
  console.log('='.repeat(80));

  try {
    // 1. Obtener usuario
    const { data: usuario } = await supabase
      .from('profiles')
      .select('*')
      .eq('full_name', 'Francisco José Pérez Martínez')
      .single();

    if (!usuario) {
      console.log('❌ Usuario no encontrado');
      return;
    }

    // 2. Tema actual
    const { data: progresos } = await supabase
      .from('topic_progress')
      .select('*, topic:topics(id, code, title)')
      .eq('student_id', usuario.id)
      .not('last_studied_at', 'is', null)
      .order('last_studied_at', { ascending: false })
      .limit(1);

    const temaActual = progresos?.[0];
    const topic = temaActual?.topic as any;

    console.log(`✓ Usuario: ${usuario.full_name}`);
    console.log(`✓ Tema actual: ${topic?.title}`);
    console.log(`  Topic ID: ${topic?.id}\n`);

    // 3. Obtener intentos de últimos 30 días
    const since = format(subDays(new Date(), 30), 'yyyy-MM-dd');

    console.log(`1️⃣  LEVEL_ATTEMPTS ÚLTIMOS 30 DÍAS (desde ${since})\n`);

    const { data: allAttempts } = await supabase
      .from('level_attempts')
      .select('id, level, topic_id, completed_at, topic:topics(code, title)')
      .eq('student_id', usuario.id)
      .gte('completed_at', since)
      .order('completed_at', { ascending: false });

    if (!allAttempts || allAttempts.length === 0) {
      console.log('❌ Sin intentos en últimos 30 días');
    } else {
      console.log(`✓ Total intentos: ${allAttempts.length}\n`);

      // Agrupar por tema
      const porTema: Record<string, any[]> = {};
      for (const a of allAttempts) {
        const t = a.topic as any;
        const key = `${t?.code} - ${t?.title}`;
        if (!porTema[key]) porTema[key] = [];
        porTema[key].push(a);
      }

      Object.entries(porTema).forEach(([tema, attempts]) => {
        console.log(`${tema}`);
        console.log(`  Intentos: ${attempts.length}`);
        const niveles = attempts.map((a: any) => a.level);
        console.log(`  Niveles: ${[...new Set(niveles)].sort().join(', ')}`);
        console.log();
      });
    }

    // 4. Intentos SOLO del tema actual
    console.log(`2️⃣  LEVEL_ATTEMPTS DEL TEMA ACTUAL (${topic?.code})\n`);

    const { data: currentAttempts } = await supabase
      .from('level_attempts')
      .select('level, completed_at')
      .eq('student_id', usuario.id)
      .eq('topic_id', topic?.id)
      .gte('completed_at', since)
      .order('completed_at', { ascending: false });

    if (!currentAttempts || currentAttempts.length === 0) {
      console.log(`❌ Sin intentos del tema actual en últimos 30 días`);
    } else {
      console.log(`✓ Intentos del tema actual: ${currentAttempts.length}\n`);

      // Agrupar por día
      const porDia: Record<string, number[]> = {};
      for (const a of currentAttempts) {
        const day = format(new Date(a.completed_at), 'yyyy-MM-dd');
        if (!porDia[day]) porDia[day] = [];
        porDia[day].push(Number(a.level));
      }

      Object.entries(porDia).sort().forEach(([dia, niveles]) => {
        console.log(`${dia}: [${niveles.join(', ')}]`);
      });
    }

    // 5. Comparación
    console.log(`\n3️⃣  COMPARACIÓN\n`);
    console.log(`Intentos TOTALES (todos los temas): ${allAttempts?.length || 0}`);
    console.log(`Intentos DEL TEMA ACTUAL: ${currentAttempts?.length || 0}`);
    console.log(`Diferencia: ${(allAttempts?.length || 0) - (currentAttempts?.length || 0)} (de otros temas)\n`);

    if ((allAttempts?.length || 0) > (currentAttempts?.length || 0)) {
      console.log('⚠️  PROBLEMA: El calendario está mostrando intentos de OTROS temas');
      console.log('    debería mostrar SOLO del tema actual');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }

  console.log('='.repeat(80) + '\n');
}

verificarAttempts().catch(console.error);

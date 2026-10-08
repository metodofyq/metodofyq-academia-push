import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { format } from 'date-fns';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Plan semanal (del código)
const DIAS_SEMANA = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const PROGRAMACION_SEMANAL: Record<string, number[]> = {
  lunes:     [0, 0.5, 1, 2],
  martes:    [1, 2.5],
  miércoles: [3],
  jueves:    [0, 1, 2],
  viernes:   [1, 2.5],
  sábado:    [3],
  domingo:   [],
};

async function diagnosticoTareasFrancisco() {
  console.log('\n🔍 DIAGNÓSTICO DE TAREAS - FRANCISCO\n');
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

    console.log(`✓ Usuario: ${usuario.full_name}`);
    console.log(`  ID: ${usuario.id}\n`);

    // 2. Obtener tema actual (más recientemente estudiado)
    console.log('1️⃣  TEMA ACTUAL (más recientemente estudiado)\n');

    const { data: progresos } = await supabase
      .from('topic_progress')
      .select('*, topic:topics(id, code, title)')
      .eq('student_id', usuario.id)
      .not('last_studied_at', 'is', null)
      .order('last_studied_at', { ascending: false })
      .limit(5);

    if (!progresos || progresos.length === 0) {
      console.log('❌ No hay progreso registrado en ningún tema');
      return;
    }

    const temaActual = progresos[0];
    const topic = temaActual.topic as any;

    console.log(`✓ Tema actual: ${topic.title}`);
    console.log(`  Code: ${topic.code}`);
    console.log(`  Última actividad: ${temaActual.last_studied_at}`);
    console.log(`  Nivel actual: ${temaActual.current_level}\n`);

    // 3. Obtener niveles programados para hoy
    console.log('2️⃣  NIVELES PROGRAMADOS PARA HOY\n');

    const hoy = new Date();
    const diaSemana = DIAS_SEMANA[hoy.getDay()];
    const nivelesHoy = PROGRAMACION_SEMANAL[diaSemana];

    console.log(`Hoy es: ${diaSemana.toUpperCase()} (${format(hoy, 'yyyy-MM-dd')})`);
    console.log(`Niveles programados: ${nivelesHoy.length > 0 ? nivelesHoy.join(', ') : 'NINGUNO'}\n`);

    // 4. Obtener intentos completados hoy
    console.log('3️⃣  NIVELES COMPLETADOS HOY\n');

    const hoyStr = format(hoy, 'yyyy-MM-dd');
    const { data: attempts } = await supabase
      .from('level_attempts')
      .select('level, completed_at')
      .eq('student_id', usuario.id)
      .eq('topic_id', topic.id)
      .gte('completed_at', `${hoyStr}T00:00:00`)
      .lte('completed_at', `${hoyStr}T23:59:59`)
      .order('completed_at');

    if (!attempts || attempts.length === 0) {
      console.log(`❌ NO hay niveles completados hoy`);
    } else {
      console.log(`✓ Niveles completados: ${attempts.map(a => a.level).join(', ')}`);
      attempts.forEach(a => {
        console.log(`  - Nivel ${a.level}: ${a.completed_at}`);
      });
    }

    // 5. Calcular pendientes
    console.log('\n4️⃣  RESUMEN - TAREAS HOY\n');

    const completados = (attempts ?? []).map((a: any) => Number(a.level));
    const pendientes = nivelesHoy.filter((n) => !completados.includes(n));

    console.log(`Programados: [${nivelesHoy.join(', ')}]`);
    console.log(`Completados: [${completados.length > 0 ? completados.join(', ') : 'ninguno'}]`);
    console.log(`Pendientes:  [${pendientes.length > 0 ? pendientes.join(', ') : 'ninguno'}]\n`);

    if (pendientes.length === 0 && nivelesHoy.length > 0) {
      console.log('✓ Todas las tareas del día completadas');
    } else if (nivelesHoy.length === 0) {
      console.log('ℹ️  No hay tareas programadas para hoy (domingo)');
    } else {
      console.log(`⚠️  ${pendientes.length} nivel(es) pendiente(s)`);
    }

    // 6. Historial de otros temas
    console.log('\n5️⃣  HISTORIAL - OTROS TEMAS\n');

    if (progresos.length > 1) {
      console.log('Otros temas estudiados:');
      progresos.slice(1, 4).forEach((p, i) => {
        const t = p.topic as any;
        console.log(`${i + 1}. ${t.title} - Última: ${p.last_studied_at}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }

  console.log('\n' + '='.repeat(80) + '\n');
}

diagnosticoTareasFrancisco().catch(console.error);

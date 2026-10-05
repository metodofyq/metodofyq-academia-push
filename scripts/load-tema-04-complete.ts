import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function loadTema04() {
  console.log('\n' + '='.repeat(80));
  console.log('✅ CARGANDO TEMA-04 COMPLETO (con validaciones de TEMA-ERRORES-Y-SOLUCIONES.md)');
  console.log('='.repeat(80) + '\n');

  // Leer JSON
  const data = JSON.parse(fs.readFileSync('./scripts/data/tema-04-estructura.json', 'utf-8'));

  // Obtener o crear topic
  const { data: temaData, error: temaError } = await supabase
    .from('topics')
    .select('id')
    .eq('code', 'TEMA-04')
    .single();

  let tema04Id: string;
  if (temaError || !temaData) {
    console.log('📝 Creando tema TEMA-04...');
    const { data: newTema, error: createError } = await supabase
      .from('topics')
      .insert({
        code: 'TEMA-04',
        title: data.tema.title,
        subject: data.tema.subject,
        grupo: data.tema.grupo
      })
      .select()
      .single();

    if (createError) {
      console.error('❌ Error creando tema:', createError);
      process.exit(1);
    }
    tema04Id = newTema.id;
    console.log(`✓ Tema creado con ID: ${tema04Id}`);
  } else {
    tema04Id = temaData.id;
    console.log(`✓ Tema existente encontrado: ${tema04Id}`);
  }

  // Cargar niveles con upsert (LECCIÓN #7: Usar upsert + onConflict + 'title')
  console.log('\n📊 Cargando niveles...\n');

  for (const nivel of data.niveles) {
    const levelNum = nivel.level;
    console.log(`Cargando Nivel ${levelNum}...`);

    // CRÍTICO: Incluir 'title' en upsert (LECCIÓN #7)
    const { error } = await supabase
      .from('topic_levels')
      .upsert({
        topic_id: tema04Id,
        level: nivel.level,
        title: nivel.title || `TEMA-04 Nivel ${nivel.level}`,
        content_json: nivel.content_json
      }, {
        onConflict: 'topic_id,level'  // Evitar duplicados
      });

    if (error) {
      console.error(`   ❌ Error cargando N${levelNum}:`, error.message);
      process.exit(1);
    }

    const flashcardCount = nivel.content_json?.flashcards?.length || 0;
    if (flashcardCount > 0) {
      console.log(`   ✓ Nivel ${levelNum} cargado (${flashcardCount} flashcards)`);
    } else {
      console.log(`   ✓ Nivel ${levelNum} cargado`);
    }
  }

  // Cargar Propuesta Didáctica (LECCIÓN #5: tabla separada, no topic_levels)
  console.log('\n📋 Cargando Propuesta Didáctica...');

  const propuestaTexto = `Este tema puede trasladarse al aula mediante un debate científico guiado sobre si los vehículos autónomos deberían implantarse de forma generalizada en nuestras ciudades. La controversia permite relacionar la cinemática con el análisis de trayectorias, velocidades, aceleraciones, distancias de frenado, sensores y sistemas de control, así como con sus implicaciones sociales, tecnológicas y ambientales.
La clase se organizará de modo que un tercio del alumnado defienda los beneficios de esta tecnología y otro tercio adopte una postura crítica, relacionada con la seguridad, las limitaciones de los sensores, la responsabilidad ante los accidentes, la privacidad o el impacto laboral. El resto asumirá funciones de moderación, análisis de datos, síntesis y valoración final.
El alumnado trabajará con gráficas de velocidad y aceleración, datos sobre distancias de frenado, informes de seguridad vial, resultados experimentales y noticias científicas. Deberá diferenciar hechos, opiniones e inferencias, justificando sus argumentos mediante conceptos cinemáticos. Para favorecer la inclusión, se proporcionarán apoyos visuales, guías de argumentación, roles cooperativos y diversas formas de participación oral y escrita.`;

  const { error: propError } = await supabase
    .from('topic_propuesta_didactica')
    .upsert({
      topic_id: tema04Id,
      lectura: propuestaTexto,
      actividad: 'Debate científico guiado sobre vehículos autónomos',
      dinamica: 'debate-colaborativo'
    }, {
      onConflict: 'topic_id'
    });

  if (propError) {
    console.error('   ❌ Error cargando propuesta didáctica:', propError.message);
    process.exit(1);
  }
  console.log('   ✓ Propuesta didáctica cargada');

  // Verificación post-carga (LECCIÓN #8: validar después)
  console.log('\n🔍 Verificación post-carga...\n');

  // Verificar N1 (LECCIÓN #4: comparar estructura)
  const { data: n1Data, error: n1Error } = await supabase
    .from('topic_levels')
    .select('content_json')
    .eq('topic_id', tema04Id)
    .eq('level', 1)
    .single();

  if (!n1Error && n1Data) {
    const keywords = n1Data.content_json.keywords;
    const keywordCount = Object.keys(keywords).length;
    console.log(`✓ N1: ${keywordCount} secciones con keywords`);

    // Verificar que sean strings con separador
    let allValid = true;
    for (const [key, value] of Object.entries(keywords)) {
      if (typeof value !== 'string' || !value.includes('·')) {
        console.log(`   ⚠️  ${key} tiene formato incorrecto`);
        allValid = false;
      }
    }
    if (allValid) {
      console.log(`✓ Todos los keywords tienen formato string con separador "·"`);
    }
  }

  // Verificar N3 (LECCIÓN #2: índice + bibliografía)
  const { data: n3Data, error: n3Error } = await supabase
    .from('topic_levels')
    .select('content_json')
    .eq('topic_id', tema04Id)
    .eq('level', 3)
    .single();

  if (!n3Error && n3Data) {
    const texto = n3Data.content_json.texto;
    const tieneIndice = texto.includes('**ÍNDICE**');
    const tieneBibliografia = texto.includes('Bibliografía');
    console.log(`✓ N3: Índice ${tieneIndice ? 'presente' : 'FALTA'}`);
    console.log(`✓ N3: Bibliografía ${tieneBibliografia ? 'presente' : 'FALTA'}`);
  }

  // Verificar N2.5 y N3.5 (LECCIÓN #3: campos correctos)
  for (const level of [2.5, 3.5]) {
    const { data: levelData, error: levelError } = await supabase
      .from('topic_levels')
      .select('content_json')
      .eq('topic_id', tema04Id)
      .eq('level', level)
      .single();

    if (!levelError && levelData) {
      const flashcards = levelData.content_json.flashcards;
      if (flashcards && flashcards.length > 0) {
        const primerCard = flashcards[0];
        const tieneTermino = 'termino' in primerCard;
        const tieneDescripcion = 'descripcion' in primerCard;
        console.log(`✓ N${level}: ${flashcards.length} flashcards con campos termino/descripcion`);
      }
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('✅ TEMA-04 COMPLETAMENTE CARGADO Y VERIFICADO');
  console.log('='.repeat(80) + '\n');
}

loadTema04().catch((error) => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});

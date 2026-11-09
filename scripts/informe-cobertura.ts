import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const CCAA_REF = 'Comunitat Valenciana';

async function informeCobertura() {
  const { data: topics, error: tErr } = await supabase.from('topics').select('id, code, subject').order('code');
  if (tErr || !topics) throw new Error(`No se pudieron leer los temas: ${tErr?.message}`);

  const { data: levels, error: lErr } = await supabase.from('topic_levels').select('topic_id, level, content_json');
  if (lErr || !levels) throw new Error(`No se pudieron leer los niveles: ${lErr?.message}`);

  const { data: infos, error: iErr } = await supabase.from('topic_infografias').select('topic_id');
  if (iErr || !infos) throw new Error(`No se pudieron leer las infografías: ${iErr?.message}`);

  const { data: propuestas, error: pErr } = await supabase.from('topic_propuesta_didactica').select('topic_id');
  if (pErr || !propuestas) throw new Error(`No se pudieron leer las propuestas: ${pErr?.message}`);

  const { data: leg, error: legErr } = await supabase.from('topic_legislation_by_ccaa').select('topic_id, ccaa, contenido');
  if (legErr || !leg) throw new Error(`No se pudo leer la legislación: ${legErr?.message}`);

  const nivelPorTema: Record<string, Record<string, any>> = {};
  for (const l of levels) {
    (nivelPorTema[l.topic_id] ||= {})[Number(l.level)] = l.content_json || {};
  }
  const infoCount: Record<string, number> = {};
  for (const i of infos) infoCount[i.topic_id] = (infoCount[i.topic_id] || 0) + 1;
  const propSet = new Set(propuestas.map((p) => p.topic_id));
  const legCV = new Set(leg.filter((x) => x.ccaa === CCAA_REF && x.contenido).map((x) => x.topic_id));

  const firma = (c: any) => JSON.stringify(c ?? null);
  const topic50 = topics.find((t) => t.code === 'TEMA-50');
  const ref50 = topic50 ? nivelPorTema[topic50.id] || {} : {};
  const esCopiaDe50 = (id: string) => {
    if (topic50 && id === topic50.id) return false;
    const n = nivelPorTema[id] || {};
    return [0, 2.5].every((lv) => n[lv] && firma(n[lv]) === firma(ref50[lv]));
  };

  const celda = (ok: boolean, detalle?: string) => (ok ? `✓${detalle ? ` ${detalle}` : ''}` : '✗');

  const filas: string[] = [];
  const incompletos: string[] = [];
  const cabecera = '| Tema | Materia | N0 | N0.5 | N1 | N2 | N2.5 | N3 | N3.5 | Propuesta | Legislación CV |';
  const separador = '|---|---|---|---|---|---|---|---|---|---|---|';

  for (const t of topics) {
    const n = nivelPorTema[t.id] || {};
    const n0 = n[0]?.estructura?.length;
    const n1 = n[1]?.keywords ? Object.keys(n[1].keywords).length : 0;
    const n2 = !!n[2]?.texto;
    const n25 = n[2.5]?.flashcards?.length || 0;
    const n3 = !!n[3]?.texto;
    const n35 = n[3.5]?.flashcards?.length || 0;
    const info = infoCount[t.id] || 0;
    const prop = propSet.has(t.id);
    const leg = legCV.has(t.id);

    const copia = esCopiaDe50(t.id);
    const contenido = (b: boolean) => !copia && b;

    const faltan: string[] = [];
    if (copia) faltan.push('CONTENIDO COPIADO DE TEMA-50 (no cuenta como completado)');
    if (!contenido(!!n0)) faltan.push('N0');
    if (!contenido(n1 > 0)) faltan.push('N1');
    if (!contenido(n2)) faltan.push('N2');
    if (!contenido(n25 > 0)) faltan.push('N2.5');
    if (!contenido(n3)) faltan.push('N3');
    if (!contenido(n35 > 0)) faltan.push('N3.5');
    if (!prop) faltan.push('propuesta');
    if (!leg) faltan.push('legislación CV');
    if (faltan.length) incompletos.push(`${t.code}: ${faltan.join(', ')}`);

    const marca = copia ? '⚠ copia' : '';
    filas.push(
      `| ${t.code} | ${t.subject || '—'} | ${copia ? marca : celda(!!n0, n0 ? `(${n0})` : '')} | ${celda(info > 0, info ? `(${info})` : '')} | ${copia ? marca : celda(n1 > 0, n1 ? `(${n1})` : '')} | ${copia ? marca : celda(n2)} | ${copia ? marca : celda(n25 > 0, n25 ? `(${n25})` : '')} | ${copia ? marca : celda(n3)} | ${copia ? marca : celda(n35 > 0, n35 ? `(${n35})` : '')} | ${celda(prop)} | ${celda(leg)} |`
    );
  }

  const completos = topics.length - incompletos.length;
  console.log(`# Cobertura de temas\n`);
  console.log(`**Temas completos: ${completos} de ${topics.length}**\n`);
  console.log(cabecera);
  console.log(separador);
  filas.forEach((f) => console.log(f));
  console.log(`\n## Temas con huecos (${incompletos.length})\n`);
  incompletos.forEach((i) => console.log(`- ${i}`));
  if (!incompletos.length) console.log('Ninguno.');
}

informeCobertura().catch((e) => {
  console.error('❌', e.message);
  process.exit(1);
});

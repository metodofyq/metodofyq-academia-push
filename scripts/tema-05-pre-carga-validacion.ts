import fs from 'fs';
import path from 'path';

const data = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'scripts', 'data', 'tema-05-estructura.json'), 'utf-8'));
const errores: string[] = [];
const check = (ok: boolean, msg: string) => { if (!ok) errores.push(msg); };

const niveles: any[] = data.niveles;
const porNivel = (l: number) => niveles.find((n) => n.level === l);

check(data.tema.code === 'TEMA-05', 'code debe ser TEMA-05');
for (const n of niveles) check(typeof n.title === 'string' && n.title.length > 0, `N${n.level} sin title`);

const n0 = porNivel(0)!.content_json.estructura;
check(Array.isArray(n0) && n0.every((a: any) => typeof a.apartado === 'string' && Array.isArray(a.subapartados)), 'N0 debe ser array de {apartado, subapartados}');

const kw = porNivel(1)!.content_json.keywords;
check(kw && !Array.isArray(kw) && typeof kw === 'object', 'N1 keywords debe ser objeto');
for (const [k, v] of Object.entries(kw)) check(typeof v === 'string' && (v as string).includes('·'), `N1 "${k}" sin separador "·"`);

const n2 = porNivel(2)!.content_json.texto as string;
check(!/^\* /m.test(n2), 'N2 contiene líneas que empiezan con "* "');
check(!n2.includes('[aquí'), 'N2 contiene placeholder [aquí');

const n3 = porNivel(3)!.content_json.texto as string;
check(n3.includes('ÍNDICE'), 'N3 sin ÍNDICE');
check(n3.includes('Bibliografía'), 'N3 sin Bibliografía');
check(!n3.includes('[aquí'), 'N3 contiene placeholder [aquí');

for (const [label, texto] of [['N0', JSON.stringify(n0)], ['N1', JSON.stringify(kw)], ['N2', n2], ['N3', n3]] as [string, string][]) {
  check(!texto.includes('\\'), `${label} contiene barras invertidas (LaTeX sin convertir)`);
  check(!texto.includes('⃗'), `${label} contiene combinación ⃗ corrupta`);
}

for (const lv of [2.5, 3.5]) {
  const fc: any[] = porNivel(lv)!.content_json.flashcards;
  check(Array.isArray(fc) && fc.length > 0, `N${lv} sin flashcards`);
  for (const f of fc) {
    check(typeof f.termino === 'string' && f.termino.length > 0, `N${lv} flashcard ${f.id} sin termino`);
    check(typeof f.descripcion === 'string' && f.descripcion.length > 0, `N${lv} flashcard ${f.id} sin descripcion`);
    check(!('pregunta' in f) && !('respuesta' in f), `N${lv} flashcard ${f.id} usa pregunta/respuesta`);
  }
  console.log(`N${lv}: ${fc.length} flashcards`);
}

const p = data.propuesta_didactica;
for (const campo of ['lectura', 'actividad', 'dinamica']) {
  check(typeof p[campo] === 'string' && p[campo].length > 0 && p[campo].length <= 50, `propuesta.${campo} vacía o > 50 caracteres (${p[campo]?.length})`);
}

console.log(`Niveles: ${niveles.map((n) => n.level).join(', ')}`);
console.log(`N1: ${Object.keys(kw).length} secciones con keywords`);

if (errores.length) {
  console.error('\n❌ VALIDACIÓN FALLIDA:');
  errores.forEach((e) => console.error(' - ' + e));
  process.exit(1);
}
console.log('\n✅ Validación pre-carga correcta');

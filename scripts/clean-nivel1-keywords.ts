import * as fs from 'fs';

interface Tema {
  tema: string;
  niveles: Array<{
    nivel: number;
    content_json: Record<string, unknown>;
  }>;
}

function cleanKeywords(tema: Tema) {
  const nivel1 = tema.niveles.find(n => n.nivel === 1);
  if (!nivel1) return;

  const keywords = (nivel1.content_json.keywords || {}) as Record<string, string>;

  // Vaciar todos los valores - dejar solo las palabras clave sin definiciones
  const cleanedKeywords: Record<string, string> = {};
  for (const key of Object.keys(keywords)) {
    cleanedKeywords[key] = '';
  }

  nivel1.content_json.keywords = cleanedKeywords;
  console.log(`  ✅ ${Object.keys(cleanedKeywords).length} keywords limpiadas`);
}

function main() {
  console.log('=' .repeat(60));
  console.log('LIMPIAR NIVEL 1: SOLO PALABRAS CLAVE (sin definiciones)');
  console.log('=' .repeat(60) + '\n');

  const tema50Path = 'scripts/data/tema50-estructura-fixed.json';
  const tema54Path = 'scripts/data/tema54-estructura-fixed.json';

  console.log('📝 Procesando TEMA-50...');
  const tema50 = JSON.parse(fs.readFileSync(tema50Path, 'utf-8')) as Tema;
  cleanKeywords(tema50);
  fs.writeFileSync(tema50Path, JSON.stringify(tema50, null, 2), 'utf-8');

  console.log('📝 Procesando TEMA-54...');
  const tema54 = JSON.parse(fs.readFileSync(tema54Path, 'utf-8')) as Tema;
  cleanKeywords(tema54);
  fs.writeFileSync(tema54Path, JSON.stringify(tema54, null, 2), 'utf-8');

  console.log('\n✅ Keywords limpiadas. Próximo paso: recargar en Supabase');
}

main();

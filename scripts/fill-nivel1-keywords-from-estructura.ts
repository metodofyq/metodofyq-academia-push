import * as fs from 'fs';

interface Tema {
  tema: string;
  niveles: Array<{
    nivel: number;
    content_json: Record<string, unknown>;
  }>;
}

function fillKeywordsFromEstructura(tema: Tema) {
  const nivel0 = tema.niveles.find(n => n.nivel === 0);
  const nivel1 = tema.niveles.find(n => n.nivel === 1);

  if (!nivel0 || !nivel1) return;

  const estructura = (nivel0.content_json.estructura || []) as Array<{
    apartado: string;
    subapartados: string[];
  }>;

  // Crear keywords: cada subapartado es la palabra clave
  const keywords: Record<string, string> = {};
  for (const apartado of estructura) {
    for (const sub of apartado.subapartados) {
      // Usa el subapartado como palabra clave (y valor vacío para que sea para llenar)
      keywords[sub] = '';
    }
  }

  nivel1.content_json.keywords = keywords;
  console.log(`  ✅ ${Object.keys(keywords).length} keywords desde estructura`);
}

function main() {
  console.log('=' .repeat(60));
  console.log('RELLENAR NIVEL 1: PALABRAS CLAVE DESDE ESTRUCTURA');
  console.log('=' .repeat(60) + '\n');

  const tema50Path = 'scripts/data/tema50-estructura-fixed.json';
  const tema54Path = 'scripts/data/tema54-estructura-fixed.json';

  console.log('📝 Procesando TEMA-50...');
  const tema50 = JSON.parse(fs.readFileSync(tema50Path, 'utf-8')) as Tema;
  fillKeywordsFromEstructura(tema50);
  fs.writeFileSync(tema50Path, JSON.stringify(tema50, null, 2), 'utf-8');

  console.log('📝 Procesando TEMA-54...');
  const tema54 = JSON.parse(fs.readFileSync(tema54Path, 'utf-8')) as Tema;
  fillKeywordsFromEstructura(tema54);
  fs.writeFileSync(tema54Path, JSON.stringify(tema54, null, 2), 'utf-8');

  console.log('\n✅ Keywords rellenadas. Próximo paso: recargar en Supabase');
}

main();

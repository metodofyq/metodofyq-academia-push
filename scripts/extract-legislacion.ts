import * as fs from 'fs';

interface Tema {
  tema: string;
  titulo: string;
  grupo: number;
  ccaa: string;
  niveles: Array<{
    nivel: number;
    titulo: string;
    content_json: Record<string, unknown>;
  }>;
}

function extractLegislacionSection(text: string): string {
  // Buscar desde "1. Marco curricular y legislativo" hasta "2. Cinética..."
  const startPattern = /1\.\s+Marco\s+curricular\s+y\s+legislativo/i;
  const endPattern = /\n\d+\.\s+(?!Marco)/; // Próxima sección numérica

  const startMatch = text.match(startPattern);
  if (!startMatch) {
    console.warn('    ⚠️  No se encontró "Marco curricular y legislativo"');
    return '';
  }

  const startIndex = startMatch.index || 0;
  const textFromStart = text.substring(startIndex);
  const endMatch = textFromStart.match(endPattern);

  if (!endMatch) {
    // Si no hay siguiente sección, tomar hasta el final
    return textFromStart;
  }

  return textFromStart.substring(0, endMatch.index || textFromStart.length);
}

function processTemple(filePath: string, tema: Tema) {
  console.log(`📝 Extrayendo legislación para ${tema.tema}...`);

  const nivel3 = tema.niveles.find(n => n.nivel === 3);
  if (!nivel3) {
    console.warn('    ⚠️  No hay Nivel 3');
    return;
  }

  const nivel3Text = (nivel3.content_json.texto || '') as string;
  const legislacionText = extractLegislacionSection(nivel3Text);

  if (!legislacionText) {
    console.warn('    ⚠️  No se pudo extraer legislación');
    return;
  }

  // Crear o actualizar Nivel 4
  let nivel4 = tema.niveles.find(n => n.nivel === 4);
  if (!nivel4) {
    nivel4 = {
      nivel: 4,
      titulo: 'Legislación',
      content_json: {},
    };
    tema.niveles.push(nivel4);
  }

  nivel4.content_json = {
    tipo: 'legislacion',
    texto: legislacionText.trim(),
  };

  fs.writeFileSync(filePath, JSON.stringify(tema, null, 2), 'utf-8');
  console.log(`    ✅ Legislación extraída (${legislacionText.length} caracteres)`);
}

async function main() {
  console.log('=' .repeat(60));
  console.log('EXTRAER SECCIÓN LEGISLATIVA (Nivel 4)');
  console.log('=' .repeat(60) + '\n');

  const tema50 = JSON.parse(
    fs.readFileSync('scripts/data/tema50-estructura-fixed.json', 'utf-8')
  ) as Tema;
  tema50.ccaa = 'Valencia'; // Ejemplo
  processTemple('scripts/data/tema50-estructura-fixed.json', tema50);

  const tema54 = JSON.parse(
    fs.readFileSync('scripts/data/tema54-estructura-fixed.json', 'utf-8')
  ) as Tema;
  tema54.ccaa = 'Valencia';
  processTemple('scripts/data/tema54-estructura-fixed.json', tema54);

  console.log('\n✅ Nivel 4 extraído. Próximo paso: recargar en Supabase');
  console.log('   npx tsx scripts/seed-temas-fixed.ts');
}

main();

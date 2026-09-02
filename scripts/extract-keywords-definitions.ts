import * as fs from 'fs';

interface Tema {
  tema: string;
  titulo: string;
  grupo: number;
  niveles: Array<{
    nivel: number;
    titulo: string;
    content_json: Record<string, unknown>;
  }>;
}

function extractKeywordDefinitions(tema: Tema): Record<string, string> {
  const nivel1 = tema.niveles.find(n => n.nivel === 1);
  const nivel2 = tema.niveles.find(n => n.nivel === 2);

  if (!nivel1 || !nivel2) return {};

  const keywords = (nivel1.content_json.keywords || {}) as Record<string, string>;
  const nivel2Text = (nivel2.content_json.texto || '') as string;

  const definitions: Record<string, string> = {};

  for (const keyword of Object.keys(keywords)) {
    // Buscar la palabra clave en el texto de Nivel 2
    const regex = new RegExp(`${keyword}[:.]*\\s*([^.!?]*[.!?])`, 'i');
    const match = nivel2Text.match(regex);

    if (match && match[1]) {
      // Extraer y limpiar la definición
      let definition = match[1].trim();
      // Limitar a ~150 caracteres
      if (definition.length > 150) {
        definition = definition.substring(0, 150).trim() + '...';
      }
      definitions[keyword] = definition;
    } else {
      // Si no encuentra definición completa, buscar solo mención
      if (nivel2Text.includes(keyword)) {
        definitions[keyword] = `Concepto clave de ${tema.tema}`;
      } else {
        definitions[keyword] = '';
      }
    }
  }

  return definitions;
}

function updateTemaWithDefinitions(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const tema = JSON.parse(content) as Tema;

  console.log(`📝 Extrayendo definiciones para ${tema.tema}...`);

  const definitions = extractKeywordDefinitions(tema);
  const nivel1 = tema.niveles.find(n => n.nivel === 1);

  if (nivel1) {
    nivel1.content_json.keywords = definitions;
    fs.writeFileSync(filePath, JSON.stringify(tema, null, 2), 'utf-8');

    const filledCount = Object.values(definitions).filter(v => v.length > 0).length;
    console.log(`  ✅ ${filledCount}/${Object.keys(definitions).length} keywords con definiciones`);
  }
}

async function main() {
  console.log('=' .repeat(60));
  console.log('RELLENAR KEYWORDS CON DEFINICIONES');
  console.log('=' .repeat(60) + '\n');

  updateTemaWithDefinitions('scripts/data/tema50-estructura-fixed.json');
  updateTemaWithDefinitions('scripts/data/tema54-estructura-fixed.json');

  console.log('\n✅ Definiciones extraídas. Próximo paso: recargar en Supabase');
  console.log('   npx tsx scripts/seed-temas-fixed.ts');
}

main();

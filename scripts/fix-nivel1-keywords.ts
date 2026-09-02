import * as fs from 'fs';
import * as path from 'path';

interface Apartado {
  apartado: string;
  subapartados: string[];
}

interface Nivel {
  nivel: number;
  titulo: string;
  content_json: Record<string, unknown>;
}

interface TemaData {
  tema: string;
  titulo: string;
  grupo: number;
  niveles: Nivel[];
}

function convertNivel1ToKeywords(data: TemaData): TemaData {
  const nivel1 = data.niveles.find(n => n.nivel === 1);
  if (!nivel1) return data;

  const currentContent = nivel1.content_json as Record<string, unknown>;
  const estructura = currentContent.estructura as Apartado[];

  if (!estructura || !Array.isArray(estructura)) {
    console.warn(`  ⚠️  Nivel 1 no tiene estructura válida`);
    return data;
  }

  // Extraer todas las palabras clave (subapartados) en un objeto flat
  const keywords: Record<string, string> = {};

  for (const apartado of estructura) {
    for (const keyword of apartado.subapartados) {
      // Usar la palabra clave como clave, y una descripción vacía como valor
      // (el usuario puede rellenar después si es necesario)
      keywords[keyword] = '';
    }
  }

  console.log(`  Convertidos ${Object.keys(keywords).length} keywords`);

  // Reemplazar la estructura con keywords
  nivel1.content_json = {
    tipo: 'palabras_clave',
    keywords: keywords,
  };

  return data;
}

async function fixTema(filePath: string) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content) as TemaData;

    console.log(`📝 Procesando ${data.tema}...`);
    const fixed = convertNivel1ToKeywords(data);

    fs.writeFileSync(filePath, JSON.stringify(fixed, null, 2), 'utf-8');
    console.log(`✅ ${data.tema} convertido correctamente\n`);
  } catch (err) {
    console.error(`❌ Error procesando ${filePath}:`, err);
    process.exit(1);
  }
}

async function main() {
  console.log('=' .repeat(60));
  console.log('CONVERTIR NIVEL 1: estructura → keywords');
  console.log('=' .repeat(60) + '\n');

  await fixTema('scripts/data/tema50-estructura-fixed.json');
  await fixTema('scripts/data/tema54-estructura-fixed.json');

  console.log('✅ Todos los temas convertidos correctamente');
}

main();

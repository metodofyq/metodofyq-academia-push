import * as fs from 'fs';

interface TemaData {
  tema: string;
  titulo: string;
  grupo: number;
  niveles: Array<{
    nivel: number;
    titulo: string;
    content_json: {
      tipo: string;
      texto?: string;
      [key: string]: unknown;
    };
  }>;
}

function extractPropuestaDidactica(filePath: string, temaNombre: string): { lectura: string; actividad: string } | null {
  console.log(`\n📚 Procesando ${temaNombre}:`);

  const tema = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as TemaData;

  // Buscar Nivel 3
  const nivel3 = tema.niveles.find(n => n.nivel === 3);
  if (!nivel3 || !nivel3.content_json.texto) {
    console.log(`  ❌ No se encontró Nivel 3 con texto`);
    return null;
  }

  const texto = nivel3.content_json.texto as string;

  // Extraer sección "Propuesta didáctica" entre "6. Propuesta didáctica" y "7. Conclusiones"
  const propuestaMatch = texto.match(
    /6\.\s*Propuesta didáctica\n\n([\s\S]*?)\n\n7\.\s*Conclusiones/
  );

  if (!propuestaMatch) {
    console.log(`  ⚠️  No se encontró sección "Propuesta didáctica"`);
    return null;
  }

  const propuestaTexto = propuestaMatch[1].trim();

  console.log(`  ✅ Propuesta didáctica extraída (${propuestaTexto.length} caracteres)`);

  return {
    lectura: propuestaTexto,
    actividad: propuestaTexto
  };
}

function generatePropuestaDidacticaLevel(tema: string, propuesta: { lectura: string; actividad: string }) {
  return {
    nivel: "propuesta_didactica",
    titulo: "Propuesta didáctica",
    content_json: {
      tipo: "propuesta_didactica",
      lectura: propuesta.lectura,
      actividad: propuesta.actividad,
      dinamica: "dictado-corrector"
    }
  };
}

function removePropuestaFromNivel3(filePath: string) {
  const tema = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as TemaData;

  const nivel3 = tema.niveles.find(n => n.nivel === 3);
  if (!nivel3 || !nivel3.content_json.texto) return;

  let texto = nivel3.content_json.texto as string;

  // Remover la sección "6. Propuesta didáctica" y su contenido
  texto = texto.replace(
    /\n\n6\.\s*Propuesta didáctica\n\n[\s\S]*?(?=\n\n7\.\s*Conclusiones)/,
    ''
  );

  // Renumerar: "7. Conclusiones" → "6. Conclusiones"
  texto = texto.replace(/\n\n7\.\s*Conclusiones/, '\n\n6. Conclusiones');

  nivel3.content_json.texto = texto;

  fs.writeFileSync(filePath, JSON.stringify(tema, null, 2), 'utf-8');
}

console.log('');
console.log('═'.repeat(70));
console.log('📖 EXTRAER PROPUESTA DIDÁCTICA DEL NIVEL 3');
console.log('═'.repeat(70));

// Procesar Tema 50
const propuesta50 = extractPropuestaDidactica(
  'scripts/data/tema50-estructura-fixed.json',
  'TEMA-50'
);

// Procesar Tema 54
const propuesta54 = extractPropuestaDidactica(
  'scripts/data/tema54-estructura-fixed.json',
  'TEMA-54'
);

if (propuesta50) {
  console.log('\n  📝 Propuesta 50 generada:');
  console.log('  Lectura:', propuesta50.lectura.substring(0, 80) + '...');
}

if (propuesta54) {
  console.log('\n  📝 Propuesta 54 generada:');
  console.log('  Lectura:', propuesta54.lectura.substring(0, 80) + '...');
}

// Crear archivo JSON con las propuestas
const propuestasData = {
  temas: [
    propuesta50 ? {
      tema: 'TEMA-50',
      propuesta_didactica: generatePropuestaDidacticaLevel('TEMA-50', propuesta50)
    } : null,
    propuesta54 ? {
      tema: 'TEMA-54',
      propuesta_didactica: generatePropuestaDidacticaLevel('TEMA-54', propuesta54)
    } : null
  ].filter(Boolean)
};

fs.writeFileSync(
  'scripts/data/propuesta-didactica.json',
  JSON.stringify(propuestasData, null, 2),
  'utf-8'
);

console.log('\n  💾 Guardado en: scripts/data/propuesta-didactica.json');

// Remover propuesta del Nivel 3
console.log('\n  🔄 Removiendo Propuesta didáctica de Nivel 3...');
if (propuesta50) removePropuestaFromNivel3('scripts/data/tema50-estructura-fixed.json');
if (propuesta54) removePropuestaFromNivel3('scripts/data/tema54-estructura-fixed.json');

console.log('  ✅ Removido de ambos temas');

console.log('\n✨ Paso 2 completado');
console.log('═'.repeat(70) + '\n');

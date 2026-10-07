import fs from 'fs';

/**
 * TEMA-16 PRE-CARGA VALIDATION
 * Verificación de todos los errores documentados antes de subir a BD
 * Basado en: TEMA-ERRORES-Y-SOLUCIONES.md
 */

const filePath = './scripts/data/tema-16-estructura.json';
let data: any;

console.log('\n🔍 TEMA-16: VALIDACIÓN PRE-CARGA\n');

// Leer JSON
try {
  data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  console.log('✓ JSON válido leído correctamente');
} catch (e) {
  console.error('❌ Error al leer JSON:', e);
  process.exit(1);
}

// Errores encontrados
let erroresEncontrados: string[] = [];

// ============================================================================
// ERROR 1: Verificar N0 estructura
// ============================================================================
console.log('\n1️⃣  NIVEL 0 - ÍNDICE');
const n0 = data.niveles[0];
if (!n0 || n0.level !== 0) {
  erroresEncontrados.push('N0 no encontrado o level incorrecto');
} else {
  if (!n0.content_json.estructura || !Array.isArray(n0.content_json.estructura)) {
    erroresEncontrados.push('N0: estructura no es array');
  } else {
    console.log(`   Apartados encontrados: ${n0.content_json.estructura.length}`);
    n0.content_json.estructura.forEach((apt: any, i: number) => {
      console.log(`   ${i + 1}. ${apt.apartado} (${apt.subapartados?.length || 0} subapartados)`);
    });
  }
}

// ============================================================================
// ERROR 2: Verificar N1 estructura (keywords, no apartados)
// ============================================================================
console.log('\n2️⃣  NIVEL 1 - PALABRAS CLAVE');
const n1 = data.niveles[1];
if (!n1 || n1.level !== 1) {
  erroresEncontrados.push('N1 no encontrado o level incorrecto');
} else {
  // Verificar que sea "keywords" no "apartados"
  if (!n1.content_json.keywords) {
    erroresEncontrados.push('N1: campo debe ser "keywords", no "apartados"');
  } else {
    const keywordsEntries = Object.entries(n1.content_json.keywords);
    console.log(`   Secciones con keywords: ${keywordsEntries.length}`);

    // Verificar que sean strings, no arrays
    let arrayFound = false;
    for (const [key, value] of keywordsEntries) {
      if (typeof value !== 'string') {
        erroresEncontrados.push(`N1: ${key} es ${typeof value}, debe ser string`);
        arrayFound = true;
      }
      // Verificar separador "·"
      if (typeof value === 'string' && !value.includes('·')) {
        console.log(`   ⚠️  ${key} NO contiene separador "·"`);
      }
    }
    if (!arrayFound) {
      console.log('   ✓ Todos los keywords son strings');
      console.log(`   ✓ ${keywordsEntries.filter(([_, v]) => (v as string).includes('·')).length}/${keywordsEntries.length} con separador "·"`);
    }
  }
}

// ============================================================================
// ERROR 3: Verificar N2 sin símbolos "*"
// ============================================================================
console.log('\n3️⃣  NIVEL 2 - DESARROLLO ESQUEMÁTICO');
const n2 = data.niveles[2];
if (!n2 || n2.level !== 2) {
  erroresEncontrados.push('N2 no encontrado o level incorrecto');
} else {
  const texto = n2.content_json.texto;
  const lineasConAsterisco = texto.split('\n').filter((l: string) => l.match(/^\* /));
  if (lineasConAsterisco.length > 0) {
    erroresEncontrados.push(`N2: contiene ${lineasConAsterisco.length} líneas con "* "`);
    console.log(`   ❌ ${lineasConAsterisco.length} líneas comienzan con "*"`);
  } else {
    console.log('   ✓ Sin símbolos "*" detectados');
  }
}

// ============================================================================
// ERROR 4: Verificar N3 con índice y bibliografía
// ============================================================================
console.log('\n4️⃣  NIVEL 3 - REDACCIÓN COMPLETA');
const n3 = data.niveles[3];
if (!n3 || n3.level !== 3) {
  erroresEncontrados.push('N3 no encontrado o level incorrecto');
} else {
  const texto = n3.content_json.texto;
  const tieneIndice = texto.includes('**ÍNDICE**') || texto.includes('Índice');
  const tieneBibliografia = texto.includes('Bibliografía') || texto.includes('bibliografía');

  console.log(`   ${tieneIndice ? '✓' : '❌'} Índice: ${tieneIndice ? 'presente' : 'FALTA'}`);
  console.log(`   ${tieneBibliografia ? '✓' : '❌'} Bibliografía: ${tieneBibliografia ? 'presente' : 'FALTA'}`);

  if (!tieneIndice) {
    erroresEncontrados.push('N3: falta ÍNDICE al inicio');
  }
  if (!tieneBibliografia) {
    erroresEncontrados.push('N3: falta sección Bibliografía');
  }
}

// ============================================================================
// ERROR 5: Verificar N2.5 - Campos termino/descripcion (NO pregunta/respuesta)
// ============================================================================
console.log('\n5️⃣  NIVEL 2.5 - RECUPERACIÓN ACTIVA');
const n25 = data.niveles[4];
if (!n25 || n25.level !== 2.5) {
  erroresEncontrados.push('N2.5 no encontrado');
} else {
  const flashcards = n25.content_json.flashcards || [];
  console.log(`   Flashcards: ${flashcards.length}`);

  if (flashcards.length > 0) {
    const primerCard = flashcards[0];
    const tienePregunta = 'pregunta' in primerCard;
    const tieneTermino = 'termino' in primerCard;

    if (tienePregunta && !tieneTermino) {
      erroresEncontrados.push('N2.5: usa "pregunta" - debe ser "termino"');
      console.log('   ❌ Usa "pregunta/respuesta" - debe ser "termino/descripcion"');
    } else if (tieneTermino) {
      console.log('   ✓ Usa "termino/descripcion" correctamente');
    }
  }
}

// ============================================================================
// ERROR 6: Verificar N3.5 - Campos termino/descripcion (NO pregunta/respuesta)
// ============================================================================
console.log('\n6️⃣  NIVEL 3.5 - RECONSTRUCCIÓN CIENTÍFICA');
const n35 = data.niveles[5];
if (!n35 || n35.level !== 3.5) {
  erroresEncontrados.push('N3.5 no encontrado');
} else {
  const flashcards = n35.content_json.flashcards || [];
  console.log(`   Flashcards: ${flashcards.length}`);

  if (flashcards.length > 0) {
    const primerCard = flashcards[0];
    const tienePregunta = 'pregunta' in primerCard;
    const tieneTermino = 'termino' in primerCard;

    if (tienePregunta && !tieneTermino) {
      erroresEncontrados.push('N3.5: usa "pregunta" - debe ser "termino"');
      console.log('   ❌ Usa "pregunta/respuesta" - debe ser "termino/descripcion"');
    } else if (tieneTermino) {
      console.log('   ✓ Usa "termino/descripcion" correctamente');
    }
  }
}

// ============================================================================
// ERROR 7: Verificar campos "title" en todos los niveles
// ============================================================================
console.log('\n7️⃣  CAMPOS REQUERIDOS - "title"');
for (let i = 0; i < data.niveles.length; i++) {
  const nivel = data.niveles[i];
  const tieneTitle = 'title' in nivel;
  console.log(`   N${nivel.level}: ${tieneTitle ? '✓' : '❌'} title`);
  if (!tieneTitle) {
    erroresEncontrados.push(`N${nivel.level}: falta campo "title"`);
  }
}

// ============================================================================
// ERROR 8: Validar estructura JSON general
// ============================================================================
console.log('\n8️⃣  ESTRUCTURA GENERAL');
if (!data.tema) {
  erroresEncontrados.push('Falta campo "tema"');
} else {
  console.log(`   Tema: ${data.tema.code}`);
  console.log(`   Grupo: ${data.tema.grupo || 'No especificado'}`);
}

if (!Array.isArray(data.niveles)) {
  erroresEncontrados.push('Niveles no es array');
} else {
  console.log(`   Niveles: ${data.niveles.length} encontrados`);
  data.niveles.forEach((n: any) => {
    console.log(`      - Nivel ${n.level}: ${n.content_json?.tipo || 'tipo desconocido'}`);
  });
}

// ============================================================================
// REPORTE FINAL
// ============================================================================
console.log('\n' + '='.repeat(80));
if (erroresEncontrados.length === 0) {
  console.log('✅ VALIDACIÓN EXITOSA - Sin errores detectados');
  console.log('\n   El tema está listo para carga a BD');
  process.exit(0);
} else {
  console.log(`❌ VALIDACIÓN FALLIDA - ${erroresEncontrados.length} error(es) detectado(s)\n`);
  erroresEncontrados.forEach((error, i) => {
    console.log(`   ${i + 1}. ${error}`);
  });
  console.log('\n   Corrija los errores antes de continuar con la carga');
  process.exit(1);
}

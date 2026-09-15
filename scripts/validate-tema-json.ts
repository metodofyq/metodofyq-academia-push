#!/usr/bin/env tsx
/**
 * Script para validar que los JSONs de un tema están en formato correcto
 *
 * Uso:
 *   npx tsx scripts/validate-tema-json.ts <TEMA-XX>
 *
 * Ejemplo:
 *   npx tsx scripts/validate-tema-json.ts TEMA-02
 */

import * as fs from "fs";
import * as path from "path";

interface ValidationError {
  file: string;
  errors: string[];
}

const validationErrors: ValidationError[] = [];

function validateN25(data: any, filename: string) {
  const errors: string[] = [];

  if (!data.tema) errors.push("Falta campo 'tema'");
  if (data.nivel !== "2.5") errors.push("Campo 'nivel' debe ser '2.5'");
  if (!Array.isArray(data.flashcards)) errors.push("'flashcards' debe ser array");

  if (Array.isArray(data.flashcards)) {
    data.flashcards.forEach((card: any, idx: number) => {
      if (!card.id) errors.push(`Flashcard ${idx}: falta 'id'`);
      if (!card.apartado) errors.push(`Flashcard ${idx}: falta 'apartado'`);
      if (!card.subapartado) errors.push(`Flashcard ${idx}: falta 'subapartado'`);
      if (!card.pregunta) errors.push(`Flashcard ${idx}: falta 'pregunta'`);
      if (!card.respuesta) errors.push(`Flashcard ${idx}: falta 'respuesta'`);

      const respuestaWords = (card.respuesta || "").split(/\s+/).length;
      if (respuestaWords > 30) {
        errors.push(`Flashcard ${idx}: respuesta demasiado larga (${respuestaWords} palabras, máx 30)`);
      }
    });
  }

  if (errors.length > 0) {
    validationErrors.push({ file: filename, errors });
  }

  return errors.length === 0;
}

function validateN35(data: any, filename: string) {
  const errors: string[] = [];

  if (!data.tema) errors.push("Falta campo 'tema'");
  if (data.nivel !== "3.5") errors.push("Campo 'nivel' debe ser '3.5'");
  if (!Array.isArray(data.flashcards)) errors.push("'flashcards' debe ser array");

  if (Array.isArray(data.flashcards)) {
    data.flashcards.forEach((card: any, idx: number) => {
      if (!card.id) errors.push(`Flashcard ${idx}: falta 'id'`);
      if (!card.apartado) errors.push(`Flashcard ${idx}: falta 'apartado'`);
      if (!card.subapartado) errors.push(`Flashcard ${idx}: falta 'subapartado'`);
      if (!card.pregunta) errors.push(`Flashcard ${idx}: falta 'pregunta'`);
      if (!card.respuesta) errors.push(`Flashcard ${idx}: falta 'respuesta'`);

      const pregunta = card.pregunta || "";
      const validStarts = ["Explica", "Justifica", "Analiza", "Compara", "Deduce"];
      if (!validStarts.some((v) => pregunta.startsWith(v))) {
        errors.push(
          `Flashcard ${idx}: pregunta debe comenzar con: ${validStarts.join(", ")}`
        );
      }

      const respuestaWords = (card.respuesta || "").split(/\s+/).length;
      if (respuestaWords < 30 || respuestaWords > 70) {
        errors.push(
          `Flashcard ${idx}: respuesta debe tener 30-70 palabras (tiene ${respuestaWords})`
        );
      }
    });
  }

  if (errors.length > 0) {
    validationErrors.push({ file: filename, errors });
  }

  return errors.length === 0;
}

function validatePropuestaDistactica(data: any, filename: string) {
  const errors: string[] = [];

  if (!data.tema) errors.push("Falta campo 'tema'");
  if (!data.lectura) errors.push("Falta campo 'lectura'");
  if (!data.actividad) errors.push("Falta campo 'actividad'");
  if (!data.dinamica) errors.push("Falta campo 'dinamica'");

  if (errors.length > 0) {
    validationErrors.push({ file: filename, errors });
  }

  return errors.length === 0;
}

function validateLegislacion(data: any, filename: string) {
  const errors: string[] = [];

  if (!data.tema) errors.push("Falta campo 'tema'");
  if (data.nivel !== 4) errors.push("Campo 'nivel' debe ser 4");
  if (!Array.isArray(data.registros)) errors.push("'registros' debe ser array");

  const expectedCCAA = ["Aragón", "Castilla y León", "Valencia", "Navarra", "La Rioja"];

  if (Array.isArray(data.registros)) {
    const foundCCAA = new Set<string>();

    data.registros.forEach((reg: any, idx: number) => {
      if (!reg.ccaa) errors.push(`Registro ${idx}: falta 'ccaa'`);
      if (!reg.titulo) errors.push(`Registro ${idx}: falta 'titulo'`);
      if (!reg.contenido) errors.push(`Registro ${idx}: falta 'contenido'`);

      if (reg.ccaa) foundCCAA.add(reg.ccaa);
    });

    // Verificar que estén todas las CCAA
    expectedCCAA.forEach((ccaa) => {
      if (!foundCCAA.has(ccaa)) {
        errors.push(`Falta legislación para CCAA: ${ccaa}`);
      }
    });
  }

  if (errors.length > 0) {
    validationErrors.push({ file: filename, errors });
  }

  return errors.length === 0;
}

function validateTema(temaCode: string) {
  console.log(`\n🔍 Validando ${temaCode}...\n`);

  const dataDir = "scripts/data";
  const temaNormalized = temaCode.toLowerCase();
  const files = {
    n25: path.join(dataDir, `${temaNormalized}-nivel25.json`),
    n35: path.join(dataDir, `${temaNormalized}-nivel35.json`),
    propuesta: path.join(dataDir, `${temaNormalized}-propuesta-didactica.json`),
    legislacion: path.join(dataDir, `${temaNormalized}-legislacion.json`),
  };

  let validCount = 0;

  // Validar N2.5
  if (fs.existsSync(files.n25)) {
    try {
      const data = JSON.parse(fs.readFileSync(files.n25, "utf-8"));
      const isValid = validateN25(data, path.basename(files.n25));
      console.log(`${isValid ? "✅" : "❌"} N2.5: ${data.flashcards?.length || 0} flashcards`);
      if (isValid) validCount++;
    } catch (e) {
      console.log(`❌ N2.5: Error JSON - ${(e as Error).message}`);
      validationErrors.push({
        file: path.basename(files.n25),
        errors: [`JSON inválido: ${(e as Error).message}`],
      });
    }
  } else {
    console.log(`⚠️  N2.5: Archivo no encontrado`);
  }

  // Validar N3.5
  if (fs.existsSync(files.n35)) {
    try {
      const data = JSON.parse(fs.readFileSync(files.n35, "utf-8"));
      const isValid = validateN35(data, path.basename(files.n35));
      console.log(`${isValid ? "✅" : "❌"} N3.5: ${data.flashcards?.length || 0} flashcards`);
      if (isValid) validCount++;
    } catch (e) {
      console.log(`❌ N3.5: Error JSON - ${(e as Error).message}`);
      validationErrors.push({
        file: path.basename(files.n35),
        errors: [`JSON inválido: ${(e as Error).message}`],
      });
    }
  } else {
    console.log(`⚠️  N3.5: Archivo no encontrado`);
  }

  // Validar Propuesta didáctica
  if (fs.existsSync(files.propuesta)) {
    try {
      const data = JSON.parse(fs.readFileSync(files.propuesta, "utf-8"));
      const isValid = validatePropuestaDistactica(data, path.basename(files.propuesta));
      console.log(`${isValid ? "✅" : "❌"} Propuesta didáctica`);
      if (isValid) validCount++;
    } catch (e) {
      console.log(`❌ Propuesta didáctica: Error JSON - ${(e as Error).message}`);
      validationErrors.push({
        file: path.basename(files.propuesta),
        errors: [`JSON inválido: ${(e as Error).message}`],
      });
    }
  } else {
    console.log(`⚠️  Propuesta didáctica: Archivo no encontrado`);
  }

  // Validar Legislación
  if (fs.existsSync(files.legislacion)) {
    try {
      const data = JSON.parse(fs.readFileSync(files.legislacion, "utf-8"));
      const isValid = validateLegislacion(data, path.basename(files.legislacion));
      console.log(`${isValid ? "✅" : "❌"} Legislación: ${data.registros?.length || 0} CCAA`);
      if (isValid) validCount++;
    } catch (e) {
      console.log(`❌ Legislación: Error JSON - ${(e as Error).message}`);
      validationErrors.push({
        file: path.basename(files.legislacion),
        errors: [`JSON inválido: ${(e as Error).message}`],
      });
    }
  } else {
    console.log(`⚠️  Legislación: Archivo no encontrado`);
  }

  // Resumen
  console.log("\n" + "=".repeat(60));
  if (validationErrors.length === 0) {
    console.log(`✅ VALIDACIÓN EXITOSA (${validCount}/4 archivos válidos)`);
  } else {
    console.log(`❌ ERRORES ENCONTRADOS:\n`);
    validationErrors.forEach((err) => {
      console.log(`📄 ${err.file}:`);
      err.errors.forEach((e) => console.log(`   • ${e}`));
    });
  }
  console.log("=".repeat(60));

  return validationErrors.length === 0;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
✓ VALIDAR TEMA - Script de Verificación JSON

Uso:
  npx tsx scripts/validate-tema-json.ts <TEMA-XX>

Ejemplo:
  npx tsx scripts/validate-tema-json.ts TEMA-02

Verifica:
  ✓ Formato JSON válido
  ✓ Campos requeridos
  ✓ Número de flashcards
  ✓ Longitud de respuestas
  ✓ Tipo de preguntas (N3.5)
  ✓ Todas las CCAA (Legislación)
    `);
    process.exit(0);
  }

  const temaCode = args[0].toUpperCase();
  const isValid = validateTema(temaCode);
  process.exit(isValid ? 0 : 1);
}

main();

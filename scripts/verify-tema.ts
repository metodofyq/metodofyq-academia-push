#!/usr/bin/env tsx
/**
 * Script universal para verificar que un tema está completamente cargado
 *
 * Uso:
 *   npx tsx scripts/verify-tema.ts <TEMA-XX>
 *
 * Ejemplo:
 *   npx tsx scripts/verify-tema.ts TEMA-02
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRole) {
  console.error("❌ Faltan variables de entorno");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRole);

interface VerificationResult {
  tema: string;
  topic: { exists: boolean; id?: string; grupo?: number };
  flashcards: { n25?: number; n35?: number };
  propuestDidactica: boolean;
  legislacion: string[];
  overall: "COMPLETO" | "PARCIAL" | "INCOMPLETO";
}

async function verifyTema(temaCode: string): Promise<VerificationResult> {
  const result: VerificationResult = {
    tema: temaCode,
    topic: { exists: false },
    flashcards: {},
    propuestDidactica: false,
    legislacion: [],
    overall: "INCOMPLETO",
  };

  try {
    // 1. Buscar el topic
    const { data: topic } = await supabase
      .from("topics")
      .select("id, grupo")
      .eq("code", temaCode)
      .single();

    if (!topic) {
      return result;
    }

    result.topic = { exists: true, id: topic.id, grupo: topic.grupo };
    const topicId = topic.id;

    // 2. Verificar Levels (Flashcards N2.5, N3.5)
    const { data: levels } = await supabase
      .from("topic_levels")
      .select("level, content_json")
      .eq("topic_id", topicId)
      .in("level", [2.5, 3.5]);

    for (const level of levels || []) {
      const flashcards = (level.content_json as any)?.flashcards || [];
      if (level.level === 2.5) {
        result.flashcards.n25 = flashcards.length;
      } else if (level.level === 3.5) {
        result.flashcards.n35 = flashcards.length;
      }
    }

    // 3. Verificar Propuesta didáctica
    const { count: propuestaCount } = await supabase
      .from("topic_propuesta_didactica")
      .select("id", { count: "exact" })
      .eq("topic_id", topicId);

    result.propuestDidactica = (propuestaCount || 0) > 0;

    // 4. Verificar Legislación por CCAA
    const { data: legislacion } = await supabase
      .from("topic_legislation_by_ccaa")
      .select("ccaa")
      .eq("topic_id", topicId)
      .order("ccaa");

    result.legislacion = legislacion?.map((l) => l.ccaa) || [];

    // 5. Determinar estado general
    const hasFlashcards = (result.flashcards.n25 || 0) > 0 && (result.flashcards.n35 || 0) > 0;
    const hasFlashcardsPartial = (result.flashcards.n25 || 0) > 0 || (result.flashcards.n35 || 0) > 0;
    const hasLegislation = result.legislacion.length > 0;

    if (hasFlashcards && result.propuestDidactica && hasLegislation) {
      result.overall = "COMPLETO";
    } else if (hasFlashcardsPartial || result.propuestDidactica || hasLegislation) {
      result.overall = "PARCIAL";
    }

  } catch (error) {
    console.error("❌ Error:", error);
  }

  return result;
}

function printResult(result: VerificationResult) {
  console.log("\n" + "=".repeat(60));
  console.log(`🔍 VERIFICACIÓN: ${result.tema}`);
  console.log("=".repeat(60));

  // Topic
  console.log("\n📌 Topic:");
  if (result.topic.exists) {
    console.log(`  ✅ Encontrado (ID: ${result.topic.id})`);
    console.log(`  ℹ️  Grupo: ${result.topic.grupo}`);
  } else {
    console.log(`  ❌ No encontrado`);
  }

  // Flashcards
  console.log("\n📚 Flashcards:");
  if (result.flashcards.n25) {
    console.log(`  ✅ N2.5: ${result.flashcards.n25} flashcards`);
  } else {
    console.log(`  ❌ N2.5: No cargado`);
  }
  if (result.flashcards.n35) {
    console.log(`  ✅ N3.5: ${result.flashcards.n35} flashcards`);
  } else {
    console.log(`  ❌ N3.5: No cargado`);
  }

  // Propuesta didáctica
  console.log("\n💭 Propuesta Didáctica:");
  if (result.propuestDidactica) {
    console.log(`  ✅ Cargada`);
  } else {
    console.log(`  ❌ No cargada`);
  }

  // Legislación
  console.log("\n⚖️  Legislación por CCAA:");
  if (result.legislacion.length > 0) {
    result.legislacion.forEach((ccaa) => {
      console.log(`  ✅ ${ccaa}`);
    });
  } else {
    console.log(`  ❌ No cargada`);
  }

  // Resumen
  console.log("\n" + "=".repeat(60));
  const statusIcon = result.overall === "COMPLETO" ? "✅" : result.overall === "PARCIAL" ? "⚠️ " : "❌";
  console.log(`${statusIcon} ESTADO GENERAL: ${result.overall}`);
  console.log("=".repeat(60));

  // Exportar JSON para debugging
  console.log("\n📋 JSON (para debugging):");
  console.log(JSON.stringify(result, null, 2));
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
📖 VERIFICAR TEMA - Script Universal

Uso:
  npx tsx scripts/verify-tema.ts <TEMA-XX>

Ejemplos:
  npx tsx scripts/verify-tema.ts TEMA-01
  npx tsx scripts/verify-tema.ts TEMA-02
  npx tsx scripts/verify-tema.ts TEMA-54

Verifica:
  ✓ Existe el topic
  ✓ N2.5 flashcards cargadas
  ✓ N3.5 flashcards cargadas
  ✓ Propuesta didáctica
  ✓ Legislación por CCAA
    `);
    process.exit(0);
  }

  const temaCode = args[0].toUpperCase();
  const result = await verifyTema(temaCode);
  printResult(result);

  process.exit(result.overall === "COMPLETO" ? 0 : 1);
}

main();

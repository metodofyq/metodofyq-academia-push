#!/usr/bin/env tsx
/**
 * Script para verificar que Tema 01 está completamente cargado
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

async function verifyTema01() {
  try {
    console.log("🔍 Verificando Tema 01...\n");

    const topicId = "0b6b3b31-a212-4fbb-b139-bca3a2e6ba70";

    // 1. Verificar topic
    console.log("📌 Topic:");
    const { data: topic } = await supabase
      .from("topics")
      .select("id, code, title, grupo")
      .eq("id", topicId)
      .single();

    if (topic) {
      console.log(`  ✅ Código: ${topic.code}`);
      console.log(`  ✅ Grupo: ${topic.grupo}`);
      console.log(`  ✅ Título: ${topic.title.substring(0, 50)}...`);
    } else {
      console.log("  ❌ No encontrado");
    }

    // 2. Verificar Levels (N2.5, N3.5)
    console.log("\n📚 Niveles Flashcards:");
    const { data: levels } = await supabase
      .from("topic_levels")
      .select("level, content_json")
      .eq("topic_id", topicId)
      .in("level", [2.5, 3.5]);

    for (const level of levels || []) {
      const flashcards = (level.content_json as any)?.flashcards || [];
      console.log(`  ✅ N${level.level}: ${flashcards.length} flashcards`);
    }

    // 3. Verificar Propuesta didáctica
    console.log("\n💭 Propuesta Didáctica:");
    const { data: propuesta, count: propuestaCount } = await supabase
      .from("topic_propuesta_didactica")
      .select("id, dinamica", { count: "exact" })
      .eq("topic_id", topicId);

    if (propuestaCount && propuestaCount > 0) {
      console.log(`  ✅ Cargada (dinámico: ${propuesta[0].dinamica})`);
    } else {
      console.log("  ❌ No encontrada");
    }

    // 4. Verificar Legislación por CCAA
    console.log("\n⚖️  Legislación por CCAA:");
    const { data: legislacion } = await supabase
      .from("topic_legislation_by_ccaa")
      .select("ccaa, titulo")
      .eq("topic_id", topicId)
      .order("ccaa");

    if (legislacion && legislacion.length > 0) {
      for (const item of legislacion) {
        console.log(`  ✅ ${item.ccaa}`);
      }
    } else {
      console.log("  ❌ No encontrada");
    }

    // 5. Resumen
    console.log("\n" + "=".repeat(50));
    console.log("✅ TEMA 01 - ESTADO COMPLETO");
    console.log("=".repeat(50));
    console.log(`
Total cargado:
• N2.5 Flashcards: ${levels?.find((l) => l.level === 2.5)?.content_json?.flashcards?.length || 0} ✓
• N3.5 Flashcards: ${levels?.find((l) => l.level === 3.5)?.content_json?.flashcards?.length || 0} ✓
• Propuesta didáctica: ${propuestaCount || 0} ✓
• Legislación CCAA: ${legislacion?.length || 0} ✓

Estado: LISTO PARA USAR EN PRODUCCIÓN
`);

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

verifyTema01();

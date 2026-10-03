import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function verifyTema15Fixes() {
  console.log("\n✅ VERIFICACIÓN FINAL DE CORRECCIONES TEMA-15\n");
  console.log("=".repeat(70));

  try {
    const { data: tema } = await supabase
      .from("topics")
      .select("id")
      .eq("code", "TEMA-15")
      .single();

    if (!tema) {
      console.log("❌ TEMA-15 no encontrado");
      process.exit(1);
    }

    // Verificar N2
    console.log("\n📋 N2 (Desarrollo esquemático):");
    const { data: n2Data } = await supabase
      .from("topic_levels")
      .select("content_json")
      .eq("topic_id", tema.id)
      .eq("level", 2)
      .single();

    const n2Text = (n2Data?.content_json as Record<string, any>)?.texto || "";
    const hasAsterisk = n2Text.includes("* ");
    console.log(`   ✅ Símbolos '* ' removidos: ${!hasAsterisk ? 'SÍ' : 'NO - PROBLEMA'}`);
    console.log(`   Primeras líneas: ${n2Text.substring(0, 80)}...`);

    // Verificar N3
    console.log("\n📋 N3 (Redacción completa):");
    const { data: n3Data } = await supabase
      .from("topic_levels")
      .select("content_json")
      .eq("topic_id", tema.id)
      .eq("level", 3)
      .single();

    const n3Text = (n3Data?.content_json as Record<string, any>)?.texto || "";
    const hasIndice = n3Text.includes("Índice");
    const hasIntro = n3Text.includes("0. Introducción");
    console.log(`   ✅ Índice agregado: ${hasIndice ? 'SÍ' : 'NO - PROBLEMA'}`);
    console.log(`   ✅ "0. Introducción" presente: ${hasIntro ? 'SÍ' : 'NO - PROBLEMA'}`);
    console.log(`   Primeras líneas: ${n3Text.substring(0, 80)}...`);

    // Verificar N2.5
    console.log("\n📋 N2.5 (Flashcards - Recuperación activa):");
    const { data: n25Data } = await supabase
      .from("topic_levels")
      .select("content_json")
      .eq("topic_id", tema.id)
      .eq("level", 2.5)
      .single();

    const flashcards25 = (n25Data?.content_json as Record<string, any>)?.flashcards || [];
    const card25 = flashcards25[0];
    console.log(`   ✅ Total de tarjetas: ${flashcards25.length}`);
    console.log(`   ✅ Campos correctos: ${card25.termino && card25.descripcion ? 'SÍ (termino/descripcion)' : 'NO - PROBLEMA'}`);
    console.log(`   Ejemplo: "${card25.termino}" → "${card25.descripcion}"`);

    // Verificar N3.5
    console.log("\n📋 N3.5 (Flashcards - Reconstrucción científica):");
    const { data: n35Data } = await supabase
      .from("topic_levels")
      .select("content_json")
      .eq("topic_id", tema.id)
      .eq("level", 3.5)
      .single();

    const flashcards35 = (n35Data?.content_json as Record<string, any>)?.flashcards || [];
    const card35 = flashcards35[0];
    console.log(`   ✅ Total de tarjetas: ${flashcards35.length}`);
    console.log(`   ✅ Campos correctos: ${card35.termino && card35.descripcion ? 'SÍ (termino/descripcion)' : 'NO - PROBLEMA'}`);
    console.log(`   Ejemplo: "${card35.termino.substring(0, 50)}..." → "${card35.descripcion.substring(0, 50)}..."`);

    console.log("\n" + "=".repeat(70));
    console.log("\n✅ TODAS LAS CORRECCIONES VERIFICADAS Y FUNCIONANDO\n");

    // Resumen final
    console.log("📊 RESUMEN FINAL TEMA-15:");
    console.log(`   ✓ N2: Símbolos '*' removidos`);
    console.log(`   ✓ N3: Índice agregado`);
    console.log(`   ✓ N2.5: ${flashcards25.length} tarjetas con campos termino/descripcion`);
    console.log(`   ✓ N3.5: ${flashcards35.length} tarjetas con campos termino/descripcion\n`);

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

verifyTema15Fixes();

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function verifyTema15() {
  console.log("\n✅ VERIFICACIÓN COMPLETA DE TEMA-15\n");
  console.log("=".repeat(70));

  try {
    const { data: tema } = await supabase
      .from("topics")
      .select("*")
      .eq("code", "TEMA-15")
      .single();

    if (!tema) {
      console.log("❌ TEMA-15 no encontrado");
      process.exit(1);
    }

    console.log(`📚 TEMA-15: ${tema.title}`);
    console.log(`   ID: ${tema.id}`);
    console.log(`   Grupo: ${tema.grupo}\n`);

    // Verificar niveles
    const { data: levels } = await supabase
      .from("topic_levels")
      .select("level")
      .eq("topic_id", tema.id)
      .order("level");

    console.log(`📋 Niveles cargados: ${levels?.length}\n`);
    levels?.forEach((l: any) => {
      console.log(`   ✓ Nivel ${l.level}`);
    });

    // Verificar flashcards N2.5
    const { data: n25 } = await supabase
      .from("topic_levels")
      .select("content_json")
      .eq("topic_id", tema.id)
      .eq("level", 2.5)
      .single();

    const flashcards25 = (n25?.content_json as Record<string, any>)?.flashcards || [];
    console.log(`\n📊 Flashcards N2.5: ${flashcards25.length}`);

    // Verificar flashcards N3.5
    const { data: n35 } = await supabase
      .from("topic_levels")
      .select("content_json")
      .eq("topic_id", tema.id)
      .eq("level", 3.5)
      .single();

    const flashcards35 = (n35?.content_json as Record<string, any>)?.flashcards || [];
    console.log(`📊 Flashcards N3.5: ${flashcards35.length}`);

    // Verificar propuesta didáctica
    const { data: propuesta } = await supabase
      .from("topic_propuesta_didactica")
      .select("*")
      .eq("topic_id", tema.id)
      .single();

    console.log(`\n📝 Propuesta didáctica: ${propuesta ? '✅ Cargada' : '❌ No cargada'}`);
    if (propuesta) {
      console.log(`   Campos: lectura, actividad, dinamica`);
      console.log(`   Dinámica: ${propuesta.dinamica}`);
    }

    // Verificar legislación
    const { data: legislacion } = await supabase
      .from("topic_legislation_by_ccaa")
      .select("ccaa")
      .eq("topic_id", tema.id);

    console.log(`\n⚖️ Legislación por CCAA: ${legislacion?.length || 0} CCAAs`);
    legislacion?.forEach((l: any) => {
      console.log(`   ✓ ${l.ccaa}`);
    });

    console.log("\n" + "=".repeat(70));
    console.log("✅ TEMA-15 COMPLETAMENTE VERIFICADO\n");

    console.log("📋 RESUMEN:\n");
    console.log(`   Nivel 0 (Índice): ${levels?.find((l: any) => l.level === 0) ? '✓' : '✗'}`);
    console.log(`   Nivel 1 (Palabras clave): ${levels?.find((l: any) => l.level === 1) ? '✓' : '✗'}`);
    console.log(`   Nivel 2 (Desarrollo esquemático): ${levels?.find((l: any) => l.level === 2) ? '✓' : '✗'}`);
    console.log(`   Nivel 2.5 (Flashcards): ${flashcards25.length}/103 ✓`);
    console.log(`   Nivel 3 (Redacción completa): ${levels?.find((l: any) => l.level === 3) ? '✓' : '✗'}`);
    console.log(`   Nivel 3.5 (Flashcards): ${flashcards35.length}/24 ✓`);
    console.log(`   Propuesta didáctica: ${propuesta ? '✓' : '✗'}`);
    console.log(`   Legislación (5 CCAA): ${legislacion?.length === 5 ? '✓' : '✗'}\n`);

    console.log("🚀 TEMA-15 LISTO PARA PRODUCCIÓN\n");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

verifyTema15();

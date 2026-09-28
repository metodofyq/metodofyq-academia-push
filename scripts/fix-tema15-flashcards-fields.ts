import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function fixFlashcardsFields() {
  console.log("\n🔧 CORRIGIENDO CAMPOS DE FLASHCARDS TEMA-15\n");
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

    // Corregir N2.5
    console.log("\n📝 Corrigiendo N2.5...");
    const { data: n25Data } = await supabase
      .from("topic_levels")
      .select("content_json")
      .eq("topic_id", tema.id)
      .eq("level", 2.5)
      .single();

    if (n25Data) {
      const content = n25Data.content_json as Record<string, any>;
      const flashcards = (content.flashcards || []).map((card: any) => ({
        id: card.id,
        apartado: card.apartado,
        subapartado: card.subapartado,
        tipo: "termino",
        termino: card.pregunta,
        descripcion: card.respuesta
      }));

      const updated = { ...content, flashcards };
      await supabase
        .from("topic_levels")
        .update({ content_json: updated })
        .eq("topic_id", tema.id)
        .eq("level", 2.5);

      console.log(`   ✅ N2.5: ${flashcards.length} tarjetas corregidas`);
    }

    // Corregir N3.5
    console.log("\n📝 Corrigiendo N3.5...");
    const { data: n35Data } = await supabase
      .from("topic_levels")
      .select("content_json")
      .eq("topic_id", tema.id)
      .eq("level", 3.5)
      .single();

    if (n35Data) {
      const content = n35Data.content_json as Record<string, any>;
      const flashcards = (content.flashcards || []).map((card: any) => ({
        id: card.id,
        apartado: card.apartado,
        subapartado: card.subapartado,
        tipo: "reconstruccion",
        termino: card.pregunta,
        descripcion: card.respuesta
      }));

      const updated = { ...content, flashcards };
      await supabase
        .from("topic_levels")
        .update({ content_json: updated })
        .eq("topic_id", tema.id)
        .eq("level", 3.5);

      console.log(`   ✅ N3.5: ${flashcards.length} tarjetas corregidas`);
    }

    console.log("\n" + "=".repeat(70));
    console.log("✅ CAMPOS DE FLASHCARDS CORREGIDOS\n");

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

fixFlashcardsFields();

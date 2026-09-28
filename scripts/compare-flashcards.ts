import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function compareFlashcards() {
  console.log("\n🔍 COMPARANDO ESTRUCTURA DE FLASHCARDS\n");
  console.log("=".repeat(70));

  try {
    // TEMA-50 (funciona correctamente)
    const { data: tema50 } = await supabase
      .from("topics")
      .select("id")
      .eq("code", "TEMA-50")
      .single();

    const { data: t50n25 } = await supabase
      .from("topic_levels")
      .select("content_json")
      .eq("topic_id", tema50.id)
      .eq("level", 2.5)
      .single();

    const card50 = ((t50n25?.content_json as Record<string, any>)?.flashcards || [])[0];
    console.log("\n📌 TEMA-50 N2.5 (funciona):");
    console.log(`   Campos: ${Object.keys(card50).join(", ")}`);
    console.log(`   Contenido: ${card50.termino || card50.pregunta} / ${card50.descripcion || card50.respuesta}`);

    // TEMA-15 (problema)
    const { data: tema15 } = await supabase
      .from("topics")
      .select("id")
      .eq("code", "TEMA-15")
      .single();

    const { data: t15n25 } = await supabase
      .from("topic_levels")
      .select("content_json")
      .eq("topic_id", tema15.id)
      .eq("level", 2.5)
      .single();

    const card15 = ((t15n25?.content_json as Record<string, any>)?.flashcards || [])[0];
    console.log("\n❌ TEMA-15 N2.5 (problema):");
    console.log(`   Campos: ${Object.keys(card15).join(", ")}`);
    console.log(`   Contenido: ${card15.termino || card15.pregunta} / ${card15.descripcion || card15.respuesta}`);

    console.log("\n" + "=".repeat(70));
    console.log("\n🔧 SOLUCIÓN: Renombrar campos pregunta/respuesta → termino/descripcion\n");

  } catch (error) {
    console.error("Error:", error);
  }
}

compareFlashcards();

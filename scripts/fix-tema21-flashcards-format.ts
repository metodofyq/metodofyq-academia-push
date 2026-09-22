import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseServiceRole!);

async function fixFlashcardsFormat() {
  console.log("🔧 Transformando formato de flashcards (pregunta/respuesta → termino/descripcion)...\n");

  try {
    const { data: tema } = await supabase
      .from("topics")
      .select("id")
      .eq("code", "TEMA-21")
      .single();

    if (!tema) {
      console.log("❌ TEMA-21 no encontrado");
      process.exit(1);
    }

    // Obtener N2.5 y N3.5
    const { data: levels } = await supabase
      .from("topic_levels")
      .select("*")
      .eq("topic_id", tema.id)
      .in("level", [2.5, 3.5]);

    if (!levels) {
      console.log("❌ Niveles no encontrados");
      process.exit(1);
    }

    for (const level of levels) {
      const content = level.content_json as Record<string, any>;
      const flashcards = content.flashcards || [];

      if (flashcards.length === 0) {
        console.log(`⚠️  Nivel ${level.level}: Sin flashcards`);
        continue;
      }

      // Transformar: pregunta → termino, respuesta → descripcion
      const transformed = flashcards.map((card: any) => ({
        id: card.id ? String(card.id) : undefined,
        apartado: card.apartado,
        subapartado: card.subapartado,
        termino: card.pregunta || card.termino,
        descripcion: card.respuesta || card.descripcion,
      }));

      const updatedContent = {
        ...content,
        flashcards: transformed,
      };

      const { error } = await supabase
        .from("topic_levels")
        .update({ content_json: updatedContent })
        .eq("id", level.id);

      if (error) {
        console.error(`❌ Error en Nivel ${level.level}:`, error.message);
        process.exit(1);
      }

      console.log(`✅ Nivel ${level.level}: ${flashcards.length} flashcards transformadas`);
    }

    console.log("\n✅ Transformación completada");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

fixFlashcardsFormat();

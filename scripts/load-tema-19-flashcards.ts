import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseServiceRole!);

async function loadFlashcards(filePath: string, nivel: number) {
  console.log(`\n📚 Cargando flashcards N${nivel} desde ${path.basename(filePath)}...`);

  try {
    const rawData = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(rawData);

    const { data: tema } = await supabase
      .from("topics")
      .select("id")
      .eq("code", "TEMA-19")
      .single();

    if (!tema) {
      console.log("❌ TEMA-19 no encontrado");
      process.exit(1);
    }

    const { data: levelData } = await supabase
      .from("topic_levels")
      .select("content_json")
      .eq("topic_id", tema.id)
      .eq("level", nivel)
      .single();

    if (!levelData) {
      console.log(`❌ Nivel ${nivel} no encontrado`);
      process.exit(1);
    }

    const content = levelData.content_json as Record<string, any>;
    const flashcards = data.flashcards || [];

    // Transformar: asegurar que tienen campos termino/descripcion
    const transformed = flashcards.map((card: any) => ({
      id: card.id ? String(card.id) : undefined,
      apartado: card.apartado,
      subapartado: card.subapartado,
      termino: card.termino || card.pregunta,
      descripcion: card.descripcion || card.respuesta,
    }));

    const updatedContent = {
      ...content,
      flashcards: transformed,
    };

    const { error } = await supabase
      .from("topic_levels")
      .update({ content_json: updatedContent })
      .eq("topic_id", tema.id)
      .eq("level", nivel);

    if (error) {
      console.error(`❌ Error:`, error.message);
      process.exit(1);
    }

    console.log(`✅ N${nivel}: ${flashcards.length} flashcards cargadas correctamente`);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

async function main() {
  console.log("🎓 Cargando flashcards para TEMA-19...");

  await loadFlashcards(
    path.join(__dirname, "data", "tema-19-nivel25.json"),
    2.5
  );

  await loadFlashcards(
    path.join(__dirname, "data", "tema-19-nivel35.json"),
    3.5
  );

  console.log("\n✅ Todas las flashcards cargadas correctamente");
}

main().catch((error) => {
  console.error("❌ Error fatal:", error);
  process.exit(1);
});

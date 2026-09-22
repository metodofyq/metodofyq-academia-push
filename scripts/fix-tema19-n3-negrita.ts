import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseServiceRole!);

async function fixN3Negrita() {
  console.log("🔧 Añadiendo negrita a títulos en N3...\n");

  try {
    const { data: tema } = await supabase
      .from("topics")
      .select("id")
      .eq("code", "TEMA-19")
      .single();

    if (!tema) {
      console.log("❌ TEMA-19 no encontrado");
      process.exit(1);
    }

    const { data: n3Level } = await supabase
      .from("topic_levels")
      .select("content_json")
      .eq("topic_id", tema.id)
      .eq("level", 3)
      .single();

    if (!n3Level) {
      console.log("❌ Nivel 3 no encontrado");
      process.exit(1);
    }

    const content = n3Level.content_json as Record<string, any>;
    let texto = content.texto || "";

    // Agregar negrita a todos los títulos (## y ###)
    texto = texto.replace(/^(##+ )(.+?)$/gm, (match, hashes, title) => {
      return `${hashes}**${title}**`;
    });

    const updatedContent = {
      ...content,
      texto: texto,
      "texto-fantasma": texto,
    };

    const { error } = await supabase
      .from("topic_levels")
      .update({ content_json: updatedContent })
      .eq("topic_id", tema.id)
      .eq("level", 3);

    if (error) {
      console.error("❌ Error:", error.message);
      process.exit(1);
    }

    console.log("✅ N3 actualizado: títulos en negrita");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

fixN3Negrita();

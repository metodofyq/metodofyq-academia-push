import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseServiceRole!);

async function fixN2Guiones() {
  console.log("🔧 Eliminando guiones duplicados en N2...\n");

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

    const { data: n2Level } = await supabase
      .from("topic_levels")
      .select("content_json")
      .eq("topic_id", tema.id)
      .eq("level", 2)
      .single();

    if (!n2Level) {
      console.log("❌ Nivel 2 no encontrado");
      process.exit(1);
    }

    const content = n2Level.content_json as Record<string, any>;
    let texto = content.texto || "";

    // Eliminar guiones duplicados: "-\n- " → "- "
    // Esto ocurre cuando hay un patrón de guión con salto de línea seguido de otro guión
    texto = texto.replace(/-\n- /g, "- ");

    const updatedContent = {
      ...content,
      texto: texto,
    };

    const { error } = await supabase
      .from("topic_levels")
      .update({ content_json: updatedContent })
      .eq("topic_id", tema.id)
      .eq("level", 2);

    if (error) {
      console.error("❌ Error:", error.message);
      process.exit(1);
    }

    console.log("✅ N2 actualizado: guiones duplicados eliminados");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

fixN2Guiones();

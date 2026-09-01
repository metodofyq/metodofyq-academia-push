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

async function main() {
  try {
    // Buscar Tema 50 y 54
    const { data: topics, error: topicsError } = await supabase
      .from("topics")
      .select("id, code, title")
      .in("code", ["TEMA-50", "TEMA-54"]);

    if (topicsError) {
      console.error("❌ Error buscando temas:", topicsError);
      process.exit(1);
    }

    if (!topics || topics.length === 0) {
      console.error("❌ No se encontraron Tema 50 ni Tema 54");
      process.exit(1);
    }

    for (const topic of topics) {
      console.log(`\n📚 ${topic.code} (${topic.id})`);
      console.log(`   Título: ${topic.title}`);

      // Obtener los niveles
      const { data: levels, error: levelsError } = await supabase
        .from("topic_levels")
        .select("level, title, content_json")
        .eq("topic_id", topic.id)
        .order("level");

      if (levelsError) {
        console.error(`   ❌ Error cargando niveles: ${levelsError.message}`);
        continue;
      }

      if (!levels || levels.length === 0) {
        console.log(`   ⚠️  No hay niveles cargados`);
        continue;
      }

      for (const level of levels) {
        const hasContent = level.content_json && Object.keys(level.content_json).length > 0;
        const contentKeys = hasContent ? Object.keys(level.content_json).join(", ") : "vacío";
        console.log(`   Nivel ${level.level}: "${level.title}" (${hasContent ? "✅" : "❌"} content_json: ${contentKeys})`);

        if (hasContent) {
          // Inspeccionar la estructura
          const content = level.content_json as Record<string, any>;
          if (content.tipo) console.log(`      └─ tipo: ${content.tipo}`);
          if (content.estructura) console.log(`      └─ estructura: ${typeof content.estructura} (${content.estructura?.length || 0} chars)`);
          if (content.keywords) console.log(`      └─ keywords: array de ${Array.isArray(content.keywords) ? content.keywords.length : "?"} items`);
          if (content.apartados) console.log(`      └─ apartados: array de ${Array.isArray(content.apartados) ? content.apartados.length : "?"} items`);
          if (content.texto) console.log(`      └─ texto: ${typeof content.texto} (${content.texto?.length || 0} chars)`);
          if (content.flashcards) console.log(`      └─ flashcards: array de ${Array.isArray(content.flashcards) ? content.flashcards.length : "?"} items`);
        }
      }
    }

    console.log("\n✅ Inspección completada");
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

main();

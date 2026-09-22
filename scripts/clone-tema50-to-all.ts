import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseServiceRole!);

async function cloneAll() {
  console.log("🔄 Clonando TEMA-50 a todos los temas sin contenido...\n");

  try {
    // 1. Obtener TEMA-50
    const { data: tema50 } = await supabase
      .from("topics")
      .select("id")
      .eq("code", "TEMA-50")
      .single();

    if (!tema50) {
      console.error("❌ TEMA-50 no encontrado");
      process.exit(1);
    }

    // 2. Obtener niveles de TEMA-50
    const { data: nivelesT50 } = await supabase
      .from("topic_levels")
      .select("level, title, content_json")
      .eq("topic_id", tema50.id)
      .order("level");

    if (!nivelesT50 || nivelesT50.length === 0) {
      console.error("❌ No se encontraron niveles en TEMA-50");
      process.exit(1);
    }

    console.log(`✅ TEMA-50 cargado (${nivelesT50.length} niveles)\n`);

    // 3. Obtener todos los temas sin contenido
    const { data: todosTemas } = await supabase
      .from("topics")
      .select("id, code, title")
      .order("code");

    if (!todosTemas) {
      console.error("❌ Error al obtener temas");
      process.exit(1);
    }

    const temasSinContenido: any[] = [];

    for (const tema of todosTemas) {
      const { data: niveles } = await supabase
        .from("topic_levels")
        .select("id")
        .eq("topic_id", tema.id);

      if (!niveles || niveles.length === 0) {
        temasSinContenido.push(tema);
      }
    }

    console.log(
      `📊 Encontrados: ${temasSinContenido.length} temas sin contenido\n`
    );

    // 4. Clonar TEMA-50 a cada tema sin contenido
    let count = 0;
    for (const tema of temasSinContenido) {
      // Copiar cada nivel
      for (const nivel of nivelesT50) {
        await supabase.from("topic_levels").insert({
          topic_id: tema.id,
          level: nivel.level,
          title: nivel.title,
          content_json: nivel.content_json
        });
      }

      count++;
      if (count % 10 === 0) {
        console.log(`  Progreso: ${count}/${temasSinContenido.length}...`);
      }
    }

    console.log(`\n✅ Clonación completada: ${count} temas`);
    console.log("\n📝 Próximos pasos:");
    console.log("  1. git add scripts/clone-tema50-to-all.ts");
    console.log("  2. git commit -m 'feat: Clonar TEMA-50 a 70 temas sin contenido'");
    console.log("  3. git push");
    console.log("  4. vercel deploy --prod");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

cloneAll();

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function fixAllNivel1() {
  console.log("\n🔧 CORRIGIENDO NIVEL 1 EN TODOS LOS TEMAS\n");
  console.log("=".repeat(70));

  try {
    // Obtener todos los temas
    const { data: temas } = await supabase
      .from("topics")
      .select("id, code");

    if (!temas || temas.length === 0) {
      console.log("❌ No se encontraron temas");
      process.exit(1);
    }

    console.log(`📚 Procesando ${temas.length} temas...\n`);

    let fixed = 0;
    let noApartados = 0;

    for (const tema of temas) {
      const { data: n1Data } = await supabase
        .from("topic_levels")
        .select("content_json")
        .eq("topic_id", tema.id)
        .eq("level", 1)
        .single();

      if (!n1Data) continue;

      const content = n1Data.content_json as Record<string, any>;
      
      // Si ya tiene keywords, no hacer nada
      if (content.keywords) {
        noApartados++;
        continue;
      }

      const apartados = content.apartados || {};

      // Transformar de apartados (con subapartados) a keywords (plano)
      const keywords: Record<string, string[]> = {};

      for (const [apartado, subapartados] of Object.entries(apartados)) {
        const allKeywords: string[] = [];

        if (typeof subapartados === 'object' && subapartados !== null) {
          // Recorrer todos los subapartados
          for (const palabras of Object.values(subapartados)) {
            if (Array.isArray(palabras)) {
              allKeywords.push(...palabras);
            }
          }
        }

        keywords[apartado] = allKeywords;
      }

      // Actualizar la estructura
      const updated = {
        tipo: "palabras_clave",
        keywords: keywords
      };

      await supabase
        .from("topic_levels")
        .update({ content_json: updated })
        .eq("topic_id", tema.id)
        .eq("level", 1);

      fixed++;
      console.log(`✅ ${tema.code} - N1 Corregido`);
    }

    console.log("\n" + "=".repeat(70));
    console.log(`✨ RESULTADOS:`);
    console.log(`   Corregidos: ${fixed}`);
    console.log(`   Ya tenían keywords: ${noApartados}`);
    console.log(`   Total procesados: ${fixed + noApartados}/${temas.length}`);
    console.log("=".repeat(70) + "\n");

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

fixAllNivel1();

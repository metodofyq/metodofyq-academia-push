import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function fixNivel1() {
  console.log("\n🔧 CORRIGIENDO ESTRUCTURA NIVEL 1 TEMA-15\n");
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

    const { data: n1Data } = await supabase
      .from("topic_levels")
      .select("content_json")
      .eq("topic_id", tema.id)
      .eq("level", 1)
      .single();

    if (!n1Data) {
      console.log("❌ N1 no encontrado");
      process.exit(1);
    }

    const content = n1Data.content_json as Record<string, any>;
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

    console.log("✅ N1 Corregido");
    console.log(`   Apartados: ${Object.keys(keywords).length}`);
    console.log(`   Palabras clave totales: ${Object.values(keywords).reduce((sum, arr) => sum + arr.length, 0)}`);
    
    Object.entries(keywords).slice(0, 3).forEach(([apartado, palabras]) => {
      console.log(`\n   ${apartado}:`);
      console.log(`     - ${palabras.slice(0, 3).join('\n     - ')}`);
    });

    console.log("\n" + "=".repeat(70));
    console.log("✅ NIVEL 1 CORREGIDO\n");

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

fixNivel1();

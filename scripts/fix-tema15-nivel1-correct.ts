import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function fixTema15N1Correct() {
  console.log("\n🔧 CORRIGIENDO TEMA-15 N1 AL FORMATO CORRECTO\n");
  console.log("=".repeat(80));

  try {
    const { data: tema15 } = await supabase
      .from("topics")
      .select("id")
      .eq("code", "TEMA-15")
      .single();

    const { data: n1Data } = await supabase
      .from("topic_levels")
      .select("content_json")
      .eq("topic_id", tema15.id)
      .eq("level", 1)
      .single();

    if (!n1Data) {
      console.log("❌ N1 no encontrado");
      process.exit(1);
    }

    const content = n1Data.content_json as Record<string, any>;
    const apartados = content.apartados || {};

    // Transformar de apartados (con subapartados como arrays) a keywords (strings con ·)
    const keywords: Record<string, string> = {};

    for (const [apartado, subapartados] of Object.entries(apartados)) {
      if (typeof subapartados === 'object' && subapartados !== null) {
        // Recorrer todos los subapartados
        for (const [subapartado, palabras] of Object.entries(subapartados)) {
          if (Array.isArray(palabras)) {
            // Convertir array a string con separador ·
            keywords[subapartado] = palabras.join(" · ");
          }
        }
      }
    }

    // Actualizar la estructura
    const updated = {
      tipo: "palabras_clave",
      keywords: keywords
    };

    await supabase
      .from("topic_levels")
      .update({ content_json: updated })
      .eq("topic_id", tema15.id)
      .eq("level", 1);

    console.log("✅ TEMA-15 N1 Corregido");
    console.log(`   Total subapartados: ${Object.keys(keywords).length}`);
    
    Object.entries(keywords).slice(0, 3).forEach(([subapartado, palabras]) => {
      console.log(`\n   ${subapartado}:`);
      console.log(`     ${palabras.substring(0, 80)}...`);
    });

    console.log("\n" + "=".repeat(80));
    console.log("✅ NIVEL 1 CORREGIDO A FORMATO CORRECTO\n");

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

fixTema15N1Correct();

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function addKeywordsN1() {
  console.log("\n📝 AÑADIENDO PALABRAS CLAVE A 1.3\n");
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

    const content = n1Data.content_json as Record<string, any>;
    const keywords = content.keywords;

    // Nuevas palabras clave para 1.3
    const nuevasPalabras = [
      "Temperatura",
      "Cantidad de sustancia",
      "Naturaleza química",
      "Estado físico",
      "Composición",
      "Grados de libertad"
    ];

    // Actualizar 1.3
    const keywordActual = keywords["1.3. Variables que influyen en la energía interna"];
    const keywordsArray = keywordActual.split(" · ");
    
    // Filtrar duplicados
    const nuevasAñadidas = nuevasPalabras.filter(p => !keywordsArray.includes(p));
    
    if (nuevasAñadidas.length === 0) {
      console.log("ℹ️  Todas las palabras ya existen en 1.3");
    } else {
      keywordsArray.push(...nuevasAñadidas);
      keywords["1.3. Variables que influyen en la energía interna"] = keywordsArray.join(" · ");
      
      await supabase
        .from("topic_levels")
        .update({ content_json: content })
        .eq("topic_id", tema15.id)
        .eq("level", 1);

      console.log(`✅ Añadidas ${nuevasAñadidas.length} palabras clave`);
      console.log(`\n   1.3. Variables que influyen en la energía interna:`);
      console.log(`   ${keywords["1.3. Variables que influyen en la energía interna"]}`);
    }

    console.log("\n" + "=".repeat(80) + "\n");

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

addKeywordsN1();

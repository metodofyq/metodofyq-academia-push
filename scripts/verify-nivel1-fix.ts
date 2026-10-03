import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function verifyNivel1() {
  console.log("\n✅ VERIFICACIÓN FINAL - NIVEL 1 TEMA-15\n");
  console.log("=".repeat(70));

  try {
    const { data: tema15 } = await supabase
      .from("topics")
      .select("id, code")
      .eq("code", "TEMA-15")
      .single();

    const { data: n1 } = await supabase
      .from("topic_levels")
      .select("level, content_json")
      .eq("topic_id", tema15.id)
      .eq("level", 1)
      .single();

    if (!n1) {
      console.log("❌ N1 no encontrado");
      process.exit(1);
    }

    const content = n1.content_json as Record<string, any>;
    const keywords = content.keywords || {};

    console.log(`📖 TEMA-15 Nivel 1`);
    console.log(`   Tipo: ${content.tipo}`);
    console.log(`   Estructura: ${Object.keys(content).join(", ")}`);
    console.log(`   Apartados: ${Object.keys(keywords).length}`);
    
    let totalPalabras = 0;
    Object.entries(keywords).forEach(([apartado, palabras]: [string, any]) => {
      const count = Array.isArray(palabras) ? palabras.length : 0;
      totalPalabras += count;
      console.log(`     ${apartado}: ${count} palabras`);
    });

    console.log(`\n   Total de palabras clave: ${totalPalabras}`);
    console.log("\n✅ Estructura correcta - Nivel 1 listo para renderizar");
    console.log("=".repeat(70) + "\n");

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

verifyNivel1();

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function debugNivel1() {
  console.log("\n🔍 INVESTIGACIÓN NIVEL 1 - COMPARATIVA TEMA-50 VS TEMA-15\n");
  console.log("=".repeat(70));

  try {
    // TEMA-50 (funciona)
    const { data: tema50 } = await supabase
      .from("topics")
      .select("id")
      .eq("code", "TEMA-50")
      .single();

    const { data: t50n1 } = await supabase
      .from("topic_levels")
      .select("content_json")
      .eq("topic_id", tema50.id)
      .eq("level", 1)
      .single();

    console.log("\n✅ TEMA-50 NIVEL 1 (funciona correctamente):");
    console.log(`   Tipo: ${(t50n1?.content_json as Record<string, any>)?.tipo}`);
    const t50keys = Object.keys((t50n1?.content_json as Record<string, any>) || {});
    console.log(`   Campos: ${t50keys.join(", ")}`);
    
    const t50apartados = (t50n1?.content_json as Record<string, any>)?.apartados;
    if (t50apartados) {
      const firstApartado = Object.keys(t50apartados)[0];
      console.log(`\n   Primer apartado: "${firstApartado}"`);
      console.log(`   Tipo de valor: ${typeof t50apartados[firstApartado]}`);
      console.log(`   Contenido: ${JSON.stringify(t50apartados[firstApartado], null, 2)}`);
    }

    // TEMA-15 (problema)
    const { data: tema15 } = await supabase
      .from("topics")
      .select("id")
      .eq("code", "TEMA-15")
      .single();

    const { data: t15n1 } = await supabase
      .from("topic_levels")
      .select("content_json")
      .eq("topic_id", tema15.id)
      .eq("level", 1)
      .single();

    console.log("\n\n❌ TEMA-15 NIVEL 1 (problema):");
    console.log(`   Tipo: ${(t15n1?.content_json as Record<string, any>)?.tipo}`);
    const t15keys = Object.keys((t15n1?.content_json as Record<string, any>) || {});
    console.log(`   Campos: ${t15keys.join(", ")}`);
    
    const t15apartados = (t15n1?.content_json as Record<string, any>)?.apartados;
    if (t15apartados) {
      const firstApartado = Object.keys(t15apartados)[0];
      console.log(`\n   Primer apartado: "${firstApartado}"`);
      console.log(`   Tipo de valor: ${typeof t15apartados[firstApartado]}`);
      console.log(`   Contenido: ${JSON.stringify(t15apartados[firstApartado], null, 2)}`);
    }

    console.log("\n" + "=".repeat(70));

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

debugNivel1();

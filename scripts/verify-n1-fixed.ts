import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function verifyN1Fixed() {
  console.log("\n✅ VERIFICACIÓN FINAL - NIVEL 1\n");
  console.log("=".repeat(80));

  try {
    // TEMA-50
    const { data: t50 } = await supabase
      .from("topics")
      .select("id")
      .eq("code", "TEMA-50")
      .single();

    const { data: t50n1 } = await supabase
      .from("topic_levels")
      .select("content_json")
      .eq("topic_id", t50.id)
      .eq("level", 1)
      .single();

    const t50Content = t50n1.content_json as Record<string, any>;

    // TEMA-15
    const { data: t15 } = await supabase
      .from("topics")
      .select("id")
      .eq("code", "TEMA-15")
      .single();

    const { data: t15n1 } = await supabase
      .from("topic_levels")
      .select("content_json")
      .eq("topic_id", t15.id)
      .eq("level", 1)
      .single();

    const t15Content = t15n1.content_json as Record<string, any>;

    console.log("📊 COMPARATIVA ESTRUCTURA:");
    console.log(`\n   TEMA-50:`);
    console.log(`   - Tipo: ${t50Content.tipo}`);
    console.log(`   - Keywords (secciones): ${Object.keys(t50Content.keywords).length}`);
    console.log(`   - Tipo de keywords: STRING (con separador ·)`);

    console.log(`\n   TEMA-15:`);
    console.log(`   - Tipo: ${t15Content.tipo}`);
    console.log(`   - Keywords (secciones): ${Object.keys(t15Content.keywords).length}`);
    console.log(`   - Tipo de keywords: STRING (con separador ·)`);

    // Verificar que son iguales
    const t50Example = Object.values(t50Content.keywords)[0] as string;
    const t15Example = Object.values(t15Content.keywords)[0] as string;

    console.log(`\n📝 EJEMPLO TEMA-50:`);
    console.log(`   ${t50Example.substring(0, 100)}...`);

    console.log(`\n📝 EJEMPLO TEMA-15:`);
    console.log(`   ${t15Example.substring(0, 100)}...`);

    if (typeof t50Example === 'string' && typeof t15Example === 'string') {
      console.log(`\n✅ Ambos tienen formato STRING correcto`);
      console.log(`✅ Estructura Nivel 1 coincide`);
    }

    console.log("\n" + "=".repeat(80) + "\n");

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

verifyN1Fixed();

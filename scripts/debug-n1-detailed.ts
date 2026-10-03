import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function debugN1Detailed() {
  console.log("\n🔍 ANÁLISIS DETALLADO NIVEL 1 - TEMA-50 vs TEMA-15\n");
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

    console.log("✅ TEMA-50 NIVEL 1 (estructura correcta):");
    console.log("=".repeat(80));
    const t50Content = t50n1.content_json as Record<string, any>;
    console.log(JSON.stringify(t50Content, null, 2));

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

    console.log("\n\n❌ TEMA-15 NIVEL 1 (actualmente):");
    console.log("=".repeat(80));
    const t15Content = t15n1.content_json as Record<string, any>;
    console.log(JSON.stringify(t15Content, null, 2));

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

debugN1Detailed();

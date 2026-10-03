import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseServiceRole!);

async function compare() {
  console.log("🔍 Comparando N0 de TEMA-50 vs TEMA-21...\n");

  try {
    // Obtener TEMA-50
    const { data: tema50 } = await supabase
      .from("topic_levels")
      .select("content_json")
      .eq("level", 0)
      .eq("topic_id", (await supabase.from("topics").select("id").eq("code", "TEMA-50").single()).data.id)
      .single();

    // Obtener TEMA-21
    const { data: tema21 } = await supabase
      .from("topic_levels")
      .select("content_json")
      .eq("level", 0)
      .eq("topic_id", (await supabase.from("topics").select("id").eq("code", "TEMA-21").single()).data.id)
      .single();

    console.log("📚 TEMA-50 N0:");
    console.log(JSON.stringify(tema50?.content_json, null, 2).substring(0, 500));

    console.log("\n📚 TEMA-21 N0:");
    console.log(JSON.stringify(tema21?.content_json, null, 2).substring(0, 500));

    // Comparar tipos
    console.log("\n🔎 Análisis:");
    console.log(`TEMA-50 keys: ${Object.keys(tema50?.content_json || {}).join(", ")}`);
    console.log(`TEMA-21 keys: ${Object.keys(tema21?.content_json || {}).join(", ")}`);

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

compare();

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseServiceRole!);

async function debugN0N1() {
  console.log("🔍 Diagnosticando N0 y N1...\n");

  try {
    const { data: tema } = await supabase
      .from("topics")
      .select("id")
      .eq("code", "TEMA-19")
      .single();

    if (!tema) {
      console.log("❌ TEMA-19 no encontrado");
      process.exit(1);
    }

    // Leer N0
    const { data: n0Level } = await supabase
      .from("topic_levels")
      .select("content_json")
      .eq("topic_id", tema.id)
      .eq("level", 0)
      .single();

    if (n0Level) {
      console.log("📋 N0 content_json:");
      console.log(JSON.stringify(n0Level.content_json, null, 2));
    }

    // Leer N1
    const { data: n1Level } = await supabase
      .from("topic_levels")
      .select("content_json")
      .eq("topic_id", tema.id)
      .eq("level", 1)
      .single();

    if (n1Level) {
      console.log("\n📋 N1 content_json:");
      console.log(JSON.stringify(n1Level.content_json, null, 2));
    }
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

debugN0N1();

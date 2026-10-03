import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkTema2() {
  try {
    const { data: tema } = await supabase
      .from("topics")
      .select("id, code")
      .eq("code", "TEMA-2")
      .single();

    if (!tema) {
      console.log("TEMA-2 no encontrado");
      process.exit(1);
    }

    const { data: legislacion } = await supabase
      .from("topic_legislation_by_ccaa")
      .select("*")
      .eq("topic_id", tema.id)
      .order("ccaa");

    console.log("\n📋 LEGISLACIÓN DE TEMA-2:\n");
    legislacion?.forEach((l: any) => {
      console.log(`\n${l.ccaa}:`);
      console.log(`${l.contenido.substring(0, 150)}...`);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

checkTema2();

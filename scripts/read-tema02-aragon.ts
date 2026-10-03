import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function readTema02Aragon() {
  try {
    const { data: tema } = await supabase
      .from("topics")
      .select("id, code")
      .eq("code", "TEMA-02")
      .single();

    if (!tema) {
      console.log("TEMA-02 no encontrado");
      process.exit(1);
    }

    const { data: legislacion } = await supabase
      .from("topic_legislation_by_ccaa")
      .select("contenido")
      .eq("topic_id", tema.id)
      .eq("ccaa", "Aragón")
      .single();

    console.log("\n📋 CONTENIDO COMPLETO - TEMA-02 ARAGÓN:\n");
    console.log(legislacion?.contenido);
  } catch (error) {
    console.error("Error:", error);
  }
}

readTema02Aragon();

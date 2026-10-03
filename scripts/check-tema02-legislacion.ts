import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkTema02() {
  try {
    // Buscar por patrón
    const { data: temas } = await supabase
      .from("topics")
      .select("id, code")
      .ilike("code", "%02%");

    console.log("\n🔍 Temas encontrados con '02':");
    temas?.forEach((t: any) => console.log(`   ${t.code}`));

    if (!temas || temas.length === 0) return;

    const tema = temas[0];
    const { data: legislacion } = await supabase
      .from("topic_legislation_by_ccaa")
      .select("*")
      .eq("topic_id", tema.id)
      .order("ccaa");

    console.log(`\n📋 LEGISLACIÓN DE ${tema.code}:\n`);
    legislacion?.forEach((l: any) => {
      console.log(`\n${l.ccaa}:`);
      console.log(`${l.contenido.substring(0, 200)}...`);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

checkTema02();

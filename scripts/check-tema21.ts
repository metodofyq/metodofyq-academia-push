import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseServiceRole!);

async function check() {
  console.log("🔍 Verificando TEMA-21...\n");

  try {
    const { data: tema } = await supabase
      .from("topics")
      .select("id, code, title, subject")
      .eq("code", "TEMA-21")
      .single();

    if (!tema) {
      console.log("❌ TEMA-21 no encontrado");
      return;
    }

    console.log(`📚 TEMA-21:`);
    console.log(`   ID: ${tema.id}`);
    console.log(`   Título: ${tema.title.substring(0, 70)}`);
    console.log(`   Subject: ${tema.subject}\n`);

    // Verificar niveles
    const { data: niveles } = await supabase
      .from("topic_levels")
      .select("level, title")
      .eq("topic_id", tema.id)
      .order("level");

    console.log(`📖 Niveles actuales:`);
    niveles?.forEach((n) => {
      console.log(`   N${n.level}: ${n.title}`);
    });

    console.log(`\n✅ TEMA-21 ${niveles && niveles.length > 0 ? "SÍ tiene contenido" : "NO tiene contenido"}`);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

check();

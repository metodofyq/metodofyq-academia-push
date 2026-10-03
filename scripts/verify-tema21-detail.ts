import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseServiceRole!);

async function verify() {
  console.log("🔍 Verificando TEMA-21 N0 en detalle...\n");

  try {
    const { data: tema } = await supabase
      .from("topics")
      .select("id")
      .eq("code", "TEMA-21")
      .single();

    if (!tema) {
      console.log("❌ TEMA-21 no encontrado");
      return;
    }

    // Obtener N0
    const { data: n0 } = await supabase
      .from("topic_levels")
      .select("*")
      .eq("topic_id", tema.id)
      .eq("level", 0)
      .single();

    if (!n0) {
      console.log("❌ N0 no encontrado");
      return;
    }

    console.log("📖 N0 Content:");
    console.log(JSON.stringify(n0.content_json, null, 2));

    console.log("\n📊 Estructura:");
    const estructura = n0.content_json.estructura;
    if (estructura) {
      console.log(`✅ Estructura existe: ${estructura.length} apartados`);
      estructura.forEach((apt: any, i: number) => {
        console.log(
          `   ${i}. ${apt.apartado} - ${
            apt.subapartados?.length || 0
          } subapartados`
        );
      });
    } else {
      console.log("❌ No hay estructura");
    }

    // Verificar otros niveles
    console.log("\n📚 Otros niveles:");
    const { data: allLevels } = await supabase
      .from("topic_levels")
      .select("level, title, content_json")
      .eq("topic_id", tema.id)
      .order("level");

    allLevels?.forEach((level) => {
      const contentSize = JSON.stringify(level.content_json).length;
      console.log(
        `   N${level.level} (${level.title}): ${contentSize} bytes`
      );
    });
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

verify();

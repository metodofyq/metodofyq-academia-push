import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseServiceRole!);

async function fixN0Estructura() {
  console.log("🔧 Transformando N0 a estructura correcta...\n");

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

    const { data: n0Level } = await supabase
      .from("topic_levels")
      .select("content_json")
      .eq("topic_id", tema.id)
      .eq("level", 0)
      .single();

    if (!n0Level) {
      console.log("❌ Nivel 0 no encontrado");
      process.exit(1);
    }

    const content = n0Level.content_json as Record<string, any>;
    const items = content.estructura || [];

    // Construir estructura jerárquica
    const estructura: Array<{apartado: string; subapartados: string[]}> = [];
    let currentApartado: {apartado: string; subapartados: string[]} | null = null;

    items.forEach((item: string) => {
      // Detectar apartados principales (1., 2., 3., etc.)
      if (/^\d+\.(?!\d)/.test(item.trim())) {
        if (currentApartado) {
          estructura.push(currentApartado);
        }
        currentApartado = { apartado: item, subapartados: [] };
      } else if (currentApartado) {
        // Subapartados (1.1, 1.2, etc.)
        currentApartado.subapartados.push(item);
      }
    });

    if (currentApartado) {
      estructura.push(currentApartado);
    }

    const updatedContent = {
      tipo: "indice",
      estructura: estructura
    };

    const { error } = await supabase
      .from("topic_levels")
      .update({ content_json: updatedContent })
      .eq("topic_id", tema.id)
      .eq("level", 0);

    if (error) {
      console.error("❌ Error:", error.message);
      process.exit(1);
    }

    console.log("✅ N0 transformado a estructura correcta");
    console.log(`   - ${estructura.length} apartados principales`);
    estructura.forEach(a => {
      console.log(`   - ${a.apartado}: ${a.subapartados.length} subapartados`);
    });
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

fixN0Estructura();

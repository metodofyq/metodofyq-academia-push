import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as fs from "fs";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function loadTema15N1Correct() {
  console.log("\n📖 CARGANDO TEMA-15 N1 DESDE DATOS ORIGINALES\n");
  console.log("=".repeat(80));

  try {
    // Leer JSON original
    const estructuraData = JSON.parse(
      fs.readFileSync("scripts/data/tema-15-estructura.json", "utf-8")
    );

    const n1Original = estructuraData.niveles.find((n: any) => n.level === 1);
    if (!n1Original) {
      console.log("❌ N1 no encontrado en estructura");
      process.exit(1);
    }

    const apartados = n1Original.content_json.apartados;

    // Transformar de apartados (con subapartados como arrays) a keywords (strings con ·)
    const keywords: Record<string, string> = {};

    for (const [apartado, subapartados] of Object.entries(apartados)) {
      if (typeof subapartados === 'object' && subapartados !== null) {
        for (const [subapartado, palabras] of Object.entries(subapartados)) {
          if (Array.isArray(palabras)) {
            keywords[subapartado] = palabras.join(" · ");
          }
        }
      }
    }

    console.log(`✅ Transformados ${Object.keys(keywords).length} subapartados`);

    // Obtener ID de tema
    const { data: tema } = await supabase
      .from("topics")
      .select("id")
      .eq("code", "TEMA-15")
      .single();

    // Actualizar N1 en DB
    const updated = {
      tipo: "palabras_clave",
      keywords: keywords
    };

    await supabase
      .from("topic_levels")
      .update({ content_json: updated })
      .eq("topic_id", tema.id)
      .eq("level", 1);

    console.log(`✅ TEMA-15 N1 Actualizado en BD`);
    
    console.log(`\n   Estructura de keywords:`);
    Object.entries(keywords).slice(0, 5).forEach(([subapartado, palabras]) => {
      const preview = palabras.substring(0, 70);
      console.log(`   ${subapartado}`);
      console.log(`     ${preview}...`);
    });

    console.log("\n" + "=".repeat(80));
    console.log("✅ NIVEL 1 CARGADO CORRECTAMENTE\n");

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

loadTema15N1Correct();

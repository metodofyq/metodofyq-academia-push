import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as fs from "fs";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function reloadTema08() {
  console.log("\n🔄 RECARGANDO TEMA-08 v2 (usando upsert)\n");
  console.log("=".repeat(80));

  try {
    const temaId = "30cd19fa-48b6-45a4-84f2-d503343d193d";

    const estructuraData = JSON.parse(
      fs.readFileSync("scripts/data/tema-08-estructura.json", "utf-8")
    );
    const n25Data = JSON.parse(
      fs.readFileSync("scripts/data/tema-08-nivel25.json", "utf-8")
    );
    const n35Data = JSON.parse(
      fs.readFileSync("scripts/data/tema-08-nivel35.json", "utf-8")
    );

    // Cargar N0-N3
    for (const nivel of estructuraData.niveles.slice(0, 4)) {
      console.log(`Cargando Nivel ${nivel.level}...`);
      
      const { error } = await supabase
        .from("topic_levels")
        .upsert({
          topic_id: temaId,
          level: nivel.level,
          content_json: nivel.content_json,
        }, { onConflict: "topic_id,level" });

      if (error) {
        console.log(`   ❌ Error: ${error.message}`);
      } else {
        console.log(`   ✓ Nivel ${nivel.level} cargado`);
      }
    }

    // Cargar N2.5
    console.log(`\nCargando Nivel 2.5...`);
    const flashcards25 = n25Data.flashcards.map((f: any) => ({
      apartado: f.apartado,
      subapartado: f.subapartado,
      termino: f.termino,
      descripcion: f.descripcion,
    }));

    const { error: e25 } = await supabase
      .from("topic_levels")
      .upsert({
        topic_id: temaId,
        level: 2.5,
        content_json: {
          tipo: "desarrollo",
          flashcards: flashcards25,
        },
      }, { onConflict: "topic_id,level" });

    if (e25) {
      console.log(`   ❌ Error: ${e25.message}`);
    } else {
      console.log(`   ✓ Nivel 2.5 cargado`);
    }

    // Cargar N3.5
    console.log(`\nCargando Nivel 3.5...`);
    const flashcards35 = n35Data.flashcards.map((f: any) => ({
      apartado: f.apartado,
      subapartado: f.subapartado,
      termino: f.termino,
      descripcion: f.descripcion,
    }));

    const { error: e35 } = await supabase
      .from("topic_levels")
      .upsert({
        topic_id: temaId,
        level: 3.5,
        content_json: {
          tipo: "desarrollo",
          flashcards: flashcards35,
        },
      }, { onConflict: "topic_id,level" });

    if (e35) {
      console.log(`   ❌ Error: ${e35.message}`);
    } else {
      console.log(`   ✓ Nivel 3.5 cargado`);
    }

    console.log("\n" + "=".repeat(80) + "\n");

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

reloadTema08();

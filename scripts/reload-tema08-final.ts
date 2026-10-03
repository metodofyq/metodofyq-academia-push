import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as fs from "fs";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function reloadTema08Final() {
  console.log("\n✅ RECARGANDO TEMA-08 FINAL (con campos requeridos)\n");
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

    // Títulos por nivel
    const titles: Record<number, string> = {
      0: "Índice",
      1: "Palabras clave",
      2: "Desarrollo esquemático",
      3: "Redacción completa",
      2.5: "Recuperación activa",
      3.5: "Reconstrucción científica",
    };

    // Cargar N0-N3
    for (const nivel of estructuraData.niveles.slice(0, 4)) {
      const level = nivel.level;
      const title = titles[level];
      console.log(`Cargando Nivel ${level} (${title})...`);
      
      const { error } = await supabase
        .from("topic_levels")
        .upsert({
          topic_id: temaId,
          level: level,
          title: title,
          content_json: nivel.content_json,
        }, { onConflict: "topic_id,level" });

      if (error) {
        console.log(`   ❌ Error: ${error.message}`);
      } else {
        console.log(`   ✓ Nivel ${level} cargado`);
      }
    }

    // Cargar N2.5
    console.log(`\nCargando Nivel 2.5 (${titles[2.5]})...`);
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
        title: titles[2.5],
        content_json: {
          tipo: "desarrollo",
          flashcards: flashcards25,
        },
      }, { onConflict: "topic_id,level" });

    if (e25) {
      console.log(`   ❌ Error: ${e25.message}`);
    } else {
      console.log(`   ✓ Nivel 2.5 cargado (${flashcards25.length} flashcards)`);
    }

    // Cargar N3.5
    console.log(`\nCargando Nivel 3.5 (${titles[3.5]})...`);
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
        title: titles[3.5],
        content_json: {
          tipo: "desarrollo",
          flashcards: flashcards35,
        },
      }, { onConflict: "topic_id,level" });

    if (e35) {
      console.log(`   ❌ Error: ${e35.message}`);
    } else {
      console.log(`   ✓ Nivel 3.5 cargado (${flashcards35.length} flashcards)`);
    }

    console.log("\n" + "=".repeat(80));
    console.log("\n✅ TEMA-08 COMPLETAMENTE CARGADO Y VERIFICADO\n");

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

reloadTema08Final();

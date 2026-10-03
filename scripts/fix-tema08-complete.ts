import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as fs from "fs";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function fixTema08() {
  console.log("\n🔧 CORRIGIENDO TEMA-08 - SOBRESCRIBIENDO CON DATOS CORRECTOS\n");
  console.log("=".repeat(80));

  try {
    // Obtener ID de TEMA-08
    const { data: tema08 } = await supabase
      .from("topics")
      .select("id")
      .eq("code", "TEMA-08")
      .single();

    const temaId = tema08.id;

    // Leer JSONs correctos
    const estructuraData = JSON.parse(
      fs.readFileSync("scripts/data/tema-08-estructura.json", "utf-8")
    );
    const n25Data = JSON.parse(
      fs.readFileSync("scripts/data/tema-08-nivel25.json", "utf-8")
    );
    const n35Data = JSON.parse(
      fs.readFileSync("scripts/data/tema-08-nivel35.json", "utf-8")
    );

    console.log("✅ JSONs leídos correctamente");

    // Borrar niveles existentes incorrectos
    console.log("\n🗑️  Eliminando niveles incorrectos...");
    for (const nivel of [0, 1, 2, 2.5, 3, 3.5]) {
      await supabase
        .from("topic_levels")
        .delete()
        .eq("topic_id", temaId)
        .eq("level", nivel);
      console.log(`   ✓ Nivel ${nivel} eliminado`);
    }

    // Cargar niveles correctos - N0, N1, N2, N3 desde estructura
    console.log("\n✅ Cargando niveles correctos (N0-N3)...");
    for (const nivel of estructuraData.niveles.slice(0, 4)) {
      console.log(`   Cargando N${nivel.level}...`);
      console.log(`   - Tipo: ${(nivel.content_json as any).tipo}`);
      
      const insertResult = await supabase
        .from("topic_levels")
        .insert({
          topic_id: temaId,
          level: nivel.level,
          content_json: nivel.content_json,
        })
        .select()
        .single();

      console.log(`   ✓ N${nivel.level} cargado`);
    }

    // Cargar N2.5
    console.log("\n✅ Cargando Nivel 2.5...");
    const flashcards25 = n25Data.flashcards.map((f: any) => ({
      apartado: f.apartado,
      subapartado: f.subapartado,
      termino: f.termino,
      descripcion: f.descripcion,
    }));

    await supabase
      .from("topic_levels")
      .insert({
        topic_id: temaId,
        level: 2.5,
        content_json: {
          tipo: "desarrollo",
          flashcards: flashcards25,
        },
      });
    console.log(`   ✓ ${flashcards25.length} flashcards N2.5 cargadas`);

    // Cargar N3.5
    console.log("\n✅ Cargando Nivel 3.5...");
    const flashcards35 = n35Data.flashcards.map((f: any) => ({
      apartado: f.apartado,
      subapartado: f.subapartado,
      termino: f.termino,
      descripcion: f.descripcion,
    }));

    await supabase
      .from("topic_levels")
      .insert({
        topic_id: temaId,
        level: 3.5,
        content_json: {
          tipo: "desarrollo",
          flashcards: flashcards35,
        },
      });
    console.log(`   ✓ ${flashcards35.length} flashcards N3.5 cargadas`);

    console.log("\n" + "=".repeat(80));
    console.log("\n✅ TEMA-08 COMPLETAMENTE CORREGIDO Y RELOADADO\n");

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

fixTema08();

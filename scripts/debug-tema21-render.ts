import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseServiceRole!);

async function debug() {
  console.log("🔍 DEBUG: Simulando carga de TEMA-21 como lo hace la página\n");

  try {
    const topicId = "219f7ff5-6078-42d2-835e-ea0c6d026bbb";

    // 1. Obtener topic
    const { data: topic } = await supabase
      .from("topics")
      .select("*")
      .eq("id", topicId)
      .single();

    console.log("1️⃣ TOPIC:");
    console.log(`   ID: ${topic?.id}`);
    console.log(`   Code: ${topic?.code}`);
    console.log(`   Title: ${topic?.title}\n`);

    // 2. Obtener todos los niveles
    const { data: allLevels } = await supabase
      .from("topic_levels")
      .select("*")
      .eq("topic_id", topicId);

    console.log("2️⃣ NIVELES CARGADOS:");
    console.log(`   Total: ${allLevels?.length}\n`);

    allLevels?.forEach((level) => {
      console.log(`   📖 N${level.level} (${level.title}):`);
      console.log(`      - Keys en content_json: ${Object.keys(level.content_json || {}).join(", ")}`);

      // Simular lo que hace contentOf
      const content = level.content_json;

      if (level.level === 0) {
        const estructura = content?.estructura;
        console.log(`      - ¿Tiene estructura? ${estructura ? "✅ SÍ" : "❌ NO"}`);
        if (estructura) {
          console.log(`        Apartados: ${estructura.length}`);
        }
      }

      if (level.level === 1) {
        const keywords = content?.keywords;
        console.log(`      - ¿Tiene keywords? ${keywords ? "✅ SÍ" : "❌ NO"}`);
        if (keywords) {
          console.log(`        Entradas: ${Object.keys(keywords).length}`);
          console.log(`        Primeras 3 keys: ${Object.keys(keywords).slice(0, 3).join(" | ")}`);
        }

        const texto = content?.texto;
        console.log(`      - ¿Tiene texto? ${texto ? "✅ SÍ" : "❌ NO"}`);
      }

      if (level.level === 2) {
        const texto = content?.texto;
        console.log(`      - ¿Tiene texto? ${texto ? "✅ SÍ" : "❌ NO"}`);
        if (texto) {
          console.log(`        Primeros 100 chars: ${texto.substring(0, 100)}...`);
        }
      }

      console.log("");
    });

    // 3. Simular la lógica de contentOf y estructura
    console.log("3️⃣ SIMULANDO LÓGICA DE RENDERIZACIÓN:\n");

    const levelRow = (levelVal: number) =>
      allLevels?.find((l) => Number(l.level) === levelVal);
    const contentOf = (levelVal: number) =>
      levelRow(levelVal)?.content_json as Record<string, unknown> | null | undefined;

    const estructura = contentOf(0)?.estructura;
    const keywords = contentOf(1)?.keywords;

    console.log("   Para N0 (Índice):");
    console.log(`   - estructura obtenida: ${estructura ? "✅ SÍ" : "❌ NO"}`);
    if (estructura) {
      console.log(`     Tipo: ${Array.isArray(estructura) ? "Array" : typeof estructura}`);
      console.log(`     Length: ${(estructura as any[])?.length || "?"}`);
    }

    console.log("\n   Para N1 (Palabras clave):");
    console.log(`   - keywords obtenida: ${keywords ? "✅ SÍ" : "❌ NO"}`);
    if (keywords) {
      console.log(`     Tipo: ${typeof keywords}`);
      console.log(`     Keys count: ${Object.keys(keywords).length}`);
    }

    console.log("\n4️⃣ VERIFICACIÓN DE RENDERIZACIÓN:\n");

    // N0
    if (!estructura) {
      console.log("   ❌ N0 NO se renderizaría (falta estructura)");
    } else {
      console.log("   ✅ N0 se renderizaría (tiene estructura)");
    }

    // N1
    if (!estructura || !keywords || Object.keys(keywords).length === 0) {
      console.log("   ❌ N1 NO se renderizaría (falta estructura O keywords vacías)");
      console.log(`      - estructura: ${estructura ? "✅" : "❌"}`);
      console.log(`      - keywords: ${keywords ? "✅" : "❌"}`);
      if (keywords) {
        console.log(`      - keywords.length: ${Object.keys(keywords).length}`);
      }
    } else {
      console.log("   ✅ N1 se renderizaría (tiene estructura y keywords)");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

debug();

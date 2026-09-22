import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseServiceRole!);

async function seedTema19() {
  console.log("🔧 Sembrando TEMA-19 (Electroestática)...\n");

  try {
    // Leer datos de estructura
    const dataPath = path.join(__dirname, "data", "tema-19-estructura.json");
    const rawData = fs.readFileSync(dataPath, "utf-8");
    const data = JSON.parse(rawData);

    const tema = data.tema;
    const niveles = data.niveles;

    // Verificar o crear fila en topics
    let { data: topicData, error: topicError } = await supabase
      .from("topics")
      .select("id")
      .eq("code", tema.code)
      .single();

    if (!topicData) {
      console.log(`📝 Creando tema ${tema.code}...`);
      const { data: newTopic, error: createError } = await supabase
        .from("topics")
        .insert({
          code: tema.code,
          title: tema.title,
          subject: tema.subject,
          grupo: tema.grupo,
        })
        .select("id")
        .single();

      if (createError) {
        console.error("❌ Error creando tema:", createError.message);
        process.exit(1);
      }
      topicData = newTopic;
    }

    const topicId = topicData.id;
    console.log(`✅ Tema ${tema.code} (ID: ${topicId})`);

    // Cargar niveles
    for (const nivel of niveles) {
      const { data: levelData } = await supabase
        .from("topic_levels")
        .select("id")
        .eq("topic_id", topicId)
        .eq("level", nivel.level)
        .single();

      if (levelData) {
        // Actualizar
        const { error: updateError } = await supabase
          .from("topic_levels")
          .update({ content_json: nivel.content_json })
          .eq("id", levelData.id);

        if (updateError) {
          console.error(`❌ Error actualizando N${nivel.level}:`, updateError.message);
          process.exit(1);
        }
        console.log(`   ✓ N${nivel.level}: actualizado`);
      } else {
        // Insertar
        const { error: insertError } = await supabase
          .from("topic_levels")
          .insert({
            topic_id: topicId,
            level: nivel.level,
            content_json: nivel.content_json,
          });

        if (insertError) {
          console.error(`❌ Error insertando N${nivel.level}:`, insertError.message);
          process.exit(1);
        }
        console.log(`   ✓ N${nivel.level}: creado`);
      }
    }

    // Agregar N2.5 y N3.5 vacíos si no existen
    for (const level of [2.5, 3.5]) {
      const { data: levelCheck } = await supabase
        .from("topic_levels")
        .select("id")
        .eq("topic_id", topicId)
        .eq("level", level)
        .single();

      if (!levelCheck) {
        await supabase.from("topic_levels").insert({
          topic_id: topicId,
          level,
          content_json: { tipo: "recuperacion_activa", flashcards: [] },
        });
        console.log(`   ✓ N${level}: creado (vacío)`);
      }
    }

    console.log("\n✅ Estructura de TEMA-19 cargada correctamente");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

seedTema19();

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseServiceRole!);

async function seedTema15() {
  console.log("\n🔧 CARGANDO TEMA-15 (Energía interna. Calor y temperatura)\n");
  console.log("=".repeat(70));

  try {
    const dataPath = path.join(__dirname, "data", "tema-15-estructura.json");
    const rawData = fs.readFileSync(dataPath, "utf-8");
    const data = JSON.parse(rawData);

    const tema = data.tema;
    const niveles = data.niveles;

    // Crear o verificar tema
    let { data: topicData } = await supabase
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
    console.log(`✅ Tema ${tema.code} (ID: ${topicId})\n`);

    // Cargar niveles
    for (const nivel of niveles) {
      const { data: levelData } = await supabase
        .from("topic_levels")
        .select("id")
        .eq("topic_id", topicId)
        .eq("level", nivel.level)
        .single();

      if (levelData) {
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

    console.log("\n✅ Estructura de TEMA-15 cargada correctamente");
    console.log("=".repeat(70) + "\n");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

seedTema15();

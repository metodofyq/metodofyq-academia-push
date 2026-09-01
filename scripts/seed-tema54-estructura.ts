// Carga la estructura de Tema 54 (niveles 0, 1, 2, 3) en Supabase
// Uso: npx tsx scripts/seed-tema54-estructura.ts
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseServiceRole) {
  console.error("❌ Faltan variables de entorno");
  process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseServiceRole);

async function main() {
  const file = path.join(process.cwd(), "scripts/data/tema54-estructura.json");
  const raw = JSON.parse(fs.readFileSync(file, "utf-8")) as {
    tema: string;
    titulo: string;
    grupo: number;
    niveles: Array<{
      nivel: number;
      titulo: string;
      content_json: unknown;
    }>;
  };

  console.log(`📚 Cargando Tema 54 (${raw.titulo})...`);

  // Verificar si el tema existe
  const { data: topic, error: topicError } = await supabase
    .from("topics")
    .select("id")
    .eq("code", raw.tema)
    .maybeSingle();

  let topicId: string;
  if (!topic) {
    console.log(`  Creando tema ${raw.tema}...`);
    const { data: newTopic, error: createError } = await supabase
      .from("topics")
      .insert({
        code: raw.tema,
        title: raw.titulo,
        subject: "quimica",
        grupo: raw.grupo,
      })
      .select("id")
      .single();
    if (createError || !newTopic) throw new Error(`No se pudo crear tema: ${createError}`);
    topicId = newTopic.id;
  } else {
    topicId = topic.id;
    console.log(`  Tema ${raw.tema} ya existe (id: ${topicId})`);
  }

  // Cargar niveles
  for (const nivel of raw.niveles) {
    const { error: upsertError } = await supabase.from("topic_levels").upsert(
      {
        topic_id: topicId,
        level: nivel.nivel,
        title: nivel.titulo,
        content_json: nivel.content_json,
      },
      { onConflict: "topic_id,level" }
    );
    if (upsertError) throw upsertError;
    console.log(`  ✅ Nivel ${nivel.nivel} cargado`);
  }

  console.log(`✅ Tema 54 completamente cargado.`);
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});

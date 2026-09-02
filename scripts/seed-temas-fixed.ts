// Carga la estructura corregida de Tema 50 y 54 (niveles 0, 1, 2, 3)
// Conserva los niveles 2.5 y 3.5 que ya estaban cargados
// Uso: npx tsx scripts/seed-temas-fixed.ts
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

async function loadTema(filePath: string, temaCod: string) {
  const raw = JSON.parse(fs.readFileSync(filePath, "utf-8")) as {
    tema: string;
    titulo: string;
    grupo: number;
    niveles: Array<{
      nivel: number;
      titulo: string;
      content_json: unknown;
    }>;
  };

  console.log(`📚 Cargando ${raw.tema} (${raw.titulo})...`);

  // Verificar si el tema existe
  const { data: topic, error: topicError } = await supabase
    .from("topics")
    .select("id")
    .eq("code", raw.tema)
    .maybeSingle();

  if (topicError) throw topicError;

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

  // Limpiar primero los niveles 0, 1, 2, 3, 4 (si existen) para evitar conflictos
  console.log(`  Limpiando niveles anteriores...`);
  const { error: deleteError } = await supabase
    .from("topic_levels")
    .delete()
    .eq("topic_id", topicId)
    .in("level", [0, 1, 2, 3, 4]);

  if (deleteError) throw deleteError;

  // Cargar los nuevos niveles
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

  console.log(`✅ ${raw.tema} completamente cargado.\n`);
}

async function main() {
  try {
    await loadTema("scripts/data/tema50-estructura-fixed.json", "TEMA-50");
    await loadTema("scripts/data/tema54-estructura-fixed.json", "TEMA-54");
    console.log("✅ Todos los temas cargados correctamente.");
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

main();

// Carga flashcards curadas (recuperación activa) para el Nivel 2.5 de un
// tema, desde un JSON con el formato {tema, nivel, titulo, flashcards:[...]}.
// Uso: npx tsx scripts/load-flashcards.ts scripts/data/tema19-nivel25.json
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

type FlashcardCurada = {
  id: number;
  apartado: string;
  subapartado?: string;
  pregunta: string;
  respuesta: string;
  tipo_pregunta?: string;
};

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error("Uso: npx tsx scripts/load-flashcards.ts <fichero.json>");
    process.exit(1);
  }

  const raw = JSON.parse(fs.readFileSync(path.resolve(file), "utf-8")) as {
    tema: string;
    titulo: string;
    flashcards: FlashcardCurada[];
  };

  console.log(`🃏 Cargando Nivel 2.5 de ${raw.tema} (${raw.flashcards.length} flashcards)...`);

  const { data: topic, error: topicError } = await supabase
    .from("topics")
    .select("id")
    .eq("code", raw.tema)
    .single();
  if (topicError || !topic) throw new Error(`No se encontró el topic ${raw.tema}`);

  // Mismo shape que usa el componente FlashcardsSemaforo (termino/descripcion).
  const flashcards = raw.flashcards.map((f) => ({
    id: `curada_${raw.tema}_${f.id}`,
    apartado: f.apartado,
    subapartado: f.subapartado ?? "",
    termino: f.pregunta,
    descripcion: f.respuesta,
    tipo: f.tipo_pregunta ?? null,
  }));

  const { error } = await supabase.from("topic_levels").upsert(
    {
      topic_id: topic.id,
      level: 2.5,
      title: "Tarjetas de aprendizaje",
      content_json: { flashcards },
    },
    { onConflict: "topic_id,level" }
  );
  if (error) throw error;

  console.log(`✅ ${flashcards.length} flashcards curadas cargadas para ${raw.tema}.`);
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});

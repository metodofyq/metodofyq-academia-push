// Carga flashcards curadas (recuperación activa o reconstrucción científica)
// para el Nivel 2.5 o 3.5 de un tema, desde un JSON con el formato
// {tema, nivel, titulo, flashcards:[...]}. El nivel (2.5 o 3.5) se lee del
// propio fichero.
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
  tipo_flashcard?: string;
};

const TITULOS_NIVEL: Record<string, string> = {
  "2.5": "Tarjetas de aprendizaje",
  "3.5": "Reconstrucción científica",
};

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error("Uso: npx tsx scripts/load-flashcards.ts <fichero.json>");
    process.exit(1);
  }

  const raw = JSON.parse(fs.readFileSync(path.resolve(file), "utf-8")) as {
    tema: string;
    nivel: string;
    titulo: string;
    flashcards: FlashcardCurada[];
  };

  const nivel = Number(raw.nivel);
  if (![2.5, 3.5].includes(nivel)) {
    throw new Error(`nivel inválido en el JSON: "${raw.nivel}" (debe ser "2.5" o "3.5")`);
  }

  console.log(`🃏 Cargando Nivel ${raw.nivel} de ${raw.tema} (${raw.flashcards.length} flashcards)...`);

  const { data: topic, error: topicError } = await supabase
    .from("topics")
    .select("id")
    .eq("code", raw.tema)
    .single();
  if (topicError || !topic) throw new Error(`No se encontró el topic ${raw.tema}`);

  // Mismo shape que usa el componente FlashcardsSemaforo (termino/descripcion).
  const flashcards = raw.flashcards.map((f) => ({
    id: `curada_${raw.tema}_n${raw.nivel}_${f.id}`,
    apartado: f.apartado,
    subapartado: f.subapartado ?? "",
    termino: f.pregunta,
    descripcion: f.respuesta,
    tipo: f.tipo_pregunta ?? f.tipo_flashcard ?? null,
  }));

  const { error } = await supabase.from("topic_levels").upsert(
    {
      topic_id: topic.id,
      level: nivel,
      title: TITULOS_NIVEL[raw.nivel] ?? "Tarjetas",
      content_json: { flashcards },
    },
    { onConflict: "topic_id,level" }
  );
  if (error) throw error;

  console.log(`✅ ${flashcards.length} flashcards curadas cargadas en Nivel ${raw.nivel} de ${raw.tema}.`);
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});

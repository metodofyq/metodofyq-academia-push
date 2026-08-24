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

const SOURCE_FILE = path.join(process.cwd(), "metodofyq_tema19.jsx");
const TOPIC_CODE = "TEMA-19";
const BUCKET = "topic-media";

// ─── Extrae un literal balanceado { } o [ ] a partir de un índice de apertura,
// respetando strings (comillas simples/dobles/backticks) para no confundir
// llaves o corchetes que pudieran aparecer dentro de un template literal.
function extractBalanced(text: string, openIdx: number): number {
  const openChar = text[openIdx];
  const closeChar = openChar === "{" ? "}" : "]";
  let depth = 0;
  let inStr: string | null = null;
  for (let i = openIdx; i < text.length; i++) {
    const c = text[i];
    if (inStr) {
      if (c === "\\") { i++; continue; }
      if (c === inStr) inStr = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") { inStr = c; continue; }
    if (c === openChar) depth++;
    else if (c === closeChar) {
      depth--;
      if (depth === 0) return i;
    }
  }
  throw new Error(`Literal sin cerrar a partir del índice ${openIdx}`);
}

function extractDeclaration(text: string, declName: string): any {
  const marker = `const ${declName} = `;
  const declIdx = text.indexOf(marker);
  if (declIdx === -1) throw new Error(`No se encontró "${marker}" en el fichero fuente`);
  const openIdx = declIdx + marker.length;
  const closeIdx = extractBalanced(text, openIdx);
  const literal = text.slice(openIdx, closeIdx + 1);
  // eslint-disable-next-line no-new-func
  return new Function(`return (${literal});`)();
}

type Infografia = { label: string; src: string };
type N3Imagen = { tipo: string; anchor: string; caption?: string; dibujar?: string; src: string };
type TemaData = {
  titulo: string;
  nivel0: { apartado: string; subapartados: string[] }[];
  nivel1_keywords: Record<string, string>;
  nivel2_texto: string;
  nivel3_texto: string;
};

async function uploadDataUri(dataUri: string, storagePath: string): Promise<void> {
  const match = dataUri.match(/^data:(image\/\w+);base64,([\s\S]+)$/);
  if (!match) throw new Error(`Data URI inválida para ${storagePath}`);
  const [, contentType, base64] = match;
  const buffer = Buffer.from(base64, "base64");
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, buffer, { contentType, upsert: true });
  if (error) throw error;
}

async function seed() {
  console.log(`🌱 Cargando ${TOPIC_CODE} desde ${SOURCE_FILE}...\n`);

  const raw = fs.readFileSync(SOURCE_FILE, "utf-8");

  const TEMAS = extractDeclaration(raw, "TEMAS") as Record<string, TemaData>;
  const INFOGRAFIAS = extractDeclaration(raw, "INFOGRAFIAS") as Infografia[];
  const N3_IMAGENES = extractDeclaration(raw, "N3_IMAGENES") as N3Imagen[];

  const tema = TEMAS[19];
  if (!tema) throw new Error('No se encontró TEMAS["19"] en el fichero fuente');

  console.log(`📖 ${tema.titulo}`);
  console.log(`   nivel0: ${tema.nivel0.length} apartados`);
  console.log(`   nivel1_keywords: ${Object.keys(tema.nivel1_keywords).length} entradas`);
  console.log(`   infografías: ${INFOGRAFIAS.length}`);
  console.log(`   imágenes N3: ${N3_IMAGENES.length}\n`);

  // 1. Localizar el topic ya sembrado por la migración 008
  const { data: topic, error: topicError } = await supabase
    .from("topics")
    .select("id")
    .eq("code", TOPIC_CODE)
    .single();
  if (topicError || !topic) {
    throw new Error(`No se encontró el topic ${TOPIC_CODE}. ¿Se aplicó la migración 008?`);
  }
  const topicId = topic.id as string;

  // 2. Niveles 0, 0.5, 1, 2, 2.5, 3
  console.log("📝 Insertando topic_levels...");
  const levels = [
    { level: 0, title: "Índice", content_json: { estructura: tema.nivel0 } },
    { level: 0.5, title: "Infografía resumen", content_json: null },
    { level: 1, title: "Palabras clave", content_json: { keywords: tema.nivel1_keywords } },
    { level: 2, title: "Conceptos clave", content_json: { texto: tema.nivel2_texto } },
    { level: 2.5, title: "Tarjetas de aprendizaje", content_json: null },
    { level: 3, title: "Redacción final", content_json: { texto: tema.nivel3_texto } },
  ].map((l) => ({ topic_id: topicId, ...l }));

  const { error: levelsError } = await supabase
    .from("topic_levels")
    .upsert(levels, { onConflict: "topic_id,level" });
  if (levelsError) throw levelsError;
  console.log(`✅ ${levels.length} niveles insertados\n`);

  // 3. Infografías (Nivel 0.5) → Storage + topic_infografias
  console.log("🖼️  Subiendo infografías...");
  const infografiaRows = [];
  for (let i = 0; i < INFOGRAFIAS.length; i++) {
    const storagePath = `${TOPIC_CODE}/infografia-${i}.jpg`;
    await uploadDataUri(INFOGRAFIAS[i].src, storagePath);
    infografiaRows.push({
      topic_id: topicId,
      label: INFOGRAFIAS[i].label,
      storage_path: storagePath,
      order_index: i,
    });
    console.log(`   ✓ ${storagePath}`);
  }
  const { error: infografiasError } = await supabase
    .from("topic_infografias")
    .upsert(infografiaRows, { onConflict: "topic_id,order_index" });
  if (infografiasError) throw infografiasError;
  console.log(`✅ ${infografiaRows.length} infografías\n`);

  // 4. Imágenes intercaladas de Nivel 3 → Storage + topic_n3_images
  console.log("🖼️  Subiendo imágenes de Nivel 3...");
  const n3Rows = [];
  for (let i = 0; i < N3_IMAGENES.length; i++) {
    const img = N3_IMAGENES[i];
    const storagePath = `${TOPIC_CODE}/n3-imagen-${i}.jpg`;
    await uploadDataUri(img.src, storagePath);
    n3Rows.push({
      topic_id: topicId,
      anchor_text: img.anchor,
      caption: img.caption ?? null,
      dibujar_hint: img.dibujar ?? null,
      storage_path: storagePath,
      order_index: i,
    });
    console.log(`   ✓ ${storagePath}`);
  }
  const { error: n3Error } = await supabase
    .from("topic_n3_images")
    .upsert(n3Rows, { onConflict: "topic_id,order_index" });
  if (n3Error) throw n3Error;
  console.log(`✅ ${n3Rows.length} imágenes de Nivel 3\n`);

  console.log(`🎉 ${TOPIC_CODE} cargado correctamente.`);
}

seed().catch((err) => {
  console.error("❌ Error durante el seed:", err);
  process.exit(1);
});

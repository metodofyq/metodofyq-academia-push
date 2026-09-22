import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseServiceRole!);

async function addIndexToN3() {
  console.log("🔧 Añadiendo índice a N3 en TEMA-21...\n");

  try {
    const { data: tema } = await supabase
      .from("topics")
      .select("id")
      .eq("code", "TEMA-21")
      .single();

    if (!tema) {
      console.log("❌ TEMA-21 no encontrado");
      process.exit(1);
    }

    // Obtener N0 (índice)
    const { data: n0Level } = await supabase
      .from("topic_levels")
      .select("content_json")
      .eq("topic_id", tema.id)
      .eq("level", 0)
      .single();

    if (!n0Level) {
      console.log("❌ Nivel 0 no encontrado");
      process.exit(1);
    }

    // Obtener N3
    const { data: n3Level } = await supabase
      .from("topic_levels")
      .select("content_json")
      .eq("topic_id", tema.id)
      .eq("level", 3)
      .single();

    if (!n3Level) {
      console.log("❌ Nivel 3 no encontrado");
      process.exit(1);
    }

    // Extraer el índice de N0
    const n0Content = n0Level.content_json as Record<string, any>;
    const estructura = n0Content.estructura || [];

    // Convertir estructura a formato de índice legible
    let indexText = "# Índice\n\n";
    estructura.forEach((apartado: any, idx: number) => {
      if (typeof apartado === "string") {
        indexText += `${idx + 1}. ${apartado}\n`;
      } else if (apartado.titulo) {
        indexText += `${idx + 1}. ${apartado.titulo}\n`;
        if (apartado.subapartados && Array.isArray(apartado.subapartados)) {
          apartado.subapartados.forEach((sub: any, subIdx: number) => {
            const subText = typeof sub === "string" ? sub : sub.titulo || sub;
            indexText += `   ${idx + 1}.${subIdx + 1}. ${subText}\n`;
          });
        }
      }
    });

    indexText += "\n---\n\n";

    // Obtener el texto de N3
    const n3Content = n3Level.content_json as Record<string, any>;
    const n3Texto = n3Content.texto || "";

    // Prepender el índice al texto de N3
    const updatedText = indexText + n3Texto;

    const updatedContent = {
      ...n3Content,
      texto: updatedText,
      "texto-fantasma": indexText + (n3Content["texto-fantasma"] || n3Texto),
    };

    const { error } = await supabase
      .from("topic_levels")
      .update({ content_json: updatedContent })
      .eq("topic_id", tema.id)
      .eq("level", 3);

    if (error) {
      console.error("❌ Error:", error.message);
      process.exit(1);
    }

    console.log("✅ N3: Índice añadido correctamente");
    console.log(`   - Apartados en índice: ${estructura.length}`);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

addIndexToN3();

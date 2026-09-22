import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseServiceRole!);

async function fixN0N1() {
  console.log("🔧 Reparando N0 y N1...\n");

  try {
    const { data: tema } = await supabase
      .from("topics")
      .select("id")
      .eq("code", "TEMA-19")
      .single();

    if (!tema) {
      console.log("❌ TEMA-19 no encontrado");
      process.exit(1);
    }

    // Arreglar N0
    const { data: n0Level } = await supabase
      .from("topic_levels")
      .select("content_json")
      .eq("topic_id", tema.id)
      .eq("level", 0)
      .single();

    if (n0Level) {
      const n0Content = n0Level.content_json as Record<string, any>;
      // Asegurar que estructura es un array de strings limpios
      const estructura = Array.isArray(n0Content.estructura) 
        ? n0Content.estructura.map((s: any) => String(s).trim())
        : [];

      const updatedN0 = {
        tipo: "indice",
        estructura: estructura
      };

      const { error: n0Error } = await supabase
        .from("topic_levels")
        .update({ content_json: updatedN0 })
        .eq("topic_id", tema.id)
        .eq("level", 0);

      if (n0Error) {
        console.error("❌ Error en N0:", n0Error.message);
      } else {
        console.log("✅ N0 reparado");
      }
    }

    // Arreglar N1
    const { data: n1Level } = await supabase
      .from("topic_levels")
      .select("content_json")
      .eq("topic_id", tema.id)
      .eq("level", 1)
      .single();

    if (n1Level) {
      const n1Content = n1Level.content_json as Record<string, any>;
      const keywords = n1Content.keywords || {};
      
      // Limpiar keywords: eliminar caracteres problemáticos
      const cleanedKeywords: Record<string, string> = {};
      for (const [key, value] of Object.entries(keywords)) {
        const cleanKey = String(key).trim().replace(/\0/g, "");
        const cleanValue = String(value || "").trim().replace(/\0/g, "");
        if (cleanKey && cleanValue) {
          cleanedKeywords[cleanKey] = cleanValue;
        }
      }

      const updatedN1 = {
        tipo: "palabras_clave",
        keywords: cleanedKeywords
      };

      const { error: n1Error } = await supabase
        .from("topic_levels")
        .update({ content_json: updatedN1 })
        .eq("topic_id", tema.id)
        .eq("level", 1);

      if (n1Error) {
        console.error("❌ Error en N1:", n1Error.message);
      } else {
        console.log("✅ N1 reparado");
      }
    }

    console.log("\n✅ N0 y N1 reparados");
  } catch (error) {
    console.error("❌ Error fatal:", error);
    process.exit(1);
  }
}

fixN0N1();

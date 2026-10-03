import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkContent() {
  try {
    const { data: tema } = await supabase
      .from("topics")
      .select("id")
      .eq("code", "TEMA-19")
      .single();

    if (!tema) {
      console.log("TEMA-19 no encontrado");
      process.exit(1);
    }

    console.log("\n=== VERIFICACIÓN DEL CONTENIDO DE TEMA-19 ===\n");

    // N2
    console.log("📝 NIVEL 2 - Primeros 500 caracteres:\n");
    const { data: n2 } = await supabase
      .from("topic_levels")
      .select("content_json")
      .eq("topic_id", tema.id)
      .eq("level", 2)
      .single();

    if (n2) {
      const n2Text = (n2.content_json as Record<string, any>)?.texto || "";
      console.log(n2Text.substring(0, 500));
      console.log("\n---\n");
      
      // Buscar patrón de doble guión
      const dobleGuionMatches = n2Text.match(/-\s*\n\s*-/g);
      console.log(`Dobles guiones encontrados: ${dobleGuionMatches ? dobleGuionMatches.length : 0}`);
      if (dobleGuionMatches) {
        console.log("Ejemplo:", dobleGuionMatches[0]);
      }
    }

    // N3
    console.log("\n📝 NIVEL 3 - Primeros 500 caracteres:\n");
    const { data: n3 } = await supabase
      .from("topic_levels")
      .select("content_json")
      .eq("topic_id", tema.id)
      .eq("level", 3)
      .single();

    if (n3) {
      const n3Text = (n3.content_json as Record<string, any>)?.texto || "";
      console.log(n3Text.substring(0, 500));
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

checkContent();

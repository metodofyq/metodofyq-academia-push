import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as fs from "fs";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkN2() {
  try {
    const { data: tema } = await supabase
      .from("topics")
      .select("id")
      .eq("code", "TEMA-19")
      .single();

    const { data: n2 } = await supabase
      .from("topic_levels")
      .select("content_json")
      .eq("topic_id", tema.id)
      .eq("level", 2)
      .single();

    if (n2) {
      const n2Text = (n2.content_json as Record<string, any>)?.texto || "";
      
      // Guardar contenido a archivo para inspección
      fs.writeFileSync("/tmp/n2-content.txt", n2Text);
      
      console.log("\n📋 ANÁLISIS DETALLADO DE N2:\n");
      console.log("Longitud total:", n2Text.length, "caracteres\n");
      
      // Buscar patrones específicos
      console.log("🔍 Patrones encontrados:");
      
      // Dobles guiones en nuevas líneas
      const doubleHyphens = n2Text.match(/-\s*\n\s*-/g);
      console.log(`  • Patrón "-\n-": ${doubleHyphens ? doubleHyphens.length : 0}`);
      
      // Líneas solo con guión
      const emptyHyphens = n2Text.match(/^\s*-\s*$/gm);
      console.log(`  • Líneas solo con "-": ${emptyHyphens ? emptyHyphens.length : 0}`);
      
      // Guiones con espacios
      const hyphenPatterns = n2Text.match(/-\s*\n/g);
      console.log(`  • Guiones seguidos de newline: ${hyphenPatterns ? hyphenPatterns.length : 0}`);
      
      // Títulos con negrita markdown
      const boldTitles = n2Text.match(/\*\*\d\./g);
      console.log(`  • Títulos con "**": ${boldTitles ? boldTitles.length : 0}`);
      
      // Muestra de las primeras 3 líneas
      console.log("\n📄 Primeras líneas del contenido:");
      const lines = n2Text.split('\n').slice(0, 10);
      lines.forEach((line, i) => {
        console.log(`  ${i}: [${line}]`);
      });
      
      console.log("\n✅ Contenido guardado en /tmp/n2-content.txt");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

checkN2();

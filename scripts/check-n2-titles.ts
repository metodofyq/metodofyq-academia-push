import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkTitles() {
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

    const n2Text = (n2.content_json as Record<string, any>)?.texto || "";
    
    // Buscar patrones de títulos
    console.log("\n📋 Verificación de títulos en N2:\n");
    
    // Líneas que comienzan con número (son títulos)
    const titleLines = n2Text.split('\n').filter((line: string) => /^\d+\./.test(line));
    
    console.log(`Títulos encontrados: ${titleLines.length}`);
    console.log("\nPrimeros 5 títulos:");
    titleLines.slice(0, 5).forEach((title: string, i: number) => {
      const hasMarkdown = title.includes('**');
      const boldStatus = hasMarkdown ? '✅ CON negrita (markdown)' : '❌ SIN negrita (markdown)';
      console.log(`  ${i+1}. ${title}`);
      console.log(`     → ${boldStatus}\n`);
    });
    
  } catch (error) {
    console.error("Error:", error);
  }
}

checkTitles();

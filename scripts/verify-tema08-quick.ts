import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function verify() {
  const { data: allLevels } = await supabase
    .from("topic_levels")
    .select("topic_id, level, content_json")
    .eq("topic_id", "30cd19fa-48b6-45a4-84f2-d503343d193d");

  console.log(`\nTotal de niveles en TEMA-08: ${allLevels?.length || 0}\n`);
  
  if (allLevels && allLevels.length > 0) {
    for (const level of allLevels) {
      const tipo = (level.content_json as any)?.tipo;
      const preview = level.level === 0 
        ? (level.content_json as any)?.estructura?.[0]?.apartado
        : level.level === 1
        ? Object.keys((level.content_json as any)?.keywords || {})[0]
        : "...";
      
      console.log(`  ✓ Nivel ${level.level}: tipo=${tipo}, preview="${preview}"`);
    }
  }
}

verify();

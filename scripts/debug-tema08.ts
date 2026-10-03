import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function debugTema08() {
  console.log("\n🔍 INVESTIGACIÓN PROFUNDA - TEMA-08 vs TEMA-50\n");
  console.log("=".repeat(80));

  try {
    // Obtener TEMA-08
    const { data: tema08 } = await supabase
      .from("topics")
      .select("id, code")
      .eq("code", "TEMA-08")
      .single();

    // Obtener TEMA-50
    const { data: tema50 } = await supabase
      .from("topics")
      .select("id, code")
      .eq("code", "TEMA-50")
      .single();

    console.log(`TEMA-08 ID: ${tema08.id}`);
    console.log(`TEMA-50 ID: ${tema50.id}\n`);

    // Verificar cada nivel
    const niveles = [0, 1, 2, 2.5, 3, 3.5];

    for (const nivel of niveles) {
      console.log(`\n📋 NIVEL ${nivel}:`);
      console.log("-".repeat(80));

      const { data: t08 } = await supabase
        .from("topic_levels")
        .select("content_json")
        .eq("topic_id", tema08.id)
        .eq("level", nivel)
        .single();

      const { data: t50 } = await supabase
        .from("topic_levels")
        .select("content_json")
        .eq("topic_id", tema50.id)
        .eq("level", nivel)
        .single();

      if (!t08 && !t50) {
        console.log("   ⚠️  Ambos vacíos");
        continue;
      }

      if (!t08) {
        console.log("   ❌ TEMA-08 NO EXISTE");
        continue;
      }

      if (!t50) {
        console.log("   ⚠️  TEMA-50 no tiene este nivel");
        continue;
      }

      // Comparar tipo
      const t08Type = (t08.content_json as any)?.tipo;
      const t50Type = (t50.content_json as any)?.tipo;

      console.log(`   TEMA-08 tipo: ${t08Type}`);
      console.log(`   TEMA-50 tipo: ${t50Type}`);

      // Comparar contenido raíz
      if (nivel === 0) {
        const t08Struct = (t08.content_json as any)?.estructura;
        const t50Struct = (t50.content_json as any)?.estructura;
        const t08FirstApart = t08Struct?.[0]?.apartado;
        const t50FirstApart = t50Struct?.[0]?.apartado;
        console.log(`   TEMA-08 primer apartado: ${t08FirstApart}`);
        console.log(`   TEMA-50 primer apartado: ${t50FirstApart}`);
      } else if (nivel === 1) {
        const t08Keys = Object.keys((t08.content_json as any)?.keywords || {});
        const t50Keys = Object.keys((t50.content_json as any)?.keywords || {});
        console.log(`   TEMA-08 keywords count: ${t08Keys.length}`);
        console.log(`   TEMA-50 keywords count: ${t50Keys.length}`);
        if (t08Keys.length > 0) {
          console.log(`   TEMA-08 first key: ${t08Keys[0]}`);
        }
        if (t50Keys.length > 0) {
          console.log(`   TEMA-50 first key: ${t50Keys[0]}`);
        }
      } else if (nivel === 2 || nivel === 3) {
        const t08Text = (t08.content_json as any)?.texto?.substring(0, 100);
        const t50Text = (t50.content_json as any)?.texto?.substring(0, 100);
        console.log(`   TEMA-08 texto start: ${t08Text}`);
        console.log(`   TEMA-50 texto start: ${t50Text}`);
      } else if (nivel === 2.5 || nivel === 3.5) {
        const t08FC = (t08.content_json as any)?.flashcards?.length || 0;
        const t50FC = (t50.content_json as any)?.flashcards?.length || 0;
        console.log(`   TEMA-08 flashcards: ${t08FC}`);
        console.log(`   TEMA-50 flashcards: ${t50FC}`);
      }

      // Verificar si son IDÉNTICOS
      const t08JSON = JSON.stringify(t08.content_json);
      const t50JSON = JSON.stringify(t50.content_json);
      if (t08JSON === t50JSON) {
        console.log(`   ⚠️  ¡CONTENIDO IDÉNTICO! (Tema 08 = Tema 50)`);
      }
    }

    console.log("\n" + "=".repeat(80) + "\n");

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

debugTema08();

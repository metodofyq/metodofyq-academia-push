import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseServiceRole!);

async function audit() {
  console.log("📊 Auditando temas en la base de datos...\n");

  try {
    // Obtener todos los temas
    const { data: temas } = await supabase
      .from("topics")
      .select("id, code, title, subject")
      .order("code");

    if (!temas || temas.length === 0) {
      console.log("No hay temas");
      return;
    }

    console.log(`Total: ${temas.length} temas\n`);

    const results: any[] = [];

    for (const tema of temas) {
      // Contar niveles
      const { data: niveles } = await supabase
        .from("topic_levels")
        .select("level")
        .eq("topic_id", tema.id);

      const nivelCount = niveles?.length || 0;
      const hasContent = nivelCount >= 1;

      results.push({
        code: tema.code,
        title: tema.title.substring(0, 50),
        niveles: nivelCount,
        conContenido: hasContent
      });
    }

    // Mostrar tabla
    console.log("Tema      | Niveles | Contenido");
    console.log("----------|---------|----------");
    results.forEach((r) => {
      const status = r.conContenido ? "✅" : "❌";
      console.log(
        `${r.code.padEnd(9)}| ${r.niveles.toString().padEnd(7)}| ${status}`
      );
    });

    // Resumen
    const sinContenido = results.filter((r) => !r.conContenido);
    console.log(`\n📋 Resumen:`);
    console.log(`   ✅ Con contenido: ${results.length - sinContenido.length}`);
    console.log(`   ❌ Sin contenido: ${sinContenido.length}`);

    if (sinContenido.length > 0) {
      console.log(`\n🔄 Temas para clonar TEMA-50:`);
      sinContenido.forEach((t) => console.log(`   - ${t.code}`));
    }
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

audit();

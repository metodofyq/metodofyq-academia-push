import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as fs from "fs";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseServiceRole!);

async function loadPropuesta() {
  console.log("📝 Cargando propuesta didáctica de TEMA-21...\n");

  try {
    // Obtener TEMA-21
    const { data: tema } = await supabase
      .from("topics")
      .select("id")
      .eq("code", "TEMA-21")
      .single();

    if (!tema) {
      console.log("❌ TEMA-21 no encontrado. Ejecuta primero: npx tsx scripts/seed-tema-21.ts");
      process.exit(1);
    }

    // Leer propuesta
    const propuestaData = JSON.parse(
      fs.readFileSync("scripts/data/tema-21-propuesta.json", "utf-8")
    );

    // Verificar si ya existe
    const { data: existing } = await supabase
      .from("topic_propuesta_didactica")
      .select("id")
      .eq("topic_id", tema.id)
      .single();

    if (existing) {
      // Actualizar
      await supabase
        .from("topic_propuesta_didactica")
        .update({
          lectura: propuestaData.lectura,
          actividad: propuestaData.actividad
        })
        .eq("id", existing.id);
      console.log("✅ Propuesta didáctica actualizada");
    } else {
      // Crear
      await supabase
        .from("topic_propuesta_didactica")
        .insert({
          topic_id: tema.id,
          lectura: propuestaData.lectura,
          actividad: propuestaData.actividad
        });
      console.log("✅ Propuesta didáctica creada");
    }

    console.log("\n✨ TEMA-21 completamente cargado");
    console.log("\n🚀 Próximos pasos:");
    console.log("  1. git add scripts/data/tema-21-* scripts/seed-tema-21.ts scripts/load-propuesta-tema-21.ts");
    console.log("  2. git commit -m 'feat: TEMA-21 completo - Campo Magnético'");
    console.log("  3. git push");
    console.log("  4. vercel deploy --prod");

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

loadPropuesta();

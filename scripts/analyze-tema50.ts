import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function analyzeTema50() {
  console.log("\n📚 ANÁLISIS DE ESTRUCTURA TEMA-50\n");
  console.log("=".repeat(70));

  try {
    const { data: tema } = await supabase
      .from("topics")
      .select("*")
      .eq("code", "TEMA-50")
      .single();

    if (!tema) {
      console.log("TEMA-50 no encontrado");
      process.exit(1);
    }

    console.log(`\n✅ Tema encontrado: ${tema.title}`);
    console.log(`   Grupo: ${tema.grupo}\n`);

    const { data: levels } = await supabase
      .from("topic_levels")
      .select("level, content_json")
      .eq("topic_id", tema.id)
      .order("level");

    levels?.forEach((level: any) => {
      const content = level.content_json;
      console.log(`\n📝 NIVEL ${level.level}:`);
      
      if (level.level === 0) {
        console.log(`   Tipo: ${content.tipo}`);
        if (content.estructura) {
          console.log(`   Estructura: ${Array.isArray(content.estructura) ? 'Array' : 'String'}`);
          console.log(`   Primeros 100 chars: ${JSON.stringify(content.estructura).substring(0, 100)}`);
        }
      } else if (level.level === 1) {
        console.log(`   Tipo: ${content.tipo}`);
        if (content.apartados) {
          console.log(`   Apartados: ${Object.keys(content.apartados).length}`);
          console.log(`   Primer apartado keys: ${Object.keys(content.apartados[Object.keys(content.apartados)[0]]).join(', ')}`);
        } else if (content.keywords) {
          console.log(`   Keywords: ${Object.keys(content.keywords).length}`);
        }
      } else if (level.level === 0.5) {
        console.log(`   Tipo: Infografía`);
      } else {
        console.log(`   Tipo: ${content.tipo || 'desarrollo'}`);
        console.log(`   Tiene 'texto': ${!!content.texto}`);
        if (content.texto) {
          console.log(`   Primeros 80 chars: ${content.texto.substring(0, 80)}`);
        }
      }
    });

    // Propuesta didáctica
    const { data: propuesta } = await supabase
      .from("topic_propuesta_didactica")
      .select("*")
      .eq("topic_id", tema.id)
      .single();

    if (propuesta) {
      console.log(`\n✅ Propuesta didáctica cargada`);
      console.log(`   Campos: lectura, actividad, dinamica`);
      console.log(`   Dinámica: ${propuesta.dinamica}`);
    }

    // Legislación
    const { data: legislacion } = await supabase
      .from("topic_legislation_by_ccaa")
      .select("ccaa")
      .eq("topic_id", tema.id);

    if (legislacion?.length) {
      console.log(`\n✅ Legislación por CCAA: ${legislacion.length} CCAAs`);
      console.log(`   CCAAs: ${legislacion.map((l: any) => l.ccaa).join(', ')}`);
    }

    console.log("\n" + "=".repeat(70));
  } catch (error) {
    console.error("Error:", error);
  }
}

analyzeTema50();

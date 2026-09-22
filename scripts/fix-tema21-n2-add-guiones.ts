import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseServiceRole!);

async function fixN2Guiones() {
  console.log("🔧 Añadiendo guiones a conceptos clave en N2...\n");

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

    const { data: n2Level } = await supabase
      .from("topic_levels")
      .select("content_json")
      .eq("topic_id", tema.id)
      .eq("level", 2)
      .single();

    if (!n2Level) {
      console.log("❌ Nivel 2 no encontrado");
      process.exit(1);
    }

    const content = n2Level.content_json as Record<string, any>;
    let texto = content.texto || "";

    const lineas = texto.split("\n");
    const resultado: string[] = [];

    lineas.forEach((linea) => {
      const trimmed = linea.trim();

      // Si la línea está vacía, mantenerla
      if (!trimmed) {
        resultado.push(linea);
        return;
      }

      // Si es un título de apartado (1. 2. 3. etc)
      if (/^[\d]+\.(?!\d)/.test(trimmed)) {
        resultado.push(linea);
        return;
      }

      // Si es un subapartado (1.1 1.2 etc)
      if (/^[\d]+\.\d+/.test(trimmed)) {
        resultado.push(linea);
        return;
      }

      // Si es un concepto clave que ya tiene guión
      if (trimmed.startsWith("-")) {
        resultado.push(linea);
        return;
      }

      // Si es un concepto clave sin guión, agregarlo
      // Mantener la indentación original
      const espacios = linea.match(/^\s*/)?.[0] || "";
      resultado.push(espacios + "- " + trimmed);
    });

    const textoActualizado = resultado.join("\n");

    const updatedContent = {
      ...content,
      texto: textoActualizado,
    };

    const { error } = await supabase
      .from("topic_levels")
      .update({ content_json: updatedContent })
      .eq("topic_id", tema.id)
      .eq("level", 2);

    if (error) {
      console.error("❌ Error:", error.message);
      process.exit(1);
    }

    // Contar cambios
    const sinGuion = lineas.filter((l) => {
      const t = l.trim();
      return (
        t &&
        !/^[\d]+\.(?!\d)/.test(t) &&
        !/^[\d]+\.\d+/.test(t) &&
        !t.startsWith("-")
      );
    }).length;

    console.log("✅ N2 actualizado:");
    console.log(`   - ${sinGuion} conceptos clave sin guión → guión agregado`);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

fixN2Guiones();

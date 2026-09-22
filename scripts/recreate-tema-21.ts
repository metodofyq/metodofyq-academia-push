import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as fs from "fs";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseServiceRole!);

async function recreate() {
  console.log("🗑️ Eliminando TEMA-21 anterior...\n");

  try {
    // 1. Obtener TEMA-21
    const { data: tema } = await supabase
      .from("topics")
      .select("id")
      .eq("code", "TEMA-21")
      .single();

    if (!tema) {
      console.log("❌ TEMA-21 no encontrado");
      process.exit(1);
    }

    // 2. Eliminar todos los niveles
    console.log("Eliminando niveles...");
    await supabase
      .from("topic_levels")
      .delete()
      .eq("topic_id", tema.id);

    // 3. Eliminar todas las flashcards
    console.log("Eliminando flashcards...");
    await supabase
      .from("flashcards")
      .delete()
      .eq("topic_id", tema.id);

    // 4. Eliminar propuesta didáctica
    console.log("Eliminando propuesta...");
    await supabase
      .from("topic_propuesta_didactica")
      .delete()
      .eq("topic_id", tema.id);

    // 5. Eliminar el tema
    console.log("Eliminando tema...");
    await supabase
      .from("topics")
      .delete()
      .eq("id", tema.id);

    console.log("✅ TEMA-21 eliminado\n");

    // 6. Recrear tema
    console.log("📝 Recreando TEMA-21...");
    const { data: newTemaArray, error: insertError } = await supabase
      .from("topics")
      .insert({
        code: "TEMA-21",
        title: "Campo Magnético. Carácter No Conservativo Del Campo Magnético. Generación De Campos Magnéticos Y Efectos Sobre Cargas En Movimiento. Aplicación A Dispositivos Tecnológicos",
        subject: "fisica",
        grupo: 2,
        description: "Tema de Física: Campo Magnético y sus aplicaciones"
      })
      .select();

    if (insertError || !newTemaArray || newTemaArray.length === 0) {
      console.error("Error al crear tema:", insertError);
      process.exit(1);
    }

    const newTema = newTemaArray[0];

    console.log("✅ TEMA-21 recreado\n");

    // 7. Leer contenido limpios
    const baseDir = "/Users/jordiluquemas/proyectos/metodofyq-academia/tema-21-files";
    const n0Content = fs.readFileSync(`${baseDir}/t21 n0 sept.md`, "utf-8");
    const n1Content = fs.readFileSync(`${baseDir}/t21 n1 sept.md`, "utf-8");
    const n2Content = fs.readFileSync(`${baseDir}/t21 n2 sept.md`, "utf-8");
    const n3Content = fs.readFileSync(`${baseDir}/t21 n3 sept Grupo 1.md`, "utf-8");

    // 8. Insertar niveles
    console.log("📚 Insertando niveles...");

    // N0
    await supabase.from("topic_levels").insert({
      topic_id: newTema.id,
      level: 0,
      title: "Índice",
      content_json: {
        tipo: "indice",
        estructura: [
          { apartado: "0. Introducción" },
          {
            apartado: "1. Campo magnético",
            subapartados: [
              { titulo: "1.1. Concepto, unidad y representación del campo magnético" },
              { titulo: "1.2. Líneas de campo, flujo magnético, ausencia de monopolos y comparación con el campo eléctrico" }
            ]
          },
          {
            apartado: "2. Carácter no conservativo del campo magnético",
            subapartados: [
              { titulo: "2.1. Circulación del campo magnético" },
              { titulo: "2.2. Relación con la ley de Ampère" },
              { titulo: "2.3. Matiz entre campo no conservativo y trabajo de la fuerza magnética" }
            ]
          },
          {
            apartado: "3. Generación de campos magnéticos",
            subapartados: [
              { titulo: "3.1. Generación por corrientes eléctricas: experiencia de Oersted" },
              { titulo: "3.2. Ley de Biot-Savart y campo de un conductor rectilíneo" },
              { titulo: "3.3. Ley de Ampère: solenoide, espira y toroide" },
              { titulo: "3.4. Imanes permanentes, materiales magnéticos y campos variables" }
            ]
          },
          {
            apartado: "4. Efectos sobre cargas en movimiento",
            subapartados: [
              { titulo: "4.1. Fuerza magnética sobre una carga eléctrica" },
              { titulo: "4.2. Fuerza de Lorentz" },
              { titulo: "4.3. Movimiento circular y helicoidal de partículas cargadas" },
              { titulo: "4.4. Fuerza magnética sobre corrientes eléctricas" }
            ]
          },
          {
            apartado: "5. Aplicación a dispositivos tecnológicos",
            subapartados: [
              { titulo: "5.1. Selector de velocidades" },
              { titulo: "5.2. Espectrómetro de masas" },
              { titulo: "5.3. Ciclotrón" },
              { titulo: "5.4. Otras aplicaciones tecnológicas actuales" }
            ]
          },
          { apartado: "6. Conclusiones" }
        ]
      }
    });
    console.log("  ✅ N0 insertado");

    // N1
    await supabase.from("topic_levels").insert({
      topic_id: newTema.id,
      level: 1,
      title: "Palabras clave",
      content_json: {
        tipo: "palabras_clave",
        texto: n1Content
      }
    });
    console.log("  ✅ N1 insertado");

    // N2
    await supabase.from("topic_levels").insert({
      topic_id: newTema.id,
      level: 2,
      title: "Desarrollo esquemático",
      content_json: {
        tipo: "desarrollo_esquematico",
        texto: n2Content
      }
    });
    console.log("  ✅ N2 insertado");

    // N3
    await supabase.from("topic_levels").insert({
      topic_id: newTema.id,
      level: 3,
      title: "Redacción completa",
      content_json: {
        tipo: "redaccion_completa",
        texto: n3Content
      }
    });
    console.log("  ✅ N3 insertado");

    // Propuesta
    const propuestaData = JSON.parse(
      fs.readFileSync("/Users/jordiluquemas/proyectos/metodofyq-academia/scripts/data/tema-21-propuesta.json", "utf-8")
    );
    await supabase.from("topic_propuesta_didactica").insert({
      topic_id: newTema.id,
      lectura: propuestaData.lectura,
      actividad: propuestaData.actividad
    });
    console.log("  ✅ Propuesta insertada");

    console.log("\n✨ TEMA-21 completamente recreado");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

recreate();

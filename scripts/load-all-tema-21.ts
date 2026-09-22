import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as fs from "fs";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseServiceRole!);

async function loadAll() {
  console.log("🚀 Cargando TEMA-21 completamente...\n");

  try {
    // 1. Obtener o crear TEMA-21
    const { data: existingTema } = await supabase
      .from("topics")
      .select("id")
      .eq("code", "TEMA-21")
      .single();

    let topicId: string;
    if (existingTema) {
      topicId = existingTema.id;
      console.log("✅ TEMA-21 encontrado");

      // Limpiar contenido anterior
      console.log("Limpiando contenido anterior...");
      await supabase.from("topic_levels").delete().eq("topic_id", topicId);
      await supabase.from("flashcards").delete().eq("topic_id", topicId);
      await supabase.from("topic_propuesta_didactica").delete().eq("topic_id", topicId);
      console.log("✅ Contenido anterior eliminado");
    } else {
      console.log("Creando TEMA-21...");
      const { data: newTema, error: insertError } = await supabase
        .from("topics")
        .insert({
          code: "TEMA-21",
          title: "Campo Magnético. Carácter No Conservativo Del Campo Magnético. Generación De Campos Magnéticos Y Efectos Sobre Cargas En Movimiento. Aplicación A Dispositivos Tecnológicos",
          subject: "fisica",
          description: "Tema de Física: Campo Magnético y sus aplicaciones",
          order_index: 21
        })
        .select()
        .single();

      if (insertError || !newTema) {
        throw new Error(`No se pudo crear tema: ${insertError?.message}`);
      }
      topicId = newTema.id;
      console.log("✅ TEMA-21 creado");
    }

    // 2. Leer contenido limpio
    const baseDir = "/Users/jordiluquemas/proyectos/metodofyq-academia/tema-21-files";
    const n0Content = fs.readFileSync(`${baseDir}/t21 n0 sept.md`, "utf-8");
    const n1Content = fs.readFileSync(`${baseDir}/t21 n1 sept.md`, "utf-8");
    const n2Content = fs.readFileSync(`${baseDir}/t21 n2 sept.md`, "utf-8");
    const n3Content = fs.readFileSync(`${baseDir}/t21 n3 sept Grupo 1.md`, "utf-8");

    console.log("\n📚 Insertando niveles...");

    // N0
    await supabase.from("topic_levels").insert({
      topic_id: topicId,
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
    console.log("  ✅ N0");

    await supabase.from("topic_levels").insert({
      topic_id: topicId,
      level: 1,
      title: "Palabras clave",
      content_json: { tipo: "palabras_clave", texto: n1Content }
    });
    console.log("  ✅ N1");

    await supabase.from("topic_levels").insert({
      topic_id: topicId,
      level: 2,
      title: "Desarrollo esquemático",
      content_json: { tipo: "desarrollo_esquematico", texto: n2Content }
    });
    console.log("  ✅ N2");

    await supabase.from("topic_levels").insert({
      topic_id: topicId,
      level: 3,
      title: "Redacción completa",
      content_json: { tipo: "redaccion_completa", texto: n3Content }
    });
    console.log("  ✅ N3");

    // Flashcards
    console.log("\n📇 Insertando flashcards...");
    const n25Data = JSON.parse(
      fs.readFileSync("/Users/jordiluquemas/proyectos/metodofyq-academia/scripts/data/tema-21-n25.json", "utf-8")
    );
    const flashcardsN25 = n25Data.flashcards.map((fc: any) => ({
      topic_id: topicId,
      nivel: "2.5",
      apartado: fc.apartado,
      subapartado: fc.subapartado,
      pregunta: fc.pregunta,
      respuesta: fc.respuesta
    }));
    if (flashcardsN25.length > 0) {
      await supabase.from("flashcards").insert(flashcardsN25);
      console.log(`  ✅ ${flashcardsN25.length} N2.5`);
    }

    const n35Data = JSON.parse(
      fs.readFileSync("/Users/jordiluquemas/proyectos/metodofyq-academia/scripts/data/tema-21-n35.json", "utf-8")
    );
    const flashcardsN35 = n35Data.flashcards.map((fc: any) => ({
      topic_id: topicId,
      nivel: "3.5",
      apartado: fc.apartado,
      subapartado: fc.subapartado,
      pregunta: fc.pregunta,
      respuesta: fc.respuesta
    }));
    if (flashcardsN35.length > 0) {
      await supabase.from("flashcards").insert(flashcardsN35);
      console.log(`  ✅ ${flashcardsN35.length} N3.5`);
    }

    // Propuesta
    console.log("\n💡 Propuesta didáctica...");
    const propuestaData = JSON.parse(
      fs.readFileSync("/Users/jordiluquemas/proyectos/metodofyq-academia/scripts/data/tema-21-propuesta.json", "utf-8")
    );
    await supabase.from("topic_propuesta_didactica").insert({
      topic_id: topicId,
      lectura: propuestaData.lectura,
      actividad: propuestaData.actividad
    });
    console.log("  ✅ Propuesta");

    console.log("\n✨ TEMA-21 completamente cargado");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

loadAll();

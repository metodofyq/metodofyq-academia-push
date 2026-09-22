import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as fs from "fs";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseServiceRole!);

async function seedTema21() {
  console.log("🚀 Cargando TEMA-21 (clonado de TEMA-50)...\n");

  try {
    // 1. Verificar si TEMA-21 ya existe
    let { data: tema21 } = await supabase
      .from("topics")
      .select("id")
      .eq("code", "TEMA-21")
      .single();

    if (!tema21) {
      console.log("📝 Creando TEMA-21...");
      const { data: newTema } = await supabase
        .from("topics")
        .insert({
          code: "TEMA-21",
          title: "Campo Magnético. Carácter No Conservativo Del Campo Magnético. Generación De Campos Magnéticos Y Efectos Sobre Cargas En Movimiento. Aplicación A Dispositivos Tecnológicos",
          subject: "fisica",
          grupo: 2,
          description: "Tema de Física: Campo Magnético y sus aplicaciones"
        })
        .select()
        .single();
      tema21 = newTema;
      console.log("✅ TEMA-21 creado");
    } else {
      console.log("✅ TEMA-21 ya existe");
    }

    // 2. Leer contenido de TEMA-21
    const n0Content = fs.readFileSync("/Users/jordiluquemas/proyectos/metodofyq-academia/tema-21-files/t21 n0 sept.md", "utf-8");
    const n1Content = fs.readFileSync("/Users/jordiluquemas/proyectos/metodofyq-academia/tema-21-files/t21 n1 sept.md", "utf-8");
    const n2Content = fs.readFileSync("/Users/jordiluquemas/proyectos/metodofyq-academia/tema-21-files/t21 n2 sept.md", "utf-8");
    const n3Content = fs.readFileSync("/Users/jordiluquemas/proyectos/metodofyq-academia/tema-21-files/t21 n3 sept Grupo 1.md", "utf-8");

    console.log("\n📚 Insertando niveles...");

    // 3. Nivel 0: Índice
    await supabase
      .from("topic_levels")
      .upsert({
        topic_id: tema21.id,
        level: 0,
        title: "Índice",
        content_json: {
          tipo: "indice",
          estructura: [
            {
              apartado: "0. Introducción"
            },
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
            {
              apartado: "6. Conclusiones"
            }
          ]
        }
      });
    console.log("  ✅ N0 (Índice) insertado");

    // 4. Nivel 1: Palabras clave
    await supabase
      .from("topic_levels")
      .upsert({
        topic_id: tema21.id,
        level: 1,
        title: "Palabras clave",
        content_json: {
          tipo: "palabras_clave",
          texto: n1Content
        }
      });
    console.log("  ✅ N1 (Palabras clave) insertado");

    // 5. Nivel 2: Desarrollo esquemático
    await supabase
      .from("topic_levels")
      .upsert({
        topic_id: tema21.id,
        level: 2,
        title: "Desarrollo esquemático",
        content_json: {
          tipo: "desarrollo_esquematico",
          texto: n2Content
        }
      });
    console.log("  ✅ N2 (Desarrollo) insertado");

    // 6. Nivel 3: Redacción completa
    await supabase
      .from("topic_levels")
      .upsert({
        topic_id: tema21.id,
        level: 3,
        title: "Redacción completa",
        content_json: {
          tipo: "redaccion_completa",
          texto: n3Content
        }
      });
    console.log("  ✅ N3 (Redacción) insertado");

    console.log("\n✨ TEMA-21 cargado completamente");
    console.log("\n📋 Próximos pasos:");
    console.log("  1. Cargar flashcards N2.5: npx tsx scripts/load-flashcards.ts scripts/data/tema-21-n25.json");
    console.log("  2. Cargar flashcards N3.5: npx tsx scripts/load-flashcards.ts scripts/data/tema-21-n35.json");
    console.log("  3. Cargar propuesta: npx tsx scripts/load-propuesta.ts");

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

seedTema21();

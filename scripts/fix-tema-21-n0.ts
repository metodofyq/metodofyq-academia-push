import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseServiceRole!);

async function fixN0() {
  console.log("🔧 Arreglando N0 de TEMA-21...\n");

  try {
    // Obtener TEMA-21
    const { data: tema } = await supabase
      .from("topics")
      .select("id")
      .eq("code", "TEMA-21")
      .single();

    if (!tema) {
      console.log("❌ TEMA-21 no encontrado");
      process.exit(1);
    }

    // Actualizar N0 con estructura correcta
    const correctN0 = {
      tipo: "indice",
      estructura: [
        {
          apartado: "0. Introducción",
          subapartados: []
        },
        {
          apartado: "1. Campo magnético",
          subapartados: [
            "1.1. Concepto, unidad y representación del campo magnético",
            "1.2. Líneas de campo, flujo magnético, ausencia de monopolos y comparación con el campo eléctrico"
          ]
        },
        {
          apartado: "2. Carácter no conservativo del campo magnético",
          subapartados: [
            "2.1. Circulación del campo magnético",
            "2.2. Relación con la ley de Ampère",
            "2.3. Matiz entre campo no conservativo y trabajo de la fuerza magnética"
          ]
        },
        {
          apartado: "3. Generación de campos magnéticos",
          subapartados: [
            "3.1. Generación por corrientes eléctricas: experiencia de Oersted",
            "3.2. Ley de Biot-Savart y campo de un conductor rectilíneo",
            "3.3. Ley de Ampère: solenoide, espira y toroide",
            "3.4. Imanes permanentes, materiales magnéticos y campos variables"
          ]
        },
        {
          apartado: "4. Efectos sobre cargas en movimiento",
          subapartados: [
            "4.1. Fuerza magnética sobre una carga eléctrica",
            "4.2. Fuerza de Lorentz",
            "4.3. Movimiento circular y helicoidal de partículas cargadas",
            "4.4. Fuerza magnética sobre corrientes eléctricas"
          ]
        },
        {
          apartado: "5. Aplicación a dispositivos tecnológicos",
          subapartados: [
            "5.1. Selector de velocidades",
            "5.2. Espectrómetro de masas",
            "5.3. Ciclotrón",
            "5.4. Otras aplicaciones tecnológicas actuales"
          ]
        },
        {
          apartado: "6. Conclusiones",
          subapartados: []
        }
      ]
    };

    await supabase
      .from("topic_levels")
      .update({ content_json: correctN0 })
      .eq("topic_id", tema.id)
      .eq("level", 0);

    console.log("✅ N0 arreglado correctamente");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

fixN0();

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseServiceRole!);

const N1_KEYWORDS = {
  "1.1. Concepto, unidad y representación del campo magnético":
    "Campo vectorial B · Cómo se detecta B · Maxwell · Régimen estacionario",

  "1.2. Líneas de campo, flujo magnético, ausencia de monopolos y comparación con el campo eléctrico":
    "Líneas de campo · Líneas magnéticas · No existen Monopolos magnéticos clásicos · Ausencia de monopolos · Flujo magnético",

  "2.1. Circulación del campo magnético":
    "Campo conservativo · Potencial escalar global · Corriente enlazada · Circulación conecta geometría y fuente eléctrica",

  "2.2. Relación con la ley de Ampère":
    "Ley de Ampère · Hilo rectilíneo · Corrientes estacionarias · Rotacional de B",

  "2.3. Matiz entre campo no conservativo y trabajo de la fuerza magnética":
    "Trabajo magnético · Fuerza magnética · Campo magnético cambia · Región sin corriente",

  "3.1. Generación por corrientes eléctricas: experiencia de Oersted":
    "Corriente eléctrica con brújula · Electricidad y magnetismo · Corriente en conductor",

  "3.2. Ley de Biot-Savart y campo de un conductor rectilíneo":
    "Ley de Biot-Savart · Producto vectorial · Conductor rectilíneo · Regla de la mano derecha",

  "3.3. Ley de Ampère: solenoide, espira y toroide":
    "Ley de Ampère · Solenoide · Espira · Toroide · Electroimán y transformador",

  "3.4. Imanes permanentes, materiales magnéticos y campos variables":
    "Imán permanente · Ferromagnetismo · Diamagnetismo · Paramagnetismo · Término de Maxwell",

  "4.1. Fuerza magnética sobre una carga eléctrica":
    "Fuerza magnética · Regla de la mano derecha · Carga positiva y negativa",

  "4.2. Fuerza de Lorentz":
    "Fuerza de Lorentz · Influencia Campo eléctrico · Influencia Campo magnético · Campos combinados",

  "4.3. Movimiento circular y helicoidal de partículas cargadas":
    "Fuerza magnética = centrípeta · Energía cinética · Radio orbital · Velocidad angular · Componente paralela · Componente perpendicular · Trayectoria helicoidal · Plasmas",

  "4.4. Fuerza magnética sobre corrientes eléctricas":
    "Corriente eléctrica · Fuerza magnética · Aplicaciones",

  "5.1. Selector de velocidades":
    "E y B perpendiculares · Condición equilibrio · Velocidad seleccionada · Partículas que atraviesan",

  "5.2. Espectrómetro de masas":
    "Relación carga-masa · Trayectoria circular · Radio de curvatura · Isótopos",

  "5.3. Ciclotrón":
    "Partículas cargadas · Electrodos semicirculares · Frecuencia de resonancia · Energia final · Aplicacione · Limitación relativista",

  "5.4. Otras aplicaciones tecnológicas actuales":
    "Motores eléctricos · Sensores Hall · RMN · Electroimán"
};

async function fixN1() {
  console.log("🔧 Corrigiendo formato de N1 en TEMA-21...\n");

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

    const correctN1 = {
      tipo: "palabras_clave",
      keywords: N1_KEYWORDS
    };

    await supabase
      .from("topic_levels")
      .update({ content_json: correctN1 })
      .eq("topic_id", tema.id)
      .eq("level", 1);

    console.log("✅ N1 corregido con formato de keywords");
    console.log(`   Total de apartados/subapartados: ${Object.keys(N1_KEYWORDS).length}`);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

fixN1();

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseServiceRole!);

async function addPropuesta() {
  console.log("📝 Tarea 3: Agregando propuesta didáctica a TEMA-19...");

  try {
    const { data: tema } = await supabase
      .from("topics")
      .select("id")
      .eq("code", "TEMA-19")
      .single();

    if (!tema) {
      console.log("❌ TEMA-19 no encontrado");
      process.exit(1);
    }

    const propuestaContenido = `Este tema puede trasladarse al aula mediante un debate científico guiado sobre la implantación obligatoria de precipitadores electrostáticos en industrias emisoras de partículas PM10 y PM2,5, vinculado a su impacto ambiental, tecnológico, sanitario y económico. La controversia puede formularse así: ¿deben exigirse sistemas electrostáticos de filtrado aunque aumenten los costes de producción? Antes del debate, puede realizarse una demostración breve de electrización por frotamiento, atracción de papelitos o simulación de partículas cargadas en un campo eléctrico.

La clase se organizará con un tercio del alumnado defendiendo la medida por su contribución a la mejora de la calidad del aire y la salud pública; otro tercio adoptará una postura crítica, atendiendo al coste, consumo energético, mantenimiento y viabilidad para pequeñas empresas; y el resto asumirá moderación, síntesis, contraste de evidencias y valoración final.

El alumnado argumentará a partir de gráficos de PM10/PM2,5, esquemas de precipitadores electrostáticos, datos de eficiencia antes/después, comparación con filtros HEPA o filtros de mangas y noticias o informes ambientales. Deberá diferenciar hechos, opiniones e inferencias, usando conceptos como carga eléctrica, campo, potencial, fuerza electrostática, conductores, dieléctricos y apantallamiento. Para favorecer la inclusión, se ofrecerán apoyos visuales, guías de argumentación, vocabulario clave, roles cooperativos y participación oral o escrita. La actividad se evaluará con una rúbrica breve de argumentación científica, sin desplazar el desarrollo conceptual del tema.`;

    const { error: upsertError } = await supabase
      .from("topic_propuesta_didactica")
      .upsert(
        {
          topic_id: tema.id,
          lectura: propuestaContenido,
          actividad: propuestaContenido,
          dinamica: "dictado-corrector",
        },
        { onConflict: "topic_id" }
      );

    if (upsertError) {
      console.error("❌ Error:", upsertError.message);
      process.exit(1);
    }

    console.log("✅ Tarea 3: Propuesta didáctica agregada correctamente");
  } catch (error) {
    console.error("❌ Error fatal:", error);
    process.exit(1);
  }
}

addPropuesta();

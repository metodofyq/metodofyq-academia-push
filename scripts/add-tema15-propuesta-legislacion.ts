import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseServiceRole!);

async function addPropuestaAndLegislacion() {
  console.log("\n🎯 AGREGANDO PROPUESTA DIDÁCTICA Y LEGISLACIÓN\n");
  console.log("=".repeat(70));

  try {
    const { data: tema } = await supabase
      .from("topics")
      .select("id")
      .eq("code", "TEMA-15")
      .single();

    if (!tema) {
      console.log("❌ TEMA-15 no encontrado");
      process.exit(1);
    }

    // PROPUESTA DIDÁCTICA
    const propuestaContenido = `Este tema puede trasladarse al aula mediante un debate científico guiado sobre la eficiencia energética en viviendas, centros educativos y dispositivos tecnológicos, especialmente en relación con el aislamiento térmico, la climatización, la refrigeración electrónica y el consumo energético. La controversia puede plantearse así: ¿debe priorizarse la inversión en aislamiento térmico y sistemas de climatización eficientes, aunque suponga un mayor coste inicial?

La clase se organizará de forma que al menos un tercio del alumnado defienda una postura favorable a la mejora del aislamiento, la eficiencia térmica y el uso de tecnologías de refrigeración más sostenibles, mientras que otro tercio adoptará una postura crítica, valorando el coste económico, la viabilidad técnica, el acceso desigual a estas mejoras o el impacto ambiental de los materiales empleados. El resto del grupo asumirá funciones de moderación, síntesis, contraste de evidencias y valoración final.

El alumnado deberá argumentar a partir de datos de consumo energético, gráficos de pérdidas térmicas, etiquetas de eficiencia, noticias científicas sobre refrigeración electrónica, informes sobre climatización o casos reales de rehabilitación energética de edificios, diferenciando hechos, opiniones e inferencias. Para favorecer la inclusión, se ofrecerán apoyos visuales, guías de argumentación, vocabulario científico graduado, roles cooperativos y distintas formas de participación oral o escrita. La actividad puede evaluarse mediante una breve rúbrica de argumentación científica, abordando contenidos como conducción, convección, radiación, conductividad térmica, equilibrio térmico y selección de materiales de forma competencial e innovadora sin desplazar el desarrollo científico del tema.`;

    console.log("📝 Cargando propuesta didáctica...");
    const { error: propError } = await supabase
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

    if (propError) {
      console.error("❌ Error:", propError.message);
      process.exit(1);
    }
    console.log("✅ Propuesta didáctica cargada\n");

    // LEGISLACIÓN POR CCAA
    const legislacionData = [
      {
        topic_id: tema.id,
        ccaa: "Aragón",
        contenido: "El tema se enmarca en la normativa vigente estatal y autonómica. La Ley Orgánica 2/2006, modificada por la Ley Orgánica 3/2020, junto con los Reales Decretos 217/2022 y 243/2022, establecen el marco curricular de ESO y Bachillerato. En Aragón, las Órdenes ECD/1172/2022 y ECD/1173/2022 concretan estos currículos y permiten contextualizar el tema en Física y Química de ESO y de forma específica en Física de Bachillerato."
      },
      {
        topic_id: tema.id,
        ccaa: "Castilla y León",
        contenido: "El tema se enmarca en la normativa vigente estatal y autonómica. La Ley Orgánica 2/2006, modificada por la Ley Orgánica 3/2020, junto con los Reales Decretos 217/2022 y 243/2022, establecen el marco curricular de ESO y Bachillerato. En Castilla y León, los Decretos 39/2022 y 40/2022 concretan estos currículos y permiten contextualizar el tema en Física y Química de ESO y de forma específica en Física de Bachillerato."
      },
      {
        topic_id: tema.id,
        ccaa: "Comunitat Valenciana",
        contenido: "El tema se enmarca en la normativa vigente estatal y autonómica. La Ley Orgánica 2/2006, modificada por la Ley Orgánica 3/2020, junto con los Reales Decretos 217/2022 y 243/2022, establecen el marco curricular de ESO y Bachillerato. En la Comunitat Valenciana, los Decretos 107/2022 y 108/2022 concretan estos currículos y permiten contextualizar el tema en Física y Química de ESO y de forma específica en Física de Bachillerato."
      },
      {
        topic_id: tema.id,
        ccaa: "Navarra",
        contenido: "El tema se enmarca en la normativa vigente estatal y autonómica. La Ley Orgánica 2/2006, modificada por la Ley Orgánica 3/2020, junto con los Reales Decretos 217/2022 y 243/2022, establecen el marco curricular de ESO y Bachillerato. En la Comunidad Foral de Navarra, los Decretos Forales 71/2022 y 72/2022 concretan estos currículos y permiten contextualizar el tema en Física y Química de ESO y de forma específica en Física de Bachillerato."
      },
      {
        topic_id: tema.id,
        ccaa: "La Rioja",
        contenido: "El tema se enmarca en la normativa vigente estatal y autonómica. La Ley Orgánica 2/2006, modificada por la Ley Orgánica 3/2020, junto con los Reales Decretos 217/2022 y 243/2022, establecen el marco curricular de ESO y Bachillerato. En La Rioja, los Decretos 42/2022 y 43/2022 concretan estos currículos y permiten contextualizar el tema en Física y Química de ESO y de forma específica en Física de Bachillerato."
      }
    ];

    console.log("📝 Cargando legislación por CCAA...");
    const { error: legError } = await supabase
      .from("topic_legislation_by_ccaa")
      .upsert(legislacionData, { onConflict: "topic_id,ccaa" });

    if (legError) {
      console.error("❌ Error:", legError.message);
      process.exit(1);
    }
    console.log("✅ Legislación por CCAA cargada (5 CCAAs)\n");

    console.log("=".repeat(70));
    console.log("✅ TEMA-15 completamente configurado\n");
  } catch (error) {
    console.error("❌ Error fatal:", error);
    process.exit(1);
  }
}

addPropuestaAndLegislacion();

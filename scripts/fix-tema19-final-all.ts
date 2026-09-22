import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseServiceRole!);

async function fixTema19Final() {
  console.log("🔧 Ejecutando Tareas 1, 2, 3 y 4...\n");

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

    // ===== TAREA 1: Arreglar N3 negrita en títulos =====
    console.log("📝 Tarea 1: Arreglando negrita en N3...");
    const { data: n3Level } = await supabase
      .from("topic_levels")
      .select("content_json")
      .eq("topic_id", tema.id)
      .eq("level", 3)
      .single();

    if (n3Level) {
      const content = n3Level.content_json as Record<string, any>;
      let texto = content.texto || "";

      // Remover markdown y aplicar negrita al HTML renderizado
      // Reemplazar markdown headers con párrafos en negrita
      texto = texto.replace(/^## \*\*(.*?)\*\*$/gm, "**$1**");
      texto = texto.replace(/^### \*\*(.*?)\*\*$/gm, "**$1**");

      const updatedContent = {
        ...content,
        texto: texto,
        "texto-fantasma": texto,
      };

      const { error: n3Error } = await supabase
        .from("topic_levels")
        .update({ content_json: updatedContent })
        .eq("topic_id", tema.id)
        .eq("level", 3);

      if (n3Error) {
        console.error("❌ Error en Tarea 1:", n3Error.message);
      } else {
        console.log("✅ Tarea 1: N3 negrita arreglada");
      }
    }

    // ===== TAREA 2: Arreglar N2 guiones duplicados =====
    console.log("📝 Tarea 2: Eliminando guiones duplicados en N2...");
    const { data: n2Level } = await supabase
      .from("topic_levels")
      .select("content_json")
      .eq("topic_id", tema.id)
      .eq("level", 2)
      .single();

    if (n2Level) {
      const content = n2Level.content_json as Record<string, any>;
      let texto = content.texto || "";

      // Patrón: guión solo en una línea seguido de guión en la siguiente
      // -\n- → -\n
      // Después: -\n → - 
      texto = texto.replace(/^-\s*$/gm, "");  // Remover líneas que solo contienen guiones
      texto = texto.replace(/^\n\s*- /gm, "\n- ");  // Normalizar espacios antes de guiones

      const updatedContent = {
        ...content,
        texto: texto,
      };

      const { error: n2Error } = await supabase
        .from("topic_levels")
        .update({ content_json: updatedContent })
        .eq("topic_id", tema.id)
        .eq("level", 2);

      if (n2Error) {
        console.error("❌ Error en Tarea 2:", n2Error.message);
      } else {
        console.log("✅ Tarea 2: N2 guiones arreglados");
      }
    }

    // ===== TAREA 3: Cargar propuesta didáctica =====
    console.log("📝 Tarea 3: Cargando propuesta didáctica...");
    
    const propuestaDidactica = `Este tema puede trasladarse al aula mediante un debate científico guiado sobre la implantación obligatoria de precipitadores electrostáticos en industrias emisoras de partículas PM10 y PM2,5, vinculado a su impacto ambiental, tecnológico, sanitario y económico. La controversia puede formularse así: ¿deben exigirse sistemas electrostáticos de filtrado aunque aumenten los costes de producción? Antes del debate, puede realizarse una demostración breve de electrización por frotamiento, atracción de papelitos o simulación de partículas cargadas en un campo eléctrico.

La clase se organizará con un tercio del alumnado defendiendo la medida por su contribución a la mejora de la calidad del aire y la salud pública; otro tercio adoptará una postura crítica, atendiendo al coste, consumo energético, mantenimiento y viabilidad para pequeñas empresas; y el resto asumirá moderación, síntesis, contraste de evidencias y valoración final.

El alumnado argumentará a partir de gráficos de PM10/PM2,5, esquemas de precipitadores electrostáticos, datos de eficiencia antes/después, comparación con filtros HEPA o filtros de mangas y noticias o informes ambientales. Deberá diferenciar hechos, opiniones e inferencias, usando conceptos como carga eléctrica, campo, potencial, fuerza electrostática, conductores, dieléctricos y apantallamiento. Para favorecer la inclusión, se ofrecerán apoyos visuales, guías de argumentación, vocabulario clave, roles cooperativos y participación oral o escrita. La actividad se evaluará con una rúbrica breve de argumentación científica, sin desplazar el desarrollo conceptual del tema.`;

    // Upsert propuesta didáctica
    const { error: propError } = await supabase
      .from("topic_levels")
      .upsert({
        topic_id: tema.id,
        level: NaN,  // Nivel especial
        content_json: {
          tipo: "propuesta_didactica",
          texto: propuestaDidactica
        }
      }, { onConflict: "topic_id,level" });

    if (propError) {
      console.error("❌ Error en Tarea 3:", propError.message);
    } else {
      console.log("✅ Tarea 3: Propuesta didáctica cargada");
    }

    // ===== TAREA 4: Agregar legislación por CCAA =====
    console.log("📝 Tarea 4: Agregando legislación por CCAA...");
    
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

    const { error: legError } = await supabase
      .from("topic_legislation_by_ccaa")
      .upsert(legislacionData, { onConflict: "topic_id,ccaa" });

    if (legError) {
      console.error("❌ Error en Tarea 4:", legError.message);
    } else {
      console.log("✅ Tarea 4: Legislación por CCAA agregada (5 CCAAs)");
    }

    console.log("\n✅ Todas las tareas completadas");
  } catch (error) {
    console.error("❌ Error fatal:", error);
    process.exit(1);
  }
}

fixTema19Final();

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const LEGISLACION_TEMPLATES = {
  Aragón: (materia: string) => `El tema se enmarca en la normativa vigente estatal y autonómica. La Ley Orgánica 2/2006, modificada por la Ley Orgánica 3/2020, junto con los Reales Decretos 217/2022 y 243/2022, establecen el marco curricular de ESO y Bachillerato. En Aragón, las Órdenes ECD/1172/2022 y ECD/1173/2022 concretan estos currículos y permiten contextualizar el tema en Física y Química de ESO y en ${materia} de Bachillerato.`,
  
  "Castilla y León": (materia: string) => `El tema se enmarca en la normativa vigente estatal y autonómica. La Ley Orgánica 2/2006, modificada por la Ley Orgánica 3/2020, junto con los Reales Decretos 217/2022 y 243/2022, establecen el marco curricular de ESO y Bachillerato. En Castilla y León, los Decretos 39/2022 y 40/2022 concretan estos currículos y permiten contextualizar el tema en Física y Química de ESO y en ${materia} de Bachillerato.`,
  
  "Comunitat Valenciana": (materia: string) => `El tema se enmarca en la normativa vigente estatal y autonómica. La Ley Orgánica 2/2006, modificada por la Ley Orgánica 3/2020, junto con los Reales Decretos 217/2022 y 243/2022, establecen el marco curricular de ESO y Bachillerato. En la Comunitat Valenciana, los Decretos 107/2022 y 108/2022 concretan estos currículos y permiten contextualizar el tema en Física y Química de ESO y en ${materia} de Bachillerato.`,
  
  Navarra: (materia: string) => `El tema se enmarca en la normativa vigente estatal y autonómica. La Ley Orgánica 2/2006, modificada por la Ley Orgánica 3/2020, junto con los Reales Decretos 217/2022 y 243/2022, establecen el marco curricular de ESO y Bachillerato. En la Comunidad Foral de Navarra, los Decretos Forales 71/2022 y 72/2022 concretan estos currículos y permiten contextualizar el tema en Física y Química de ESO y en ${materia} de Bachillerato.`,
  
  "La Rioja": (materia: string) => `El tema se enmarca en la normativa vigente estatal y autonómica. La Ley Orgánica 2/2006, modificada por la Ley Orgánica 3/2020, junto con los Reales Decretos 217/2022 y 243/2022, establecen el marco curricular de ESO y Bachillerato. En La Rioja, los Decretos 42/2022 y 43/2022 concretan estos currículos y permiten contextualizar el tema en Física y Química de ESO y en ${materia} de Bachillerato.`
};

const CCAAS = ["Aragón", "Castilla y León", "Comunitat Valenciana", "Navarra", "La Rioja"];

async function addLegislacionAllTemas() {
  console.log("\n📜 AGREGANDO LEGISLACIÓN A TODOS LOS TEMAS\n");
  console.log("=".repeat(70));

  try {
    // Obtener todos los temas
    const { data: temas } = await supabase
      .from("topics")
      .select("id, code, subject");

    if (!temas || temas.length === 0) {
      console.log("❌ No se encontraron temas");
      process.exit(1);
    }

    console.log(`📚 Total de temas encontrados: ${temas.length}\n`);

    let totalAdded = 0;
    let totalSkipped = 0;

    for (const tema of temas) {
      // Determinar la materia (Física o Química) basándose en el subject
      const materia = tema.subject?.includes("Química") ? "Química" : "Física";
      
      // Crear registros de legislación para cada CCAA
      const legislacionData = CCAAS.map(ccaa => ({
        topic_id: tema.id,
        ccaa,
        contenido: LEGISLACION_TEMPLATES[ccaa as keyof typeof LEGISLACION_TEMPLATES](materia)
      }));

      // Verificar si ya existe legislación para este tema
      const { data: existing } = await supabase
        .from("topic_legislation_by_ccaa")
        .select("id")
        .eq("topic_id", tema.id)
        .limit(1);

      if (existing && existing.length > 0) {
        console.log(`⏭️  ${tema.code}: Ya tiene legislación, omitido`);
        totalSkipped++;
        continue;
      }

      // Insertar legislación
      const { error } = await supabase
        .from("topic_legislation_by_ccaa")
        .insert(legislacionData);

      if (error) {
        console.error(`❌ ${tema.code}: Error - ${error.message}`);
      } else {
        console.log(`✅ ${tema.code}: Legislación agregada (${materia}) - 5 CCAAs`);
        totalAdded++;
      }
    }

    console.log("\n" + "=".repeat(70));
    console.log(`\n📊 RESUMEN:\n`);
    console.log(`   Temas con legislación nueva: ${totalAdded}`);
    console.log(`   Temas omitidos (ya tenían): ${totalSkipped}`);
    console.log(`   Total registros de legislación: ${totalAdded * 5}\n`);
    console.log("✅ LEGISLACIÓN COMPLETADA PARA TODOS LOS TEMAS\n");

  } catch (error) {
    console.error("❌ Error fatal:", error);
    process.exit(1);
  }
}

addLegislacionAllTemas();

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as fs from "fs";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface FlashcardData {
  id: number;
  apartado: string;
  subapartado: string;
  termino: string;
  descripcion: string;
}

async function seedTema08() {
  console.log("\n📖 CARGANDO TEMA-08 COMPLETO (N0-N4, N2.5, N3.5, Propuesta Didáctica)\n");
  console.log("=".repeat(80));

  try {
    // 1. Cargar estructura base (N0, N1, N2, N3)
    console.log("\n✅ PASO 1: Cargando estructura base (N0-N3)");
    const estructuraData = JSON.parse(
      fs.readFileSync("scripts/data/tema-08-estructura.json", "utf-8")
    );

    const { data: temaExist } = await supabase
      .from("topics")
      .select("id")
      .eq("code", "TEMA-08")
      .single();

    let temaId: string;

    if (!temaExist) {
      const { data: newTema } = await supabase
        .from("topics")
        .insert([{
          code: estructuraData.tema.code,
          title: estructuraData.tema.title,
          subject: estructuraData.tema.subject,
          grupo: estructuraData.tema.grupo,
        }])
        .select()
        .single();
      temaId = newTema.id;
      console.log(`   ✓ Tema creado: ${temaId}`);
    } else {
      temaId = temaExist.id;
      console.log(`   ✓ Tema existente: ${temaId}`);
    }

    // Cargar niveles N0, N1, N2, N3
    for (const nivel of estructuraData.niveles.slice(0, 4)) {
      await supabase
        .from("topic_levels")
        .upsert({
          topic_id: temaId,
          level: nivel.level,
          content_json: nivel.content_json,
        }, { onConflict: "topic_id,level" });
      console.log(`   ✓ Nivel ${nivel.level} cargado`);
    }

    // 2. Cargar flashcards N2.5
    console.log("\n✅ PASO 2: Cargando flashcards N2.5 (95 tarjetas)");
    const n25Data = JSON.parse(
      fs.readFileSync("scripts/data/tema-08-nivel25.json", "utf-8")
    );

    const flashcards25 = n25Data.flashcards.map((f: FlashcardData) => ({
      apartado: f.apartado,
      subapartado: f.subapartado,
      termino: f.termino,
      descripcion: f.descripcion,
    }));

    await supabase
      .from("topic_levels")
      .upsert({
        topic_id: temaId,
        level: 2.5,
        content_json: {
          tipo: "desarrollo",
          flashcards: flashcards25,
        },
      }, { onConflict: "topic_id,level" });
    console.log(`   ✓ ${flashcards25.length} flashcards N2.5 cargadas`);

    // 3. Cargar flashcards N3.5
    console.log("\n✅ PASO 3: Cargando flashcards N3.5 (26 tarjetas)");
    const n35Data = JSON.parse(
      fs.readFileSync("scripts/data/tema-08-nivel35.json", "utf-8")
    );

    const flashcards35 = n35Data.flashcards.map((f: FlashcardData) => ({
      apartado: f.apartado,
      subapartado: f.subapartado,
      termino: f.termino,
      descripcion: f.descripcion,
    }));

    await supabase
      .from("topic_levels")
      .upsert({
        topic_id: temaId,
        level: 3.5,
        content_json: {
          tipo: "desarrollo",
          flashcards: flashcards35,
        },
      }, { onConflict: "topic_id,level" });
    console.log(`   ✓ ${flashcards35.length} flashcards N3.5 cargadas`);

    // 4. Cargar Propuesta Didáctica
    console.log("\n✅ PASO 4: Cargando propuesta didáctica");
    const propuestaTexto = `Este tema puede trasladarse al aula mediante un debate científico guiado sobre la expansión de las constelaciones de satélites y sus consecuencias ambientales, tecnológicas y sociales. La cuestión central podría formularse así: ¿aportan las constelaciones de satélites más beneficios que problemas para la sociedad?

La clase se organizará de manera que al menos un tercio del alumnado defienda sus ventajas, relacionadas con las comunicaciones, la navegación, la meteorología, la observación de la Tierra y la investigación espacial, mientras otro tercio analice críticamente problemas como la basura espacial, la contaminación lumínica, el consumo energético o la saturación de las órbitas. El resto asumirá funciones de moderación, síntesis y valoración final.

El alumnado argumentará a partir de gráficos sobre el número de satélites, datos sobre residuos orbitales, noticias científicas, informes ambientales y ejemplos de aplicaciones reales. Deberá diferenciar hechos, opiniones e inferencias, relacionando sus argumentos con la gravitación, las órbitas y la velocidad de escape. Para favorecer la inclusión, se utilizarán apoyos visuales, guías de argumentación, roles cooperativos y distintas formas de participación oral y escrita. La actividad se evaluará mediante una rúbrica de argumentación científica.`;

    await supabase
      .from("topic_propuesta_didactica")
      .upsert({
        topic_id: temaId,
        lectura: propuestaTexto,
        actividad: propuestaTexto,
        dinamica: "debate-guiado",
      }, { onConflict: "topic_id" });
    console.log(`   ✓ Propuesta didáctica cargada`);

    // 5. Cargar Legislación (5 CCAAs)
    console.log("\n✅ PASO 5: Cargando legislación (5 CCAAs)");
    const ccaas = ["Aragón", "Asturias", "Cantabria", "La Rioja", "Región de Murcia"];
    const legislacionBase = `Disposiciones legales sobre gravitación, satélites y tecnología espacial en [CCAA].

Normativa aplicable:
- Leyes sobre observación de datos satellitales
- Regulaciones sobre comunicaciones vía satélite
- Normas sobre uso de sistemas de posicionamiento (GPS)
- Legislación ambiental respecto a residuos espaciales
- Marcos de competencia territorial en tecnología aeroespacial`;

    for (const ccaa of ccaas) {
      await supabase
        .from("topic_legislation_by_ccaa")
        .upsert({
          topic_id: temaId,
          ccaa: ccaa,
          contenido: legislacionBase.replace("[CCAA]", ccaa),
        }, { onConflict: "topic_id,ccaa" });
    }
    console.log(`   ✓ Legislación de 5 CCAAs cargada`);

    console.log("\n" + "=".repeat(80));
    console.log("\n✅ TEMA-08 COMPLETAMENTE CARGADO\n");
    console.log("Resumen:");
    console.log(`  • Tema: TEMA-08 (${estructuraData.tema.code})`);
    console.log(`  • Niveles: N0 (índice), N1 (12 keywords), N2 (esquemático), N3 (completo)`);
    console.log(`  • Flashcards N2.5: ${flashcards25.length} tarjetas (recuperación activa)`);
    console.log(`  • Flashcards N3.5: ${flashcards35.length} tarjetas (reconstrucción científica)`);
    console.log(`  • Propuesta didáctica: Debate guiado sobre constelaciones de satélites`);
    console.log(`  • Legislación: 5 CCAAs (Grupo 2)`);
    console.log("\n" + "=".repeat(80) + "\n");

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

seedTema08();

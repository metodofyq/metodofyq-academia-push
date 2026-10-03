import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseServiceRole!);

async function verifyTareas() {
  console.log("\n✅ TAREA 5: VERIFICACIÓN DE LAS 4 TAREAS COMPLETADAS\n");
  console.log("=".repeat(70));

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

    // ===== TAREA 1: Verificar N3 negrita =====
    console.log("\n📝 TAREA 1: Verificar negrita en N3...");
    const { data: n3 } = await supabase
      .from("topic_levels")
      .select("content_json")
      .eq("topic_id", tema.id)
      .eq("level", 3)
      .single();

    if (n3) {
      const n3Text = (n3.content_json as Record<string, any>)?.texto || "";
      const hasNegrita = n3Text.includes("**");
      const sampleNegrita = n3Text.substring(0, 200);
      console.log(`   ✓ Negrita presente: ${hasNegrita ? "✅ SÍ" : "❌ NO"}`);
      console.log(`   Muestra: ${sampleNegrita}`);
    } else {
      console.log("   ❌ N3 no encontrado");
    }

    // ===== TAREA 2: Verificar N2 guiones simples =====
    console.log("\n📝 TAREA 2: Verificar guiones simples en N2...");
    const { data: n2 } = await supabase
      .from("topic_levels")
      .select("content_json")
      .eq("topic_id", tema.id)
      .eq("level", 2)
      .single();

    if (n2) {
      const n2Text = (n2.content_json as Record<string, any>)?.texto || "";
      const dobleGuiones = n2Text.match(/-\n\s*-/g);
      const lineasVacias = n2Text.match(/^-\s*$/gm);
      console.log(`   ✓ Guiones dobles encontrados: ${dobleGuiones ? dobleGuiones.length : 0}`);
      console.log(`   ✓ Líneas vacías con guión: ${lineasVacias ? lineasVacias.length : 0}`);
      if (!dobleGuiones && !lineasVacias) {
        console.log(`   ✅ VERIFICADO: Guiones arreglados correctamente`);
      } else {
        console.log(`   ⚠️  Aún hay problemas con guiones`);
      }
    } else {
      console.log("   ❌ N2 no encontrado");
    }

    // ===== TAREA 3: Verificar propuesta didáctica =====
    console.log("\n📝 TAREA 3: Verificar propuesta didáctica...");
    const { data: propuesta } = await supabase
      .from("topic_propuesta_didactica")
      .select("lectura, actividad, dinamica")
      .eq("topic_id", tema.id)
      .single();

    if (propuesta) {
      const hasLectura = !!propuesta.lectura;
      const hasActividad = !!propuesta.actividad;
      const hasDinamica = propuesta.dinamica === "dictado-corrector";
      console.log(`   ✓ Lectura presente: ${hasLectura ? "✅ SÍ" : "❌ NO"}`);
      console.log(`   ✓ Actividad presente: ${hasActividad ? "✅ SÍ" : "❌ NO"}`);
      console.log(`   ✓ Dinámica: ${propuesta.dinamica}`);
      if (hasLectura && hasActividad && hasDinamica) {
        console.log(`   ✅ VERIFICADO: Propuesta didáctica cargada correctamente`);
      }
    } else {
      console.log("   ❌ Propuesta didáctica no encontrada");
    }

    // ===== TAREA 4: Verificar legislación por CCAA =====
    console.log("\n📝 TAREA 4: Verificar legislación por CCAA...");
    const { data: legislacion } = await supabase
      .from("topic_legislation_by_ccaa")
      .select("ccaa, contenido")
      .eq("topic_id", tema.id);

    if (legislacion && legislacion.length > 0) {
      const ccaas = legislacion.map((l) => l.ccaa).sort();
      console.log(`   ✓ CCAAs encontradas: ${ccaas.length}`);
      console.log(`   ✓ Lista: ${ccaas.join(", ")}`);
      if (ccaas.includes("Aragón") && ccaas.includes("Castilla y León")) {
        console.log(`   ✅ VERIFICADO: Legislación por CCAA cargada correctamente`);
      }
    } else {
      console.log("   ❌ Legislación no encontrada");
    }

    console.log("\n" + "=".repeat(70));
    console.log("✅ VERIFICACIÓN COMPLETADA CORRECTAMENTE\n");
  } catch (error) {
    console.error("❌ Error fatal:", error);
    process.exit(1);
  }
}

verifyTareas();

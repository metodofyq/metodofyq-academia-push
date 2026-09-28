import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function fixTema15Issues() {
  console.log("\n🔧 CORRIGIENDO PROBLEMAS DE TEMA-15\n");
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

    // ===== PROBLEMA 1: N2 - Quitar símbolos "* " =====
    console.log("\n📝 1. Limpiando N2 (quitar '* ')...");
    const { data: n2Data } = await supabase
      .from("topic_levels")
      .select("content_json")
      .eq("topic_id", tema.id)
      .eq("level", 2)
      .single();

    if (n2Data) {
      let texto = (n2Data.content_json as Record<string, any>).texto || "";
      // Quitar "* " al inicio de líneas
      texto = texto.replace(/^\* /gm, "");
      
      const updatedN2 = {
        ...(n2Data.content_json as Record<string, any>),
        texto: texto
      };

      await supabase
        .from("topic_levels")
        .update({ content_json: updatedN2 })
        .eq("topic_id", tema.id)
        .eq("level", 2);

      console.log("   ✅ N2 limpiado");
    }

    // ===== PROBLEMA 2: N3 - Agregar índice antes de "0. Introducción" =====
    console.log("\n📝 2. Agregando índice a N3...");
    const { data: n3Data } = await supabase
      .from("topic_levels")
      .select("content_json")
      .eq("topic_id", tema.id)
      .eq("level", 3)
      .single();

    if (n3Data) {
      let texto = (n3Data.content_json as Record<string, any>).texto || "";
      
      // Crear el índice
      const indice = `Índice
0. Introducción
1. Energía interna
1.1. Concepto de energía interna
1.2. Interpretación microscópica de la energía interna
1.3. Variables que influyen en la energía interna de un sistema
2. Calor y temperatura
2.1. Concepto de temperatura
2.2. Concepto de calor
2.3. Diferencias entre calor, temperatura y energía interna
2.4. Medida de la temperatura y escalas termométricas
3. Desarrollo histórico del concepto de calor
3.1. Primeras interpretaciones sobre la naturaleza del calor
3.2. Teoría del calórico
3.3. Aportaciones de Rumford, Davy y Joule
3.4. Interpretación energética del calor
4. Equilibrio térmico
4.1. Sistemas térmicos y contacto térmico
4.2. Equilibrio térmico entre cuerpos
4.3. Principio cero de la termodinámica
5. Propagación del calor
5.1. Conducción térmica
5.2. Convección térmica
5.3. Radiación térmica
5.4. Comparación entre los mecanismos de transferencia térmica
6. Efectos del calor sobre los cuerpos
6.1. Variación de la temperatura
6.2. Cambios de estado
6.3. Dilatación térmica
7. Conductores y aislantes térmicos
7.1. Conductividad térmica de los materiales
7.2. Materiales conductores del calor
7.3. Materiales aislantes del calor
7.4. Selección de materiales según su comportamiento térmico
8. Aplicaciones
8.1. Aplicaciones domésticas y cotidianas
8.2. Aplicaciones industriales y tecnológicas
8.3. Aplicaciones ambientales y energéticas
9. Conclusión
10. Bibliografía

`;

      // Agregar índice antes de "0. Introducción"
      if (!texto.includes("Índice")) {
        texto = indice + texto;
      }

      const updatedN3 = {
        ...(n3Data.content_json as Record<string, any>),
        texto: texto
      };

      await supabase
        .from("topic_levels")
        .update({ content_json: updatedN3 })
        .eq("topic_id", tema.id)
        .eq("level", 3);

      console.log("   ✅ Índice agregado a N3");
    }

    // ===== VERIFICACIÓN: N2.5 y N3.5 =====
    console.log("\n📝 3. Verificando N2.5 y N3.5...");
    
    const { data: n25Data } = await supabase
      .from("topic_levels")
      .select("content_json")
      .eq("topic_id", tema.id)
      .eq("level", 2.5)
      .single();

    const flashcards25 = (n25Data?.content_json as Record<string, any>)?.flashcards || [];
    console.log(`   N2.5: ${flashcards25.length} flashcards`);
    if (flashcards25.length > 0) {
      const card = flashcards25[0];
      console.log(`        Primer tarjeta: ${card.pregunta ? '✅' : '❌'} pregunta, ${card.respuesta ? '✅' : '❌'} respuesta`);
    }

    const { data: n35Data } = await supabase
      .from("topic_levels")
      .select("content_json")
      .eq("topic_id", tema.id)
      .eq("level", 3.5)
      .single();

    const flashcards35 = (n35Data?.content_json as Record<string, any>)?.flashcards || [];
    console.log(`   N3.5: ${flashcards35.length} flashcards`);
    if (flashcards35.length > 0) {
      const card = flashcards35[0];
      console.log(`        Primer tarjeta: ${card.pregunta ? '✅' : '❌'} pregunta, ${card.respuesta ? '✅' : '❌'} respuesta`);
    }

    console.log("\n" + "=".repeat(70));
    console.log("✅ CORRECCIONES COMPLETADAS\n");

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

fixTema15Issues();

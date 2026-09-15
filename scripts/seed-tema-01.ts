#!/usr/bin/env tsx
/**
 * Script para cargar Tema 01 completo:
 * - N2.5 y N3.5 flashcards
 * - Propuesta didáctica
 * - Legislación por CCAA
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRole) {
  console.error("❌ Faltan variables de entorno");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRole);

async function seedTema01() {
  try {
    console.log("🚀 Iniciando carga de Tema 01...\n");

    const topicId = "0b6b3b31-a212-4fbb-b139-bca3a2e6ba70";

    // 1. Obtener o crear el topic
    let { data: topic } = await supabase
      .from("topics")
      .select("id")
      .eq("code", "TEMA-01")
      .single();

    if (!topic) {
      console.log("ℹ️  Creando topic Tema 01...");
      const { data: newTopic } = await supabase
        .from("topics")
        .insert({
          code: "TEMA-01",
          title: "Naturaleza de la ciencia y pensamiento científico",
          subject: "Fisica y Quimica",
          grupo: 2,
        })
        .select()
        .single();
      topic = newTopic;
      console.log("✅ Topic creado:", topic.id);
    } else {
      console.log("✅ Topic ya existe:", topic.id);
    }

    // 2. Cargar N2.5 flashcards
    console.log("\n📚 Cargando N2.5 (109 flashcards)...");
    const n25Data = JSON.parse(
      fs.readFileSync("scripts/data/tema-01-nivel25.json", "utf-8")
    );

    const { data: existingN25 } = await supabase
      .from("topic_levels")
      .select("id")
      .eq("topic_id", topic.id)
      .eq("level", 2.5)
      .single();

    if (!existingN25) {
      await supabase.from("topic_levels").insert({
        topic_id: topic.id,
        level: 2.5,
        title: "Recuperación activa",
        content_json: { flashcards: n25Data.flashcards },
      });
      console.log("✅ N2.5 cargado: 109 flashcards");
    } else {
      await supabase
        .from("topic_levels")
        .update({ content_json: { flashcards: n25Data.flashcards } })
        .eq("id", existingN25.id);
      console.log("✅ N2.5 actualizado: 109 flashcards");
    }

    // 3. Cargar N3.5 flashcards
    console.log("\n📚 Cargando N3.5 (23 flashcards)...");
    const n35Data = JSON.parse(
      fs.readFileSync("scripts/data/tema-01-nivel35.json", "utf-8")
    );

    const { data: existingN35 } = await supabase
      .from("topic_levels")
      .select("id")
      .eq("topic_id", topic.id)
      .eq("level", 3.5)
      .single();

    if (!existingN35) {
      await supabase.from("topic_levels").insert({
        topic_id: topic.id,
        level: 3.5,
        title: "Reconstrucción científica",
        content_json: { flashcards: n35Data.flashcards },
      });
      console.log("✅ N3.5 cargado: 23 flashcards");
    } else {
      await supabase
        .from("topic_levels")
        .update({ content_json: { flashcards: n35Data.flashcards } })
        .eq("id", existingN35.id);
      console.log("✅ N3.5 actualizado: 23 flashcards");
    }

    // 4. Cargar Propuesta didáctica (Nivel especial para grupo 2)
    console.log("\n💭 Cargando Propuesta didáctica...");
    const propuestaData = JSON.parse(
      fs.readFileSync("scripts/data/tema-01-propuesta-didactica.json", "utf-8")
    );

    const { data: existingPropuesta } = await supabase
      .from("topic_propuesta_didactica")
      .select("id")
      .eq("topic_id", topic.id)
      .single();

    if (!existingPropuesta) {
      await supabase.from("topic_propuesta_didactica").insert({
        topic_id: topic.id,
        lectura: propuestaData.lectura,
        actividad: propuestaData.actividad,
        dinamica: propuestaData.dinamica,
      });
      console.log("✅ Propuesta didáctica cargada");
    } else {
      await supabase
        .from("topic_propuesta_didactica")
        .update({
          lectura: propuestaData.lectura,
          actividad: propuestaData.actividad,
          dinamica: propuestaData.dinamica,
        })
        .eq("id", existingPropuesta.id);
      console.log("✅ Propuesta didáctica actualizada");
    }

    // 5. Cargar Legislación por CCAA
    console.log("\n⚖️  Cargando Legislación (5 CCAA)...");
    const legislacionData = JSON.parse(
      fs.readFileSync("scripts/data/tema-01-legislacion.json", "utf-8")
    );

    for (const registro of legislacionData.registros) {
      const { data: existing } = await supabase
        .from("topic_legislation_by_ccaa")
        .select("id")
        .eq("topic_id", topic.id)
        .eq("ccaa", registro.ccaa)
        .single();

      if (!existing) {
        await supabase.from("topic_legislation_by_ccaa").insert({
          topic_id: topic.id,
          ccaa: registro.ccaa,
          titulo: registro.titulo,
          contenido: registro.contenido,
        });
        console.log(`  ✅ ${registro.ccaa}`);
      } else {
        await supabase
          .from("topic_legislation_by_ccaa")
          .update({
            titulo: registro.titulo,
            contenido: registro.contenido,
          })
          .eq("id", existing.id);
        console.log(`  ✅ ${registro.ccaa} (actualizado)`);
      }
    }

    console.log("\n🎉 Tema 01 cargado completamente\n");
    console.log("📊 Resumen:");
    console.log("  • N2.5: 109 flashcards (Recuperación activa)");
    console.log("  • N3.5: 23 flashcards (Reconstrucción científica)");
    console.log("  • Propuesta didáctica: Debate científico guiado");
    console.log("  • Legislación: 5 CCAA (Aragón, Castilla y León, Valencia, Navarra, La Rioja)");

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

seedTema01();

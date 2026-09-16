#!/usr/bin/env tsx
/**
 * Script universal para cargar un tema completo
 *
 * Uso:
 *   npx tsx scripts/seed-tema-generic.ts <TEMA-XX>
 *
 * Ejemplo:
 *   npx tsx scripts/seed-tema-generic.ts TEMA-02
 *
 * Requisitos:
 * - scripts/data/tema-XX-nivel25.json
 * - scripts/data/tema-XX-nivel35.json
 * - scripts/data/tema-XX-propuesta-didactica.json
 * - scripts/data/tema-XX-legislacion.json
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

interface LoadConfig {
  temaCode: string;
  dataDir: string;
  skipN25?: boolean;
  skipN35?: boolean;
  skipPropuesta?: boolean;
  skipLegislacion?: boolean;
}

async function seedTema(config: LoadConfig) {
  try {
    console.log(`🚀 Iniciando carga de ${config.temaCode}...\n`);

    // 1. Obtener o crear el topic
    let { data: topic } = await supabase
      .from("topics")
      .select("id, grupo")
      .eq("code", config.temaCode)
      .single();

    if (!topic) {
      console.log(`ℹ️  Creando topic ${config.temaCode}...`);
      const { data: newTopic, error: insertError } = await supabase
        .from("topics")
        .insert({
          code: config.temaCode,
          title: `${config.temaCode} - Tema`,
          subject: "Fisica y Quimica",
          grupo: 2,
        })
        .select()
        .single();

      if (insertError || !newTopic) {
        throw new Error(`Error al crear topic: ${insertError?.message || 'Respuesta nula'}`);
      }

      topic = newTopic;
      console.log(`✅ Topic creado: ${topic.id}\n`);
    } else {
      console.log(`✅ Topic ya existe: ${topic.id}\n`);
    }

    const topicId = topic.id;

    // 2. Cargar N2.5 flashcards
    if (!config.skipN25) {
      const n25Path = path.join(config.dataDir, `${config.temaCode.toLowerCase()}-nivel25.json`);
      if (fs.existsSync(n25Path)) {
        console.log("📚 Cargando N2.5...");
        const n25Data = JSON.parse(fs.readFileSync(n25Path, "utf-8"));

        const { data: existingN25 } = await supabase
          .from("topic_levels")
          .select("id")
          .eq("topic_id", topicId)
          .eq("level", 2.5)
          .single();

        if (!existingN25) {
          const { error } = await supabase.from("topic_levels").insert({
            topic_id: topicId,
            level: 2.5,
            title: "Recuperación activa",
            content_json: { flashcards: n25Data.flashcards },
          });
          if (error) throw error;
          console.log(`✅ N2.5 cargado: ${n25Data.flashcards.length} flashcards\n`);
        } else {
          const { error } = await supabase
            .from("topic_levels")
            .update({ content_json: { flashcards: n25Data.flashcards } })
            .eq("id", existingN25.id);
          if (error) throw error;
          console.log(`✅ N2.5 actualizado: ${n25Data.flashcards.length} flashcards\n`);
        }
      } else {
        console.log(`⚠️  N2.5 JSON no encontrado: ${n25Path}\n`);
      }
    }

    // 3. Cargar N3.5 flashcards
    if (!config.skipN35) {
      const n35Path = path.join(config.dataDir, `${config.temaCode.toLowerCase()}-nivel35.json`);
      if (fs.existsSync(n35Path)) {
        console.log("📚 Cargando N3.5...");
        const n35Data = JSON.parse(fs.readFileSync(n35Path, "utf-8"));

        const { data: existingN35 } = await supabase
          .from("topic_levels")
          .select("id")
          .eq("topic_id", topicId)
          .eq("level", 3.5)
          .single();

        if (!existingN35) {
          const { error } = await supabase.from("topic_levels").insert({
            topic_id: topicId,
            level: 3.5,
            title: "Reconstrucción científica",
            content_json: { flashcards: n35Data.flashcards },
          });
          if (error) throw error;
          console.log(`✅ N3.5 cargado: ${n35Data.flashcards.length} flashcards\n`);
        } else {
          const { error } = await supabase
            .from("topic_levels")
            .update({ content_json: { flashcards: n35Data.flashcards } })
            .eq("id", existingN35.id);
          if (error) throw error;
          console.log(`✅ N3.5 actualizado: ${n35Data.flashcards.length} flashcards\n`);
        }
      } else {
        console.log(`⚠️  N3.5 JSON no encontrado: ${n35Path}\n`);
      }
    }

    // 4. Cargar Propuesta didáctica
    if (!config.skipPropuesta) {
      const propPath = path.join(config.dataDir, `${config.temaCode.toLowerCase()}-propuesta-didactica.json`);
      if (fs.existsSync(propPath)) {
        console.log("💭 Cargando Propuesta didáctica...");
        const propData = JSON.parse(fs.readFileSync(propPath, "utf-8"));

        const { data: existingPropuesta } = await supabase
          .from("topic_propuesta_didactica")
          .select("id")
          .eq("topic_id", topicId)
          .single();

        if (!existingPropuesta) {
          const { error } = await supabase.from("topic_propuesta_didactica").insert({
            topic_id: topicId,
            lectura: propData.lectura,
            actividad: propData.actividad,
            dinamica: propData.dinamica,
          });
          if (error) throw error;
          console.log(`✅ Propuesta didáctica cargada\n`);
        } else {
          const { error } = await supabase
            .from("topic_propuesta_didactica")
            .update({
              lectura: propData.lectura,
              actividad: propData.actividad,
              dinamica: propData.dinamica,
            })
            .eq("id", existingPropuesta.id);
          if (error) throw error;
          console.log(`✅ Propuesta didáctica actualizada\n`);
        }
      } else {
        console.log(`⚠️  Propuesta didáctica JSON no encontrado: ${propPath}\n`);
      }
    }

    // 5. Cargar Legislación por CCAA
    if (!config.skipLegislacion) {
      const legPath = path.join(config.dataDir, `${config.temaCode.toLowerCase()}-legislacion.json`);
      if (fs.existsSync(legPath)) {
        console.log("⚖️  Cargando Legislación...");
        const legData = JSON.parse(fs.readFileSync(legPath, "utf-8"));

        for (const registro of legData.registros || []) {
          const { data: existing } = await supabase
            .from("topic_legislation_by_ccaa")
            .select("id")
            .eq("topic_id", topicId)
            .eq("ccaa", registro.ccaa)
            .single();

          if (!existing) {
            const { error } = await supabase.from("topic_legislation_by_ccaa").insert({
              topic_id: topicId,
              ccaa: registro.ccaa,
              titulo: registro.titulo,
              contenido: registro.contenido,
            });
            if (error) throw error;
            console.log(`  ✅ ${registro.ccaa}`);
          } else {
            const { error } = await supabase
              .from("topic_legislation_by_ccaa")
              .update({
                titulo: registro.titulo,
                contenido: registro.contenido,
              })
              .eq("id", existing.id);
            if (error) throw error;
            console.log(`  ✅ ${registro.ccaa} (actualizado)`);
          }
        }
        console.log();
      } else {
        console.log(`⚠️  Legislación JSON no encontrado: ${legPath}\n`);
      }
    }

    console.log("🎉 Carga completada\n");

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
📦 CARGAR TEMA - Script Universal

Uso:
  npx tsx scripts/seed-tema-generic.ts <TEMA-XX> [opciones]

Ejemplo:
  npx tsx scripts/seed-tema-generic.ts TEMA-02

Opciones (flags):
  --skip-n25            No cargar N2.5
  --skip-n35            No cargar N3.5
  --skip-propuesta      No cargar propuesta didáctica
  --skip-legislacion    No cargar legislación

Requisitos previos:
  ✓ scripts/data/tema-xx-nivel25.json
  ✓ scripts/data/tema-xx-nivel35.json
  ✓ scripts/data/tema-xx-propuesta-didactica.json
  ✓ scripts/data/tema-xx-legislacion.json
    `);
    process.exit(0);
  }

  const temaCode = args[0].toUpperCase();
  const config: LoadConfig = {
    temaCode,
    dataDir: "scripts/data",
    skipN25: args.includes("--skip-n25"),
    skipN35: args.includes("--skip-n35"),
    skipPropuesta: args.includes("--skip-propuesta"),
    skipLegislacion: args.includes("--skip-legislacion"),
  };

  await seedTema(config);
}

main();

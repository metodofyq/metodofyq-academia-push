#!/usr/bin/env tsx
/**
 * Script para cargar niveles 0, 1, 2, 3 en TEMA-01 existente
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

async function loadNiveles() {
  try {
    console.log(`🚀 Cargando niveles 0, 1, 2, 3 en TEMA-01...\n`);

    // 1. Obtener topic TEMA-01
    const { data: topic, error: topicError } = await supabase
      .from("topics")
      .select("id")
      .eq("code", "TEMA-01")
      .single();

    if (topicError || !topic) {
      throw new Error("TEMA-01 no existe. Crea el topic primero.");
    }

    const topicId = topic.id;
    console.log(`✅ Topic encontrado: ${topicId}\n`);

    const dataDir = "scripts/data";
    const niveles = [
      { file: "tema-01-nivel0.json", level: 0 },
      { file: "tema-01-nivel1.json", level: 1 },
      { file: "tema-01-nivel2.json", level: 2 },
      { file: "tema-01-nivel3.json", level: 3 },
    ];

    // 2. Cargar cada nivel
    for (const nivel of niveles) {
      const filePath = path.join(dataDir, nivel.file);

      if (!fs.existsSync(filePath)) {
        console.log(`⚠️  Archivo no encontrado: ${nivel.file}`);
        continue;
      }

      console.log(`📚 Cargando Nivel ${nivel.level}...`);
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

      // Verificar si ya existe
      const { data: existing } = await supabase
        .from("topic_levels")
        .select("id")
        .eq("topic_id", topicId)
        .eq("level", nivel.level)
        .single();

      if (existing) {
        // Actualizar
        const { error } = await supabase
          .from("topic_levels")
          .update({
            title: data.titulo,
            content_json: {
              tipo: data.tipo,
              contenido: data.contenido,
              apartados: data.apartados,
            },
          })
          .eq("id", existing.id);

        if (error) throw error;
        console.log(`  ✅ Nivel ${nivel.level} actualizado\n`);
      } else {
        // Crear
        const { error } = await supabase
          .from("topic_levels")
          .insert({
            topic_id: topicId,
            level: nivel.level,
            title: data.titulo,
            content_json: {
              tipo: data.tipo,
              contenido: data.contenido,
              apartados: data.apartados,
            },
          });

        if (error) throw error;
        console.log(`  ✅ Nivel ${nivel.level} creado\n`);
      }
    }

    // 3. Cargar Propuesta Didáctica
    console.log("💭 Cargando Propuesta Didáctica...");
    const propPath = path.join(dataDir, "tema-01-propuesta-didactica-v2.json");
    if (fs.existsSync(propPath)) {
      const propData = JSON.parse(fs.readFileSync(propPath, "utf-8"));

      const { data: existingProp } = await supabase
        .from("topic_propuesta_didactica")
        .select("id")
        .eq("topic_id", topicId)
        .single();

      if (existingProp) {
        await supabase
          .from("topic_propuesta_didactica")
          .update({
            lectura: propData.lectura,
            actividad: propData.actividad,
            dinamica: propData.dinamica,
          })
          .eq("id", existingProp.id);
        console.log("  ✅ Propuesta actualizada\n");
      } else {
        await supabase
          .from("topic_propuesta_didactica")
          .insert({
            topic_id: topicId,
            lectura: propData.lectura,
            actividad: propData.actividad,
            dinamica: propData.dinamica,
          });
        console.log("  ✅ Propuesta creada\n");
      }
    }

    // 4. Cargar Legislación
    console.log("⚖️  Cargando Legislación...");
    const legPath = path.join(dataDir, "tema-01-legislacion-v2.json");
    if (fs.existsSync(legPath)) {
      const legData = JSON.parse(fs.readFileSync(legPath, "utf-8"));

      for (const registro of legData.registros) {
        const { data: existing } = await supabase
          .from("topic_legislation_by_ccaa")
          .select("id")
          .eq("topic_id", topicId)
          .eq("ccaa", registro.ccaa)
          .single();

        if (existing) {
          await supabase
            .from("topic_legislation_by_ccaa")
            .update({
              titulo: registro.titulo,
              contenido: registro.contenido,
            })
            .eq("id", existing.id);
          console.log(`  ✅ ${registro.ccaa} (actualizado)`);
        } else {
          await supabase
            .from("topic_legislation_by_ccaa")
            .insert({
              topic_id: topicId,
              ccaa: registro.ccaa,
              titulo: registro.titulo,
              contenido: registro.contenido,
            });
          console.log(`  ✅ ${registro.ccaa}`);
        }
      }
    }

    console.log("\n🎉 Carga completada\n");

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

loadNiveles();

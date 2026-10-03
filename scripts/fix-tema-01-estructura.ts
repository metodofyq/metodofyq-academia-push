#!/usr/bin/env tsx
/**
 * Script para corregir la estructura JSON de los niveles 0, 1, 2, 3 en TEMA-01
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

async function fixNiveles() {
  try {
    console.log("🔧 Corrigiendo estructura JSON de TEMA-01...\n");

    // Obtener topic TEMA-01
    const { data: topic } = await supabase
      .from("topics")
      .select("id")
      .eq("code", "TEMA-01")
      .single();

    if (!topic) {
      throw new Error("TEMA-01 no existe");
    }

    const topicId = topic.id;
    const dataDir = "scripts/data";

    // NIVEL 0 - Estructura
    console.log("📚 Corrigiendo Nivel 0...");
    const nivel0Path = path.join(dataDir, "tema-01-nivel0-corregido.json");
    if (fs.existsSync(nivel0Path)) {
      const data = JSON.parse(fs.readFileSync(nivel0Path, "utf-8"));
      await supabase
        .from("topic_levels")
        .update({ content_json: { estructura: data.estructura } })
        .eq("topic_id", topicId)
        .eq("level", 0);
      console.log("  ✅ Nivel 0 actualizado\n");
    }

    // NIVEL 1 - Keywords
    console.log("📚 Corrigiendo Nivel 1...");
    const nivel1Path = path.join(dataDir, "tema-01-nivel1-corregido.json");
    if (fs.existsSync(nivel1Path)) {
      const data = JSON.parse(fs.readFileSync(nivel1Path, "utf-8"));
      await supabase
        .from("topic_levels")
        .update({ content_json: { keywords: data.keywords } })
        .eq("topic_id", topicId)
        .eq("level", 1);
      console.log("  ✅ Nivel 1 actualizado\n");
    }

    // NIVEL 2 - Texto
    console.log("📚 Corrigiendo Nivel 2...");
    const nivel2Path = path.join(dataDir, "tema-01-nivel2.json");
    if (fs.existsSync(nivel2Path)) {
      const data = JSON.parse(fs.readFileSync(nivel2Path, "utf-8"));
      await supabase
        .from("topic_levels")
        .update({ content_json: { texto: data.contenido } })
        .eq("topic_id", topicId)
        .eq("level", 2);
      console.log("  ✅ Nivel 2 actualizado\n");
    }

    // NIVEL 3 - Texto
    console.log("📚 Corrigiendo Nivel 3...");
    const nivel3Path = path.join(dataDir, "tema-01-nivel3.json");
    if (fs.existsSync(nivel3Path)) {
      const data = JSON.parse(fs.readFileSync(nivel3Path, "utf-8"));
      await supabase
        .from("topic_levels")
        .update({ content_json: { texto: data.contenido } })
        .eq("topic_id", topicId)
        .eq("level", 3);
      console.log("  ✅ Nivel 3 actualizado\n");
    }

    console.log("🎉 Corrección completada\n");

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

fixNiveles();

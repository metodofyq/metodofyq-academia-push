#!/usr/bin/env tsx
/**
 * Script para verificar o crear Tema 01
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRole) {
  console.error("❌ Faltan variables de entorno");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRole);

async function checkTemaId() {
  try {
    console.log("🔍 Buscando TEMA-01...\n");

    const { data: topic, error } = await supabase
      .from("topics")
      .select("id, code, title")
      .eq("code", "TEMA-01")
      .single();

    if (error && error.code === "PGRST116") {
      console.log("⚠️  TEMA-01 no existe. Creándolo...\n");

      const { data: newTopic, error: insertError } = await supabase
        .from("topics")
        .insert({
          code: "TEMA-01",
          title: "Naturaleza de la ciencia y pensamiento científico",
          subject: "Fisica y Quimica",
          grupo: 2,
        })
        .select()
        .single();

      if (insertError) {
        console.error("❌ Error al crear tema:", insertError);
        process.exit(1);
      }

      console.log("✅ TEMA-01 creado exitosamente\n");
      console.log("ID:", newTopic.id);
      console.log("Code:", newTopic.code);
      console.log("Título:", newTopic.title);
      console.log("\nUSA ESTE ID EN seed-tema-01.ts:");
      console.log(`const topicId = "${newTopic.id}";`);

    } else if (error) {
      console.error("❌ Error:", error);
      process.exit(1);

    } else {
      console.log("✅ TEMA-01 encontrado\n");
      console.log("ID:", topic.id);
      console.log("Code:", topic.code);
      console.log("Título:", topic.title);
      console.log("\nUSA ESTE ID EN seed-tema-01.ts:");
      console.log(`const topicId = "${topic.id}";`);
    }

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

checkTemaId();

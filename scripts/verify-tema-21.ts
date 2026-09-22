import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseServiceRole!);

async function verify() {
  console.log("🔍 Verificando TEMA-21...\n");

  try {
    // Obtener TEMA-21
    const { data: tema } = await supabase
      .from("topics")
      .select("*")
      .eq("code", "TEMA-21")
      .single();

    console.log("📚 TEMA-21 encontrado:");
    console.log(`   ID: ${tema.id}`);
    console.log(`   Título: ${tema.title.substring(0, 60)}...`);
    console.log(`   Grupo: ${tema.grupo}`);

    // Verificar niveles
    const { data: levels } = await supabase
      .from("topic_levels")
      .select("level, title, content_json")
      .eq("topic_id", tema.id)
      .order("level");

    console.log("\n📖 Niveles cargados:");
    levels?.forEach((level) => {
      const contentLen = JSON.stringify(level.content_json).length;
      // Verificar si tiene asteriscos o escapes
      const contentStr = JSON.stringify(level.content_json);
      const hasAsterisks = contentStr.includes("\\*") || contentStr.includes("* ");
      const hasEscapes = contentStr.includes("\\.");

      console.log(`   N${level.level} (${level.title})`);
      console.log(`      ├─ Tamaño: ${contentLen} bytes`);
      console.log(`      ├─ Con asteriscos: ${hasAsterisks ? "❌ SÍ" : "✅ NO"}`);
      console.log(`      └─ Con escapes: ${hasEscapes ? "❌ SÍ" : "✅ NO"}`);

      // Mostrar primer 100 caracteres de N0
      if (level.level === 0) {
        const preview = contentStr.substring(0, 150);
        console.log(`      Preview: ${preview.substring(0, 100)}...`);
      }
    });

    // Verificar flashcards
    const { data: flashcards } = await supabase
      .from("flashcards")
      .select("id, nivel")
      .eq("topic_id", tema.id);

    console.log("\n📇 Flashcards:");
    const n25Count = flashcards?.filter((f) => f.nivel === "2.5").length || 0;
    const n35Count = flashcards?.filter((f) => f.nivel === "3.5").length || 0;
    console.log(`   N2.5: ${n25Count} flashcards`);
    console.log(`   N3.5: ${n35Count} flashcards`);

    // Verificar propuesta didáctica
    const { data: propuesta } = await supabase
      .from("topic_propuesta_didactica")
      .select("id")
      .eq("topic_id", tema.id)
      .single();

    console.log("\n💡 Propuesta Didáctica:", propuesta ? "✅ Cargada" : "❌ No encontrada");

    console.log("\n✨ Verificación completada");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

verify();

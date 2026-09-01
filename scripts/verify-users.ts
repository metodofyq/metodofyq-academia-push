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

async function verifyUsers() {
  console.log("🔍 Verificando usuarios en Supabase...\n");

  // Verificar profesor
  const { data: teacherAuth, error: teacherAuthError } = await supabase.auth.admin.listUsers();
  const teacher = teacherAuth?.users.find(u => u.email === "test-teacher@example.com");

  console.log("📋 PROFESOR (test-teacher@example.com):");
  if (teacher) {
    console.log(`  ✅ Existe en auth.users`);
    console.log(`  ID: ${teacher.id}`);
    console.log(`  Email: ${teacher.email}`);
    console.log(`  Email confirmado: ${teacher.email_confirmed_at ? "SÍ" : "NO"}`);

    // Verificar en profiles
    const { data: teacherProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", teacher.id)
      .single();

    if (teacherProfile) {
      console.log(`  ✅ Existe en profiles`);
      console.log(`  Rol: ${teacherProfile.role}`);
      console.log(`  Nombre: ${teacherProfile.full_name}`);
    } else {
      console.log(`  ❌ NO existe en profiles`);
    }
  } else {
    console.log(`  ❌ NO existe en auth.users`);
  }

  console.log("\n📋 ALUMNO (testalumno.verificar@example.com):");
  const student = teacherAuth?.users.find(u => u.email === "testalumno.verificar@example.com");

  if (student) {
    console.log(`  ✅ Existe en auth.users`);
    console.log(`  ID: ${student.id}`);
    console.log(`  Email: ${student.email}`);
    console.log(`  Email confirmado: ${student.email_confirmed_at ? "SÍ" : "NO"}`);

    // Verificar en profiles
    const { data: studentProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", student.id)
      .single();

    if (studentProfile) {
      console.log(`  ✅ Existe en profiles`);
      console.log(`  Rol: ${studentProfile.role}`);
      console.log(`  Nombre: ${studentProfile.full_name}`);
      console.log(`  Grupo: ${studentProfile.grupo}`);

      // Verificar study plan
      const { data: studyPlan } = await supabase
        .from("study_plans")
        .select("*")
        .eq("student_id", student.id)
        .eq("is_active", true)
        .single();

      if (studyPlan) {
        console.log(`  ✅ Tiene study_plan activo`);

        // Verificar temas asignados
        const { data: topics } = await supabase
          .from("study_plan_topics")
          .select("*, topic:topics(code, title)")
          .eq("study_plan_id", studyPlan.id)
          .order("order_index");

        if (topics && topics.length > 0) {
          console.log(`  ✅ Tiene ${topics.length} temas asignados:`);
          topics.forEach((t, i) => {
            console.log(`     ${i + 1}. ${t.topic?.code} - ${t.topic?.title}`);
          });
        } else {
          console.log(`  ❌ NO tiene temas asignados`);
        }
      } else {
        console.log(`  ❌ NO tiene study_plan activo`);
      }
    } else {
      console.log(`  ❌ NO existe en profiles`);
    }
  } else {
    console.log(`  ❌ NO existe en auth.users`);
  }

  console.log("\n✅ Verificación completada.");
}

verifyUsers().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});

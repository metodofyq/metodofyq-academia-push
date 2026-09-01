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

async function main() {
  const email = "testalumno.verificar@example.com";
  const password = "StudentPassword123!";

  // Crear usuario
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: "Test Alumno" },
  });

  if (error) {
    console.error("❌ Error al crear usuario:", error);
    process.exit(1);
  }

  const userId = data.user.id;
  console.log(`✅ Usuario creado: ${email} (ID: ${userId})`);

  // Actualizar perfil como student
  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      role: "student",
      full_name: "Test Alumno",
      grupo: 2,
      ccaa: "madrid"
    })
    .eq("id", userId);

  if (updateError) {
    console.error("❌ Error al actualizar perfil:", updateError);
    process.exit(1);
  }

  console.log(`✅ Perfil actualizado a student`);

  // Obtener temas 50 y 54
  const { data: temas, error: temasError } = await supabase
    .from("topics")
    .select("id, code")
    .in("code", ["TEMA-50", "TEMA-54"]);

  if (temasError || !temas || temas.length < 2) {
    console.error("❌ Error al obtener temas:", temasError);
    process.exit(1);
  }

  const tema50 = temas.find(t => t.code === "TEMA-50");
  const tema54 = temas.find(t => t.code === "TEMA-54");

  console.log(`✅ Temas encontrados: TEMA-50 (${tema50?.id}), TEMA-54 (${tema54?.id})`);

  // Crear study plan
  const { data: studyPlan, error: planError } = await supabase
    .from("study_plans")
    .insert({ student_id: userId, is_active: true })
    .select("id")
    .single();

  if (planError || !studyPlan) {
    console.error("❌ Error al crear plan:", planError);
    process.exit(1);
  }

  console.log(`✅ Study plan creado: ${studyPlan.id}`);

  // Asignar temas
  const { error: topicsError } = await supabase
    .from("study_plan_topics")
    .insert([
      { study_plan_id: studyPlan.id, topic_id: tema50!.id, order_index: 1 },
      { study_plan_id: studyPlan.id, topic_id: tema54!.id, order_index: 2 },
    ]);

  if (topicsError) {
    console.error("❌ Error al asignar temas:", topicsError);
    process.exit(1);
  }

  console.log(`✅ Temas asignados correctamente\n`);
  console.log(`📝 Credenciales para login:`);
  console.log(`   Email: ${email}`);
  console.log(`   Password: ${password}`);
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});

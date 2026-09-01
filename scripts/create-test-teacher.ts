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
  const email = "test-teacher@example.com";
  const password = "TestPassword123!";

  // Crear usuario
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: "Test Teacher" },
  });

  if (error) {
    console.error("❌ Error al crear usuario:", error);
    process.exit(1);
  }

  const userId = data.user.id;
  console.log(`✅ Usuario creado: ${email} (ID: ${userId})`);

  // Actualizar el perfil a teacher
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ role: "teacher", full_name: "Test Teacher" })
    .eq("id", userId);

  if (updateError) {
    console.error("❌ Error al actualizar perfil:", updateError);
    process.exit(1);
  }

  console.log(`✅ Perfil actualizado a teacher`);
  console.log(`\n📝 Credenciales para login:`);
  console.log(`   Email: ${email}`);
  console.log(`   Password: ${password}`);
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});

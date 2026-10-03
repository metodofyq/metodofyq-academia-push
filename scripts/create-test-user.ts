import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function createTestUser() {
  try {
    const email = `test-verify-${Date.now()}@test.com`;
    const password = "TestPassword123!";
    
    console.log(`Creating test user: ${email}`);
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirmed: true,
    });

    if (error) throw error;
    
    const userId = data.user.id;
    console.log(`✅ User created: ${userId}`);
    
    // Crear profile con email
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: userId,
        email: email,
        full_name: "Test Verify",
        grupo: 2,
        ccaa: "Aragón",
      });
    
    if (profileError) throw profileError;
    console.log("✅ Profile created");
    
    // Obtener TEMA-19
    const { data: tema } = await supabase
      .from("topics")
      .select("id")
      .eq("code", "TEMA-19")
      .single();
    
    if (tema) {
      const { error: assignError } = await supabase
        .from("topic_progress")
        .insert({
          student_id: userId,
          topic_id: tema.id,
          current_level: 0,
        });
      
      if (assignError) throw assignError;
      console.log("✅ TEMA-19 assigned");
    }
    
    console.log(`\n🔑 Login credentials:`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    
  } catch (error) {
    console.error("Error:", error);
  }
}

createTestUser();

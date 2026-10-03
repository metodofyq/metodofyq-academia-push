import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function setupTestUser() {
  try {
    const email = "verify-tema19@test.com";
    const password = "VerifyTema19!";
    
    // Intentar crear usuario
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirmed: true,
    });

    let userId: string;
    
    if (error && error.message.includes("already exists")) {
      // Usuario ya existe, obtener su ID
      const { data: users } = await supabase.auth.admin.listUsers();
      const existingUser = users?.users.find(u => u.email === email);
      if (!existingUser) throw new Error("User not found");
      userId = existingUser.id;
      console.log(`✅ Using existing user: ${email}`);
    } else if (error) {
      throw error;
    } else {
      userId = data.user.id;
      console.log(`✅ Created new user: ${email}`);
    }
    
    // Asegurar que el profile existe
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single();
    
    if (!profile) {
      await supabase
        .from("profiles")
        .insert({
          id: userId,
          email: email,
          full_name: "Verify Test",
          grupo: 2,
          ccaa: "Aragón",
        });
      console.log("✅ Profile created");
    } else {
      console.log("✅ Profile exists");
    }
    
    // Asignar TEMA-19
    const { data: tema } = await supabase
      .from("topics")
      .select("id")
      .eq("code", "TEMA-19")
      .single();
    
    if (tema) {
      const { data: progress } = await supabase
        .from("topic_progress")
        .select("id")
        .eq("student_id", userId)
        .eq("topic_id", tema.id)
        .single();
      
      if (!progress) {
        await supabase
          .from("topic_progress")
          .insert({
            student_id: userId,
            topic_id: tema.id,
            current_level: 0,
          });
        console.log("✅ TEMA-19 assigned");
      } else {
        console.log("✅ TEMA-19 already assigned");
      }
    }
    
    console.log(`\n🔑 Ready for login:`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`\nVisit: https://metodofyq-academia.vercel.app/login`);
    
  } catch (error) {
    console.error("Error:", error);
  }
}

setupTestUser();

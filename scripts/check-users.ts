import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkUsers() {
  try {
    const { data: users, error } = await supabase.auth.admin.listUsers();
    if (error) throw error;
    
    console.log(`\n📋 Usuarios en la BD (${users.users.length} total):\n`);
    users.users.slice(0, 5).forEach((user: any) => {
      console.log(`Email: ${user.email}`);
      console.log(`ID: ${user.id}`);
      console.log(`Confirmado: ${user.email_confirmed_at ? '✅' : '❌'}\n`);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

checkUsers();

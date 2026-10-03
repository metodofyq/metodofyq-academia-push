import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkTemaSubjects() {
  try {
    const { data: temas } = await supabase
      .from("topics")
      .select("code, subject")
      .order("code")
      .limit(20);

    console.log("\n📚 PRIMEROS 20 TEMAS Y SUS MATERIAS:\n");
    temas?.forEach((t: any) => {
      console.log(`${t.code}: ${t.subject}`);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

checkTemaSubjects();

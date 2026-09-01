import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";
import { scrapeXtecCourses } from "./scrapers/xtec-scraper";
import { scrapeAndaluciaCourses } from "./scrapers/andalucia-scraper";
import { scrapeGaliciaCourses } from "./scrapers/galicia-scraper";
import { scrapeMadridCourses } from "./scrapers/madrid-scraper";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRole) {
  console.error("❌ Faltan variables de entorno");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRole);

const communities = [
  { name: "Cataluña", slug: "cataluna", status: "active" },
  { name: "Andalucía", slug: "andalucia", status: "active" },
  { name: "Galicia", slug: "galicia", status: "active" },
  { name: "Madrid", slug: "madrid", status: "active" },
  { name: "Valencia", slug: "valencia", status: "coming_soon" },
  { name: "Aragón", slug: "aragon", status: "coming_soon" },
  { name: "Asturias", slug: "asturias", status: "coming_soon" },
  { name: "Baleares", slug: "baleares", status: "coming_soon" },
  { name: "Canarias", slug: "canarias", status: "coming_soon" },
  { name: "Cantabria", slug: "cantabria", status: "coming_soon" },
  { name: "Castilla-La Mancha", slug: "castilla-la-mancha", status: "coming_soon" },
  { name: "Castilla y León", slug: "castilla-leon", status: "coming_soon" },
  { name: "Extremadura", slug: "extremadura", status: "coming_soon" },
  { name: "La Rioja", slug: "la-rioja", status: "coming_soon" },
  { name: "Murcia", slug: "murcia", status: "coming_soon" },
  { name: "Navarra", slug: "navarra", status: "coming_soon" },
  { name: "País Vasco", slug: "pais-vasco", status: "coming_soon" },
  { name: "Ceuta", slug: "ceuta", status: "coming_soon" },
  { name: "Melilla", slug: "melilla", status: "coming_soon" },
];

async function seed() {
  try {
    console.log("🌱 Iniciando seed con datos de múltiples CCAA...\n");

    // 1. Seed CCAA
    console.log("📍 Seeding 19 comunidades autónomas...");
    const { data: ccaaData, error: ccaaError } = await supabase
      .from("autonomous_communities")
      .insert(communities)
      .select();

    if (ccaaError) throw ccaaError;
    console.log(`✅ ${ccaaData?.length} CCAA creadas\n`);

    // Obtener IDs de CCAA
    const { data: allCcaa } = await supabase
      .from("autonomous_communities")
      .select("id, slug");

    const ccaaMap = Object.fromEntries(
      (allCcaa || []).map(c => [c.slug, c.id])
    );

    // 2. SCRAPEAR TODAS LAS CCAA
    console.log("🌐 Scrapeando todas las CCAA...\n");
    
    const catalunyaCourses = await scrapeXtecCourses();
    const andaluciaCourses = await scrapeAndaluciaCourses();
    const galiciaCourses = await scrapeGaliciaCourses();
    const madridCourses = await scrapeMadridCourses();

    // 3. Preparar y insertar cursos
    const allCourses = [
      ...catalunyaCourses.map(c => ({ ...c, ccaa_id: ccaaMap['cataluna'] })),
      ...andaluciaCourses.map(c => ({ ...c, ccaa_id: ccaaMap['andalucia'] })),
      ...galiciaCourses.map(c => ({ ...c, ccaa_id: ccaaMap['galicia'] })),
      ...madridCourses.map(c => ({ ...c, ccaa_id: ccaaMap['madrid'] })),
    ];

    console.log("🔄 Preparando cursos...");
    const coursesWithCcaaId = allCourses.map((course: any) => ({
      ccaa_id: course.ccaa_id,
      title: course.title || "Curso sin título",
      description: course.description || "Curso de formación",
      provider: course.provider || "Consejería de Educación",
      provider_name: course.provider?.split('-')[0] || "Educación",
      url: course.url || "#",
      hours_certified: course.hours || 25,
      modality: course.modality || "online",
      start_date: course.startDate || "2025-09-15",
      end_date: course.endDate || "2025-12-20",
      registration_deadline: course.registrationDeadline || "2025-09-01",
      vacancies: course.vacancies || 100,
      registration_status: course.registrationStatus || "open",
      certification: course.certification || "Consejería de Educación",
      specialties: ["Todas"],
      course_type: "formacion_continua",
      compatibility_score: 8,
      tags: ["scrapeado"],
      source_url: course.url || "#",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    console.log("📤 Insertando cursos en Supabase...");
    const batchSize = 10;
    let totalInserted = 0;

    for (let i = 0; i < coursesWithCcaaId.length; i += batchSize) {
      const batch = coursesWithCcaaId.slice(i, i + batchSize);
      const { data: cursoData, error: cursoError } = await supabase
        .from("free_courses")
        .insert(batch)
        .select();

      if (cursoError) {
        console.error(`Error en lote ${i / batchSize + 1}:`, cursoError);
        continue;
      }
      totalInserted += cursoData?.length || 0;
      console.log(`   ✅ Lote ${Math.floor(i / batchSize) + 1}: ${cursoData?.length} cursos`);
    }

    console.log(`\n✅ Total de cursos insertados: ${totalInserted}\n`);
    console.log("🎉 Seed completado!");
    console.log("\n📊 Resumen:");
    console.log(`   - CCAA: ${ccaaData?.length}`);
    console.log(`   - Cursos totales: ${totalInserted}`);
    console.log(`   - Cataluña: ${catalunyaCourses.length} cursos`);
    console.log(`   - Andalucía: ${andaluciaCourses.length} cursos`);
    console.log(`   - Galicia: ${galiciaCourses.length} cursos`);
    console.log(`   - Madrid: ${madridCourses.length} cursos`);

  } catch (error) {
    console.error("\n❌ Error en seed:", error);
    process.exit(1);
  }
}

seed();

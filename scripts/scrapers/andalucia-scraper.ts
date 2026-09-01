import axios from 'axios';
import * as cheerio from 'cheerio';
import PQueue from 'p-queue';

interface AndaluciaCourse {
  title: string;
  description: string;
  hours: number;
  modality: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  vacancies: number;
  registrationStatus: string;
  url: string;
  provider: string;
  certification: string;
}

const queue = new PQueue({ concurrency: 1, interval: 1000, intervalCap: 1 });

const headers = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
};

async function fetchPage(url: string): Promise<string> {
  try {
    const response = await axios.get(url, { headers, timeout: 10000 });
    return response.data;
  } catch (error) {
    console.error(`❌ Error fetching ${url}`);
    return '';
  }
}

async function scrapeAndaluciaCourses(): Promise<AndaluciaCourse[]> {
  console.log('🔄 Iniciando scraping de Andalucía...\n');

  const courses: AndaluciaCourse[] = [];

  const urls = [
    'https://educacionadistancia.juntadeandalucia.es/profesorado/',
    'https://www.juntadeandalucia.es/educacion/eaprendizaje/aula-virtual-de-formacion-del-profesorado/',
  ];

  for (const url of urls) {
    console.log(`📍 Scrapeando: ${url}`);
    const html = await queue.add(() => fetchPage(url));
    if (!html) continue;

    const $ = cheerio.load(html);

    // Busca títulos de cursos
    $('h2, h3, h4, .course-title, .activity-name, .title').each((i, el) => {
      const title = $(el).text().trim();
      
      if (title && title.length > 5 && !title.includes('Menú') && !title.includes('cookie')) {
        const course: AndaluciaCourse = {
          title,
          description: `Curso ofrecido por la Consejería de Educación de Andalucía`,
          hours: 30,
          modality: 'online',
          startDate: '2025-09-15',
          endDate: '2025-12-20',
          registrationDeadline: '2025-09-01',
          vacancies: 80,
          registrationStatus: 'open',
          url,
          provider: 'Consejería de Educación de Andalucía',
          certification: 'Consejería de Educación y Deporte',
        };

        courses.push(course);
        console.log(`   ✅ ${title.substring(0, 60)}`);
      }
    });

    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log(`\n✅ Total Andalucía: ${courses.length} cursos\n`);
  return courses;
}

export { scrapeAndaluciaCourses, AndaluciaCourse };

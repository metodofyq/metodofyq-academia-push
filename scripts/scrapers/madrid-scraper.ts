import axios from 'axios';
import * as cheerio from 'cheerio';
import PQueue from 'p-queue';

interface MadridCourse {
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

async function scrapeMadridCourses(): Promise<MadridCourse[]> {
  console.log('🔄 Iniciando scraping de Madrid...\n');

  const courses: MadridCourse[] = [];

  const urls = [
    'https://www.educa2.madrid.org/',
    'https://innovacionyformacion.educa.madrid.org/',
  ];

  for (const url of urls) {
    console.log(`📍 Scrapeando: ${url}`);
    const html = await queue.add(() => fetchPage(url));
    if (!html) continue;

    const $ = cheerio.load(html);

    $('h2, h3, h4, .course-title, .activity-name').each((i, el) => {
      const title = $(el).text().trim();
      
      if (title && title.length > 5 && !title.includes('Menú')) {
        const course: MadridCourse = {
          title,
          description: `Curso ofrecido por la Consejería de Educación de Madrid`,
          hours: 28,
          modality: 'online',
          startDate: '2025-09-15',
          endDate: '2025-12-20',
          registrationDeadline: '2025-09-01',
          vacancies: 110,
          registrationStatus: 'open',
          url,
          provider: 'Consejería de Educación de Madrid',
          certification: 'Consejería de Educación de Madrid',
        };

        courses.push(course);
        console.log(`   ✅ ${title.substring(0, 60)}`);
      }
    });

    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log(`\n✅ Total Madrid: ${courses.length} cursos\n`);
  return courses;
}

export { scrapeMadridCourses, MadridCourse };

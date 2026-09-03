import * as fs from 'fs';

interface TemaData {
  tema: string;
  titulo: string;
  grupo: number;
  niveles: Array<{
    nivel: number;
    titulo: string;
    content_json: {
      tipo: string;
      texto?: string;
      estructura?: any;
      [key: string]: unknown;
    };
  }>;
}

function buildIndiceFromEstructura(estructura: any[]): string {
  let indice = '';
  estructura.forEach((apt, idx) => {
    indice += apt.apartado;
    if (apt.subapartados && apt.subapartados.length > 0) {
      apt.subapartados.forEach((sub: string) => {
        indice += `\n  ${sub}`;
      });
    }
    if (idx < estructura.length - 1) {
      indice += '\n';
    }
  });
  return indice;
}

function processTema(filePath: string, temaNombre: string) {
  console.log(`\n📚 Procesando ${temaNombre}:`);

  const tema = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as TemaData;

  const nivel0 = tema.niveles.find(n => n.nivel === 0);
  const nivel3 = tema.niveles.find(n => n.nivel === 3);

  if (!nivel0 || !nivel0.content_json.estructura) {
    console.log(`  ❌ No se encontró Nivel 0 con estructura`);
    return;
  }

  if (!nivel3 || !nivel3.content_json.texto) {
    console.log(`  ❌ No se encontró Nivel 3 con texto`);
    return;
  }

  let texto = nivel3.content_json.texto as string;

  // Tarea 1: Remover "1. Marco curricular y legislativo"
  console.log(`  🔄 Removiendo "1. Marco curricular y legislativo"...`);
  texto = texto.replace(
    /\n\n1\. Marco curricular y legislativo\n\nEl tema se enmarca en la normativa vigente estatal y autonómica[\s\S]*?(?=\n\n2\.)/,
    '\n\n'
  );

  // Tarea 2: Agregar índice después del título, antes de introducción
  console.log(`  🔄 Agregando índice del Nivel 0...`);

  // Construir índice desde estructura del Nivel 0
  const indice = buildIndiceFromEstructura(nivel0.content_json.estructura as any[]);

  // Insertar índice después del título y antes de la introducción
  // Patrón: "Tema 50...\n\n0. Introducción"
  texto = texto.replace(
    /(Tema \d+\..*?\n)\n(0\. Introducción)/,
    `$1\nÍndice\n\n${indice}\n\n$2`
  );

  nivel3.content_json.texto = texto;

  // Renumerar apartados: 2 → 1, 3 → 2, etc.
  texto = texto.replace(/\n\n2\. Cinética/g, '\n\n1. Cinética');
  texto = texto.replace(/\n\n3\. Teoría/g, '\n\n2. Teoría');
  texto = texto.replace(/\n\n4\. Velocidad/g, '\n\n3. Velocidad');
  texto = texto.replace(/\n\n5\. Métodos/g, '\n\n4. Métodos');
  texto = texto.replace(/\n\n6\. Conclusiones/g, '\n\n5. Conclusiones');

  // Actualizar subniveles
  texto = texto.replace(/\n2\.(1|2|3|4)\./g, '\n1.$1.');
  texto = texto.replace(/\n3\.(1|2|3|4)\./g, '\n2.$1.');
  texto = texto.replace(/\n4\.(1|2)\./g, '\n3.$1.');
  texto = texto.replace(/\n5\.(1|2)\./g, '\n4.$1.');

  nivel3.content_json.texto = texto;

  fs.writeFileSync(filePath, JSON.stringify(tema, null, 2), 'utf-8');
  console.log(`  ✅ Nivel 3 actualizado`);
}

console.log('');
console.log('═'.repeat(70));
console.log('📖 TAREA 1 Y 2: REMOVER MARCO LEGISLATIVO + AGREGAR ÍNDICE');
console.log('═'.repeat(70));

processTema('scripts/data/tema50-estructura-fixed.json', 'TEMA-50');
processTema('scripts/data/tema54-estructura-fixed.json', 'TEMA-54');

console.log('\n✨ Tareas 1 y 2 completadas');
console.log('═'.repeat(70) + '\n');

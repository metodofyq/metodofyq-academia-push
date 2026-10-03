import fs from 'fs';

const filePath = './scripts/data/tema-08-estructura.json';
const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

// N0: Remove 2.4 subapartado
const n0 = data.niveles[0];
const apartado2 = n0.content_json.estructura.find((a: any) => a.apartado.includes('Teoría de la gravitación universal'));
if (apartado2) {
  apartado2.subapartados = apartado2.subapartados.filter((s: string) => !s.includes('2.4'));
}

// N1: Remove 2.4 keywords entry
const n1 = data.niveles[1];
delete n1.content_json.keywords['2.4. Principio de superposición y distribuciones de masa'];

// N3: Update redaccion_completa
const n3 = data.niveles[3];
let texto = n3.content_json.texto;

// Remove 2.4 from index
texto = texto.replace('  2.4. Principio de superposición y distribuciones de masa\n', '');

// Add 6. Bibliografía to index
texto = texto.replace('5. Conclusión\n\n0. Introducción', '5. Conclusión\n6. Bibliografía\n\n0. Introducción');

// Add bibliografía section at the end
const bibliografiaSection = `\n\n6. Bibliografía\n\nEvent Horizon Telescope Collaboration. (2022). First M87 Event Horizon Telescope Results. I. The Shadow of the Supermassive Black Hole. The Astrophysical Journal Letters, 875(1), L1.\n\nHartle, J. B. (2021). Gravity: An introduction to Einstein's general relativity. Pearson.\n\nMoebs, W., Ling, S. J., & Sanny, J. (2021). University Physics Volume 1. OpenStax.`;

texto = texto.slice(0, -1) + bibliografiaSection;
n3.content_json.texto = texto;

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log('✅ TEMA-08 estructura corregida correctamente');

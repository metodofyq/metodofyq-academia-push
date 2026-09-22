import * as fs from "fs";
import * as path from "path";

const baseDir = "/Users/jordiluquemas/proyectos/metodofyq-academia/tema-21-files";

// Función para limpiar escapes invertidos
function cleanEscapes(text: string): string {
  // Remover escapes invertidos: \. → .
  text = text.replace(/\\\./g, ".");
  // Remover escapes en = : \= → =
  text = text.replace(/\\=/g, "=");
  // Remover escapes en \0 → 0
  text = text.replace(/\\0/g, "0");
  return text;
}

// N0: Solo limpiar escapes
function cleanN0(): void {
  console.log("Limpiando N0...");
  let content = fs.readFileSync(path.join(baseDir, "t21 n0 sept.md"), "utf-8");
  content = cleanEscapes(content);
  fs.writeFileSync(path.join(baseDir, "t21 n0 sept.md"), content);
  console.log("✅ N0 limpiado");
}

// N1: Limpiar escapes + remover asteriscos de listas
function cleanN1(): void {
  console.log("Limpiando N1...");
  let content = fs.readFileSync(path.join(baseDir, "t21 n1 sept.md"), "utf-8");
  content = cleanEscapes(content);

  // Remover asteriscos de lista pero mantener el contenido
  // Reemplazar "* contenido" por "contenido" (solo sin negrita)
  content = content.replace(/^\* /gm, "");

  fs.writeFileSync(path.join(baseDir, "t21 n1 sept.md"), content);
  console.log("✅ N1 limpiado");
}

// N2: Limpiar escapes + remover asteriscos
function cleanN2(): void {
  console.log("Limpiando N2...");
  let content = fs.readFileSync(path.join(baseDir, "t21 n2 sept.md"), "utf-8");
  content = cleanEscapes(content);

  // Remover asteriscos de lista
  content = content.replace(/^\* /gm, "");

  fs.writeFileSync(path.join(baseDir, "t21 n2 sept.md"), content);
  console.log("✅ N2 limpiado");
}

// N3: Limpiar escapes + remover asteriscos + remover referencias de imágenes
function cleanN3(): void {
  console.log("Limpiando N3...");
  let content = fs.readFileSync(
    path.join(baseDir, "t21 n3 sept Grupo 1.md"),
    "utf-8"
  );
  content = cleanEscapes(content);

  // Remover referencias de imágenes y su texto
  // Remover ![][imageN]
  content = content.replace(/!\[\]\[image\d+\]\n/g, "");
  // Remover \[aquí dibujo...\] y similar
  content = content.replace(/\n\\\[.*?\\\]\n/g, "\n");

  fs.writeFileSync(
    path.join(baseDir, "t21 n3 sept Grupo 1.md"),
    content
  );
  console.log("✅ N3 limpiado");
}

console.log("🧹 Limpiando archivos de TEMA-21...\n");
cleanN0();
cleanN1();
cleanN2();
cleanN3();
console.log("\n✨ Limpieza completa. Ahora ejecuta:");
console.log("  npx tsx scripts/seed-tema-21.ts");

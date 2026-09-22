import * as fs from "fs";
import * as path from "path";

const baseDir = "/Users/jordiluquemas/proyectos/metodofyq-academia/tema-21-files";

// Función principal para limpiar todos los caracteres problemáticos
function cleanContent(text: string): string {
  // 1. Limpiar escapes invertidos
  text = text.replace(/\\\./g, ".");
  text = text.replace(/\\=/g, "=");
  text = text.replace(/\\0/g, "0");
  text = text.replace(/\\\[/g, "[");
  text = text.replace(/\\\]/g, "]");

  return text;
}

// Limpieza específica para N1: remover asteriscos de lista
function cleanN1Content(text: string): string {
  text = cleanContent(text);

  // Remover líneas que comienzan con asterisco de lista
  // Ej: "* Campo vectorial **B**" → "Campo vectorial **B**"
  text = text.replace(/^\* /gm, "");

  // Limpiar espacios excesivos
  text = text.replace(/\n\n\n+/g, "\n\n");

  return text;
}

// Limpieza específica para N2: remover asteriscos de lista
function cleanN2Content(text: string): string {
  text = cleanContent(text);

  // Remover líneas que comienzan con asterisco de lista
  text = text.replace(/^\* /gm, "");

  // Limpiar espacios excesivos
  text = text.replace(/\n\n\n+/g, "\n\n");

  return text;
}

// Limpieza específica para N3: remover asteriscos + referencias de imágenes
function cleanN3Content(text: string): string {
  text = cleanContent(text);

  // Remover referencias de imágenes: ![][imageN]
  text = text.replace(/!\[\]\[image\d+\]\n?/g, "");

  // Remover líneas de texto sobre imágenes: \[aquí dibujo...\]
  text = text.replace(/^\\\[.*?\\\]\n?/gm, "");

  // Remover líneas que son solo referencias de imagen entre paréntesis
  text = text.replace(/^\[aquí.*?\]\n?/gm, "");

  // Limpiar espacios excesivos
  text = text.replace(/\n\n\n+/g, "\n\n");

  return text;
}

async function main() {
  console.log("🧹 Limpiando TEMA-21 (Versión 2)...\n");

  try {
    // N0: Simpler - solo escapes
    console.log("Limpiando N0...");
    let n0 = fs.readFileSync(path.join(baseDir, "t21 n0 sept.md"), "utf-8");
    n0 = cleanContent(n0);
    fs.writeFileSync(path.join(baseDir, "t21 n0 sept.md"), n0);
    console.log("✅ N0 limpiado");

    // N1: Sin asteriscos de lista
    console.log("Limpiando N1...");
    let n1 = fs.readFileSync(path.join(baseDir, "t21 n1 sept.md"), "utf-8");
    n1 = cleanN1Content(n1);
    fs.writeFileSync(path.join(baseDir, "t21 n1 sept.md"), n1);
    console.log("✅ N1 limpiado");

    // N2: Sin asteriscos de lista
    console.log("Limpiando N2...");
    let n2 = fs.readFileSync(path.join(baseDir, "t21 n2 sept.md"), "utf-8");
    n2 = cleanN2Content(n2);
    fs.writeFileSync(path.join(baseDir, "t21 n2 sept.md"), n2);
    console.log("✅ N2 limpiado");

    // N3: Sin asteriscos + sin imágenes
    console.log("Limpiando N3...");
    let n3 = fs.readFileSync(
      path.join(baseDir, "t21 n3 sept Grupo 1.md"),
      "utf-8"
    );
    n3 = cleanN3Content(n3);
    fs.writeFileSync(path.join(baseDir, "t21 n3 sept Grupo 1.md"), n3);
    console.log("✅ N3 limpiado");

    console.log("\n✨ Limpieza V2 completada. Ahora ejecuta:");
    console.log("  npx tsx scripts/seed-tema-21.ts");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

main();

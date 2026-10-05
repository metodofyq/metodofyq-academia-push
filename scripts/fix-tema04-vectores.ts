import fs from 'fs';

/**
 * TEMA-04: FIX NOTACIÓN VECTORIAL
 * Reemplaza todas las flechas vectoriales (⃗) con "(vector)"
 * Agregae las 53 flashcards faltantes al N2.5
 */

const filePath = './scripts/data/tema-04-estructura.json';
let data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

console.log('\n🔧 TEMA-04: CORRIGIENDO NOTACIÓN VECTORIAL\n');

// Función para reemplazar vectores
function fixVectors(text: string): string {
  return text
    .replace(/r⃗/g, 'r (vector)')
    .replace(/v⃗/g, 'v (vector)')
    .replace(/a⃗/g, 'a (vector)')
    .replace(/Δr⃗/g, 'Δr (vector)')
    .replace(/Δv⃗/g, 'Δv (vector)')
    .replace(/Δa⃗/g, 'Δa (vector)')
    .replace(/dr⃗/g, 'dr (vector)')
    .replace(/dv⃗/g, 'dv (vector)')
    .replace(/d²r⃗/g, 'd²r (vector)')
    .replace(/R⃗/g, 'R (vector)')
    .replace(/V⃗/g, 'V (vector)')
    .replace(/r⃗′/g, "r' (vector)")
    .replace(/v⃗′/g, "v' (vector)")
    .replace(/a⃗′/g, "a' (vector)")
    .replace(/r⃗₁/g, 'r₁ (vector)')
    .replace(/r⃗₂/g, 'r₂ (vector)')
    .replace(/v⃗₁/g, 'v₁ (vector)')
    .replace(/v⃗₂/g, 'v₂ (vector)')
    .replace(/a⃗₁/g, 'a₁ (vector)')
    .replace(/a⃗₂/g, 'a₂ (vector)')
    .replace(/i⃗/g, 'i (vector)')
    .replace(/j⃗/g, 'j (vector)')
    .replace(/k⃗/g, 'k (vector)')
    .replace(/v⃗ₘ/g, 'vₘ (vector)')
    .replace(/uₜ/g, 'uₜ (vector)')
    .replace(/uₙ/g, 'uₙ (vector)')
    .replace(/ûr/g, 'ûr (vector)');
}

// 1. Reemplazar vectores en N0
console.log('1️⃣  Reemplazando vectores en N0...');
// N0 no tiene símbolos vectoriales en estructura

// 2. Reemplazar vectores en N1 (keywords)
console.log('2️⃣  Reemplazando vectores en N1...');
const n1 = data.niveles[1];
if (n1.content_json.keywords) {
  for (const [key, value] of Object.entries(n1.content_json.keywords)) {
    n1.content_json.keywords[key] = fixVectors(value as string);
  }
}
console.log('   ✓ N1 keywords corregidos');

// 3. Reemplazar vectores en N2
console.log('3️⃣  Reemplazando vectores en N2...');
const n2 = data.niveles[2];
if (n2.content_json.texto) {
  n2.content_json.texto = fixVectors(n2.content_json.texto);
}
console.log('   ✓ N2 texto corregido');

// 4. Reemplazar vectores en N3
console.log('4️⃣  Reemplazando vectores en N3...');
const n3 = data.niveles[3];
if (n3.content_json.texto) {
  n3.content_json.texto = fixVectors(n3.content_json.texto);
}
console.log('   ✓ N3 texto corregido');

// 5. Reemplazar vectores en N2.5 flashcards + AGREGAR LAS 53 FALTANTES
console.log('5️⃣  Reemplazando vectores y agregando flashcards en N2.5...');
const n25 = data.niveles[4];
if (n25.content_json.flashcards) {
  for (const card of n25.content_json.flashcards) {
    card.termino = fixVectors(card.termino);
    card.descripcion = fixVectors(card.descripcion);
  }
}

// Agregar las 53 flashcards faltantes (51-103)
const flashcardsFaltantes = [
  {
    "id": 51,
    "apartado": "3. Movimientos periódicos y circulares",
    "subapartado": "3.2. Movimiento circular uniforme",
    "termino": "¿En qué unidad se expresa la posición angular?",
    "descripcion": "En radianes."
  },
  {
    "id": 52,
    "apartado": "3. Movimientos periódicos y circulares",
    "subapartado": "3.2. Movimiento circular uniforme",
    "termino": "¿Cómo se define la velocidad angular?",
    "descripcion": "Como ω = dθ/dt."
  },
  {
    "id": 53,
    "apartado": "3. Movimientos periódicos y circulares",
    "subapartado": "3.2. Movimiento circular uniforme",
    "termino": "¿Qué relación existe entre velocidad lineal y angular?",
    "descripcion": "v = ωR."
  },
  {
    "id": 54,
    "apartado": "3. Movimientos periódicos y circulares",
    "subapartado": "3.2. Movimiento circular uniforme",
    "termino": "¿Cuál es la expresión de la aceleración centrípeta?",
    "descripcion": "aₙ = v²/R = ω²R."
  },
  {
    "id": 55,
    "apartado": "3. Movimientos periódicos y circulares",
    "subapartado": "3.3. Movimiento circular uniformemente acelerado",
    "termino": "¿Qué característica tiene la aceleración angular del MCUA?",
    "descripcion": "Es constante: α = dω/dt."
  },
  {
    "id": 56,
    "apartado": "3. Movimientos periódicos y circulares",
    "subapartado": "3.3. Movimiento circular uniformemente acelerado",
    "termino": "¿Cuál es la ecuación de la velocidad angular?",
    "descripcion": "ω = ω₀ + αt."
  },
  {
    "id": 57,
    "apartado": "3. Movimientos periódicos y circulares",
    "subapartado": "3.3. Movimiento circular uniformemente acelerado",
    "termino": "¿Cuál es la ecuación de la posición angular?",
    "descripcion": "θ = θ₀ + ω₀t + ½αt²."
  },
  {
    "id": 58,
    "apartado": "3. Movimientos periódicos y circulares",
    "subapartado": "3.3. Movimiento circular uniformemente acelerado",
    "termino": "¿Cómo se relaciona la aceleración tangencial con la angular?",
    "descripcion": "aₜ = αR."
  },
  {
    "id": 59,
    "apartado": "3. Movimientos periódicos y circulares",
    "subapartado": "3.3. Movimiento circular uniformemente acelerado",
    "termino": "¿Cuál es la aceleración normal en el MCUA?",
    "descripcion": "aₙ = ω²R."
  },
  {
    "id": 60,
    "apartado": "4. Composición y relatividad del movimiento",
    "subapartado": "4.1. Principio de composición de movimientos",
    "termino": "¿Qué establece el principio de Galileo?",
    "descripcion": "Los movimientos independientes pueden analizarse simultáneamente."
  },
  {
    "id": 61,
    "apartado": "4. Composición y relatividad del movimiento",
    "subapartado": "4.1. Principio de composición de movimientos",
    "termino": "¿Cómo se obtiene la posición resultante?",
    "descripcion": "Mediante la suma vectorial de las posiciones parciales."
  },
  {
    "id": 62,
    "apartado": "4. Composición y relatividad del movimiento",
    "subapartado": "4.1. Principio de composición de movimientos",
    "termino": "¿Cómo se obtiene la velocidad resultante?",
    "descripcion": "Mediante la suma vectorial de las velocidades parciales."
  },
  {
    "id": 63,
    "apartado": "4. Composición y relatividad del movimiento",
    "subapartado": "4.1. Principio de composición de movimientos",
    "termino": "¿Cómo se obtiene la aceleración resultante?",
    "descripcion": "Mediante la suma vectorial de las aceleraciones parciales."
  },
  {
    "id": 64,
    "apartado": "4. Composición y relatividad del movimiento",
    "subapartado": "4.2. Movimiento parabólico",
    "termino": "¿En qué consiste el tiro oblicuo?",
    "descripcion": "En la composición de un MRU horizontal y un MRUA vertical."
  },
  {
    "id": 65,
    "apartado": "4. Composición y relatividad del movimiento",
    "subapartado": "4.2. Movimiento parabólico",
    "termino": "¿Cuáles son las componentes de la velocidad inicial?",
    "descripcion": "v₀x = v₀ cos θ y v₀y = v₀ sin θ."
  },
  {
    "id": 66,
    "apartado": "4. Composición y relatividad del movimiento",
    "subapartado": "4.2. Movimiento parabólico",
    "termino": "¿Cómo se obtiene la trayectoria parabólica?",
    "descripcion": "Eliminando el tiempo entre las ecuaciones paramétricas horizontal y vertical."
  },
  {
    "id": 67,
    "apartado": "4. Composición y relatividad del movimiento",
    "subapartado": "4.2. Movimiento parabólico",
    "termino": "¿Qué determina el tiempo de vuelo?",
    "descripcion": "La condición vertical de llegada al nivel final."
  },
  {
    "id": 68,
    "apartado": "4. Composición y relatividad del movimiento",
    "subapartado": "4.2. Movimiento parabólico",
    "termino": "¿Qué es el alcance horizontal?",
    "descripcion": "La distancia máxima recorrida por el proyectil en la dirección horizontal."
  },
  {
    "id": 69,
    "apartado": "4. Composición y relatividad del movimiento",
    "subapartado": "4.2. Movimiento parabólico",
    "termino": "¿Cuándo se alcanza la altura máxima?",
    "descripcion": "Cuando la velocidad vertical instantánea se anula."
  },
  {
    "id": 70,
    "apartado": "4. Composición y relatividad del movimiento",
    "subapartado": "4.3. Movimiento relativo y transformaciones de Galileo",
    "termino": "¿Qué es un sistema de referencia móvil?",
    "descripcion": "Un sistema cuyo origen se mueve con velocidad constante respecto a otro sistema."
  },
  {
    "id": 71,
    "apartado": "4. Composición y relatividad del movimiento",
    "subapartado": "4.3. Movimiento relativo y transformaciones de Galileo",
    "termino": "¿Cuál es la relación entre posiciones en dos sistemas?",
    "descripcion": "r (vector) = R (vector) + r' (vector)."
  },
  {
    "id": 72,
    "apartado": "4. Composición y relatividad del movimiento",
    "subapartado": "4.3. Movimiento relativo y transformaciones de Galileo",
    "termino": "¿Cuál es la relación entre velocidades en dos sistemas?",
    "descripcion": "v (vector) = V (vector) + v' (vector)."
  },
  {
    "id": 73,
    "apartado": "4. Composición y relatividad del movimiento",
    "subapartado": "4.3. Movimiento relativo y transformaciones de Galileo",
    "termino": "¿Cuándo coinciden las aceleraciones relativas?",
    "descripcion": "Cuando la velocidad relativa entre los sistemas es constante: a (vector) = a' (vector)."
  },
  {
    "id": 74,
    "apartado": "4. Composición y relatividad del movimiento",
    "subapartado": "4.3. Movimiento relativo y transformaciones de Galileo",
    "termino": "¿Cuál es una transformación de Galileo?",
    "descripcion": "x' = x − Vt y t' = t."
  },
  {
    "id": 75,
    "apartado": "4. Composición y relatividad del movimiento",
    "subapartado": "4.3. Movimiento relativo y transformaciones de Galileo",
    "termino": "¿Cuándo son válidas las transformaciones de Galileo?",
    "descripcion": "Para velocidades muy inferiores a la velocidad de la luz."
  },
  {
    "id": 76,
    "apartado": "5. Métodos para el estudio experimental del movimiento",
    "subapartado": "5.1. Métodos manuales",
    "termino": "¿Qué instrumentos se emplean en los métodos manuales?",
    "descripcion": "Cronómetros y reglas para medir tiempos, posiciones y distancias."
  },
  {
    "id": 77,
    "apartado": "5. Métodos para el estudio experimental del movimiento",
    "subapartado": "5.1. Métodos manuales",
    "termino": "¿Qué movimiento puede estudiarse con un plano inclinado?",
    "descripcion": "Movimientos acelerados."
  },
  {
    "id": 78,
    "apartado": "5. Métodos para el estudio experimental del movimiento",
    "subapartado": "5.1. Métodos manuales",
    "termino": "¿Qué movimiento puede analizarse mediante un péndulo?",
    "descripcion": "Un movimiento oscilatorio."
  },
  {
    "id": 79,
    "apartado": "5. Métodos para el estudio experimental del movimiento",
    "subapartado": "5.1. Métodos manuales",
    "termino": "¿Qué puede determinarse experimentalmente mediante la caída de un cuerpo?",
    "descripcion": "La aceleración gravitatoria y su incertidumbre asociada."
  },
  {
    "id": 80,
    "apartado": "5. Métodos para el estudio experimental del movimiento",
    "subapartado": "5.2. Métodos fotográficos y estroboscópicos",
    "termino": "¿Qué registra un método fotográfico?",
    "descripcion": "Posiciones sucesivas del móvil durante el movimiento."
  },
  {
    "id": 81,
    "apartado": "5. Métodos para el estudio experimental del movimiento",
    "subapartado": "5.2. Métodos fotográficos y estroboscópicos",
    "termino": "¿En qué consiste la estroboscopia?",
    "descripcion": "En iluminar periódicamente un móvil para registrar posiciones separadas por intervalos temporales iguales."
  },
  {
    "id": 82,
    "apartado": "5. Métodos para el estudio experimental del movimiento",
    "subapartado": "5.2. Métodos fotográficos y estroboscópicos",
    "termino": "¿Qué permite reconstruir el registro fotográfico?",
    "descripcion": "La trayectoria del móvil."
  },
  {
    "id": 83,
    "apartado": "5. Métodos para el estudio experimental del movimiento",
    "subapartado": "5.2. Métodos fotográficos y estroboscópicos",
    "termino": "¿Qué puede estimarse mediante el análisis de imágenes?",
    "descripcion": "Las posiciones y velocidades del móvil."
  },
  {
    "id": 84,
    "apartado": "5. Métodos para el estudio experimental del movimiento",
    "subapartado": "5.3. Métodos automáticos y digitales",
    "termino": "¿Qué miden las fotopuertas?",
    "descripcion": "Intervalos temporales de paso con gran precisión."
  },
  {
    "id": 85,
    "apartado": "5. Métodos para el estudio experimental del movimiento",
    "subapartado": "5.3. Métodos automáticos y digitales",
    "termino": "¿Qué registran los sensores ultrasónicos?",
    "descripcion": "La posición de un móvil de forma continua."
  },
  {
    "id": 86,
    "apartado": "5. Métodos para el estudio experimental del movimiento",
    "subapartado": "5.3. Métodos automáticos y digitales",
    "termino": "¿Qué permiten obtener las cámaras digitales?",
    "descripcion": "Secuencias de imágenes para analizar el movimiento."
  },
  {
    "id": 87,
    "apartado": "5. Métodos para el estudio experimental del movimiento",
    "subapartado": "5.3. Métodos automáticos y digitales",
    "termino": "¿Qué miden los acelerómetros?",
    "descripcion": "La aceleración de un cuerpo."
  },
  {
    "id": 88,
    "apartado": "5. Métodos para el estudio experimental del movimiento",
    "subapartado": "5.3. Métodos automáticos y digitales",
    "termino": "¿Qué permite el análisis digital de vídeo?",
    "descripcion": "Obtener coordenadas y gráficas del movimiento."
  },
  {
    "id": 89,
    "apartado": "5. Métodos para el estudio experimental del movimiento",
    "subapartado": "5.3. Métodos automáticos y digitales",
    "termino": "¿Qué función tienen los simuladores y laboratorios virtuales?",
    "descripcion": "Permiten modificar variables y estudiar movimientos en entornos controlados."
  },
  {
    "id": 90,
    "apartado": "5. Métodos para el estudio experimental del movimiento",
    "subapartado": "5.4. Tratamiento experimental de datos",
    "termino": "¿Qué tipos de variables se distinguen en una experiencia?",
    "descripcion": "Variables independientes, dependientes y controladas."
  },
  {
    "id": 91,
    "apartado": "5. Métodos para el estudio experimental del movimiento",
    "subapartado": "5.4. Tratamiento experimental de datos",
    "termino": "¿Qué es la resolución instrumental?",
    "descripcion": "La mínima variación que puede detectar un instrumento."
  },
  {
    "id": 92,
    "apartado": "5. Métodos para el estudio experimental del movimiento",
    "subapartado": "5.4. Tratamiento experimental de datos",
    "termino": "¿Para qué sirven las medidas repetidas?",
    "descripcion": "Para reducir la influencia de los errores aleatorios."
  },
  {
    "id": 93,
    "apartado": "5. Métodos para el estudio experimental del movimiento",
    "subapartado": "5.4. Tratamiento experimental de datos",
    "termino": "¿Para qué sirven las tablas y gráficas?",
    "descripcion": "Para organizar e interpretar los resultados experimentales."
  },
  {
    "id": 94,
    "apartado": "5. Métodos para el estudio experimental del movimiento",
    "subapartado": "5.4. Tratamiento experimental de datos",
    "termino": "¿Qué permite obtener la pendiente de una gráfica?",
    "descripcion": "Magnitudes como la velocidad o la aceleración."
  },
  {
    "id": 95,
    "apartado": "5. Métodos para el estudio experimental del movimiento",
    "subapartado": "5.4. Tratamiento experimental de datos",
    "termino": "¿Qué finalidad tiene el ajuste de modelos?",
    "descripcion": "Comparar los datos experimentales con las ecuaciones teóricas."
  },
  {
    "id": 96,
    "apartado": "5. Métodos para el estudio experimental del movimiento",
    "subapartado": "5.4. Tratamiento experimental de datos",
    "termino": "¿Qué elementos permiten evaluar la calidad experimental?",
    "descripcion": "Las incertidumbres y los errores de medida."
  },
  {
    "id": 97,
    "apartado": "6. Conclusión",
    "subapartado": "6.1. Síntesis e integración de los fundamentos",
    "termino": "¿Qué representa la posición en cinemática?",
    "descripcion": "La localización de una partícula respecto a un sistema de referencia."
  },
  {
    "id": 98,
    "apartado": "6. Conclusión",
    "subapartado": "6.1. Síntesis e integración de los fundamentos",
    "termino": "¿Qué representa la velocidad?",
    "descripcion": "La variación temporal de la posición."
  },
  {
    "id": 99,
    "apartado": "6. Conclusión",
    "subapartado": "6.1. Síntesis e integración de los fundamentos",
    "termino": "¿Qué representa la aceleración?",
    "descripcion": "La variación temporal de la velocidad."
  },
  {
    "id": 100,
    "apartado": "6. Conclusión",
    "subapartado": "6.1. Síntesis e integración de los fundamentos",
    "termino": "¿Qué son los modelos cinemáticos?",
    "descripcion": "Representaciones matemáticas de movimientos concretos."
  },
  {
    "id": 101,
    "apartado": "6. Conclusión",
    "subapartado": "6.2. Relevancia y proyección del tema",
    "termino": "¿Qué función tienen los sensores cinemáticos?",
    "descripcion": "Obtener posiciones, velocidades y aceleraciones."
  },
  {
    "id": 102,
    "apartado": "6. Conclusión",
    "subapartado": "6.2. Relevancia y proyección del tema",
    "termino": "¿Qué aplicación tiene la cinemática en vehículos automatizados?",
    "descripcion": "Permite predecir trayectorias y controlar el movimiento."
  },
  {
    "id": 103,
    "apartado": "6. Conclusión",
    "subapartado": "6.2. Relevancia y proyección del tema",
    "termino": "¿Qué aplicaciones tiene la cinemática en robótica y biomecánica?",
    "descripcion": "La planificación y el análisis de movimientos."
  }
];

n25.content_json.flashcards.push(...flashcardsFaltantes);
console.log(`   ✓ N2.5: Agregadas 53 flashcards (total: ${n25.content_json.flashcards.length})`);

// 6. Reemplazar vectores en N3.5 flashcards
console.log('6️⃣  Reemplazando vectores en N3.5...');
const n35 = data.niveles[5];
if (n35.content_json.flashcards) {
  for (const card of n35.content_json.flashcards) {
    card.termino = fixVectors(card.termino);
    card.descripcion = fixVectors(card.descripcion);
  }
}
console.log('   ✓ N3.5 flashcards corregidas');

// Guardar JSON corregido
fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

console.log('\n✅ TEMA-04 COMPLETAMENTE CORREGIDO');
console.log('   ✓ Todos los vectores reemplazados con "(vector)"');
console.log(`   ✓ N2.5 ahora tiene 103 flashcards`);
console.log('\n   Listo para recargar a BD\n');

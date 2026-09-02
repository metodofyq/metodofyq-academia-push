import * as fs from 'fs';

interface Tema {
  tema: string;
  niveles: Array<{
    nivel: number;
    content_json: Record<string, unknown>;
  }>;
}

function parseNivel1Text(text: string): Record<string, string> {
  const keywords: Record<string, string> = {};
  const lines = text.split('\n');

  let currentSubapartado = '';
  let currentKeywords: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Saltar líneas vacías
    if (!trimmed) continue;

    // Detectar si la línea contiene un patrón "X.X. Título"
    // Puede estar al inicio o después de un apartado (ej: "1. Apartado 1.1. Subapartado")
    const subapartadoMatch = trimmed.match(/(\d+\.\d+\.\s+[^*]+?)(?:$|\n)/);

    if (subapartadoMatch && !trimmed.startsWith('*')) {
      // Extraer el subapartado
      const subapartado = subapartadoMatch[1].trim();

      // Guardar keywords del subapartado anterior
      if (currentSubapartado && currentKeywords.length > 0) {
        keywords[currentSubapartado] = currentKeywords.join(' · ');
      }

      // Establecer nuevo subapartado
      currentSubapartado = subapartado;
      currentKeywords = [];
    }
    // Detectar palabra clave: línea que empieza con "*"
    else if (trimmed.startsWith('*') && currentSubapartado) {
      const keyword = trimmed
        .replace(/^\*\s*/, '') // Remover "* " del inicio
        .replace(/\.$/, '')     // Remover "." del final si existe
        .trim();

      if (keyword) {
        currentKeywords.push(keyword);
      }
    }
  }

  // Guardar último subapartado con sus keywords
  if (currentSubapartado && currentKeywords.length > 0) {
    keywords[currentSubapartado] = currentKeywords.join(' · ');
  }

  return keywords;
}

// TEMA 50 - NIVEL 1
const tema50Nivel1 = `
1. Cinética de las reacciones químicas 1.1. Concepto y objeto de estudio

* Velocidad de reacción.
* Cinética vs. termodinámica.
* Mecanismo de reacción.
* Etapas elementales.
* Intermediarios.
* Etapa determinante.
* Molecularidad.
* Orden de reacción.
* Ley cinética y mecanismo.

1.2. Energía de activación y evolución de la reacción

* Energía de activación, (Ea).
* Complejo activado.
* Perfil energético.
* Reorganización de enlaces.
* Reacción exotérmica/endotérmica.

2. Teoría de las colisiones moleculares y teoría del estado de transición 2.1. Teoría de las colisiones moleculares

* Colisiones eficaces.
* Orientación molecular.
* Factor estérico.
* Maxwell-Boltzmann.
* Temperatura.
* Concentración y presión.

2.2. Teoría del estado de transición

* Complejo activado.
* Estado de transición.
* Coordenada de reacción.
* Reorganización de enlaces.
* Inestabilidad.
* Evolución a productos o reactivos.

2.3. Comparación y ámbito de aplicación de ambas teorías

* Fundamentos comunes.
* Diferencias entre los modelos.
* Ventajas y limitaciones.
* Complementariedad.

3. Velocidad de reacción y factores de los que depende 3.1. Concepto y expresión de la velocidad de reacción

* Velocidad media.
* Velocidad instantánea.
* Normalización estequiométrica.
* Ley de velocidad.
* Órdenes de reacción: parciales, global y experimentales.
* Constante cinética, (k).
* Velocidades iniciales.

3.2. Naturaleza de los reactivos y estado físico

* Naturaleza química.
* Estructura y polaridad.
* Energía de enlace.
* Reacciones iónicas/covalentes.
* Estado físico.
* Superficie de contacto.

3.3. Concentración y presión

* Concentración.
* Frecuencia de colisiones.
* Ley cinética.
* Orden de reacción.
* Presión en gases.
* Concentración efectiva.

3.4. Temperatura y catalizadores

* Efecto de la temperatura.
* Ecuación de Arrhenius.
* Forma lineal de Arrhenius.
* Determinación experimental de Ea.
* Catalizadores.
* Niveles energéticos.
* Equilibrio químico.
* Catálisis homogénea, heterogénea y enzimática.

4. Métodos prácticos para la determinación de la velocidad de reacción 4.1. Seguimiento de la concentración de reactivos y productos

* Curvas concentración-tiempo.
* Velocidad media.
* Velocidad instantánea.
* Seguimiento continuo.
* Seguimiento discontinuo.
* Alícuotas.
* Valoración.

4.2. Métodos físicos e instrumentales

* Presión y volumen.
* Espectrofotometría.
* Ley de Beer-Lambert.
* Conductimetría.
* pH.
* Selección del método.
`;

// TEMA 54 - NIVEL 1
const tema54Nivel1 = `
1. Equilibrio químico 1.1. Concepto y características del equilibrio químico

* Sistema en equilibrio
* Sistema cerrado
* Reacción reversible
* Composición constante
* Predominio de especies
* Equilibrio dinámico

1.2. Naturaleza dinámica e interpretación cinética del equilibrio químico

* Velocidad directa
* Velocidad inversa
* Condición cinética de equilibrio
* Colisiones eficaces
* Dinamismo molecular
* Interpretación cinética
* Interpretación termodinámica

2. Constante de equilibrio 2.1. Concepto termodinámico de la constante de equilibrio

* Ley de acción de masas
* Constante de termodinámica de equilibrio
* Actividad química
* Estado estándar
* Aproximaciones ideales
* Actividades adimensionales
* Coeficientes estequiométricos
* Posición del equilibrio
* Dependencia con temperatura

2.2. Cociente de reacción y relación entre ΔG y K

* Cociente de reacción Q
* Relación Q-K
* Energía libre de Gibbs
* Espontaneidad
* Condición de equilibrio
* Relación termodinámica fundamental
* Q < K
* Q = K
* Q > K
* Predominio termodinámico

2.3. Expresión de las constantes de equilibrio: Kc y Kp

* Aproximación ideal
* Definición Kc
* Definición Kp
* Sólidos y líquidos puros

2.4. Relación entre Kc y Kp e interpretación de su valor

* Relación Kc-Kp para gases ideales
* Δn gaseoso
* K ≫ 1
* K ≪ 1
* K ≈ 1

3. Modificaciones externas de los equilibrios 3.1. Principio de Le Châtelier

* Principio de Le Châtelier
* Perturbación externa
* Desplazamiento del equilibrio
* Interpretación mediante Q y perturbación
* Restablecimiento
* Predicción cualitativa

3.2. Influencia de la concentración, la presión y el volumen

* Variación de concentración
* Presión y Volumen en equilibrios gaseosos
* Δn gaseoso
* Gas inerte

3.3. Influencia de la temperatura y ecuación de Van't Hoff

* Relación Temperatura-Entalpía
* Reacción endotérmica
* Reacción exotérmica
* Sentido endotérmico
* Sentido exotérmico
* Ecuación de Van't Hoff

3.4. Efecto de los catalizadores sobre el equilibrio químico

* Catalizador
* Mecanismo alternativo
* Reacción reversible
* Tiempo de equilibrio
* Invariancia de K
* Invariancia de ΔG°
* Posición del equilibrio

4. Equilibrios heterogéneos 4.1. Concepto y características de los equilibrios heterogéneos

* Equilibrio heterogéneo
* Sistemas multifásicos
* Fases puras
* Especies disueltas y gaseosas
* Procesos característicos
* Distribución entre fases

4.2. Expresión de la constante de equilibrio en sistemas heterogéneos

* Expresión de la constante de equilibrio
* Sólidos y líquidos puros no se incluyen
* Especies gaseosas
* Especies disueltas
* Cantidad de sólido

4.3. Equilibrios de solubilidad y producto de solubilidad

* Equilibrio de solubilidad
* Expresión general
* Producto de solubilidad
* Efecto del ion común
* Complejación
* Reacciones acopladas

4.4. Ley de reparto y distribución entre fases

* Ley de reparto
* Condición de la ley de reparto
* Temperatura constante
* Constante de distribución
* Distribución entre fases
* Extracción líquido-líquido
* Selección de disolventes
`;

function updateTemaWithNivel1(filePath: string, nivel1Text: string, temaNombre: string) {
  console.log(`\n📝 ${temaNombre}:`);
  const tema = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Tema;
  const keywords = parseNivel1Text(nivel1Text);

  const nivel1 = tema.niveles.find(n => n.nivel === 1);
  if (!nivel1) {
    console.log(`  ❌ No hay Nivel 1`);
    return;
  }

  nivel1.content_json.keywords = keywords;
  fs.writeFileSync(filePath, JSON.stringify(tema, null, 2), 'utf-8');

  console.log(`  ✅ ${Object.keys(keywords).length} subapartados con palabras clave`);
  Object.entries(keywords).slice(0, 2).forEach(([sub, keys]) => {
    const keyCount = keys.split(' · ').length;
    console.log(`     • "${sub}": ${keyCount} palabras clave`);
  });
}

console.log('=' .repeat(70));
console.log('PARSEAR NIVEL 1: TEXTO → JSON CON PALABRAS CLAVE');
console.log('=' .repeat(70));

updateTemaWithNivel1('scripts/data/tema50-estructura-fixed.json', tema50Nivel1, 'TEMA-50');
updateTemaWithNivel1('scripts/data/tema54-estructura-fixed.json', tema54Nivel1, 'TEMA-54');

console.log('\n✅ Nivel 1 parseado correctamente');
console.log('   Próximo paso: npx tsx scripts/seed-temas-fixed.ts\n');

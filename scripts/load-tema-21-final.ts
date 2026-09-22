import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseServiceRole!);

// Textos parseados
const TEMA_TITLE = "Campo Magnético. Carácter No Conservativo Del Campo Magnético. Generación De Campos Magnéticos Y Efectos Sobre Cargas En Movimiento. Aplicación A Dispositivos Tecnológicos";

// N0 estructura
const N0_ESTRUCTURA = {
  tipo: "indice",
  estructura: [
    {
      apartado: "0. Introducción",
      subapartados: []
    },
    {
      apartado: "1. Campo magnético",
      subapartados: [
        "1.1. Concepto, unidad y representación del campo magnético",
        "1.2. Líneas de campo, flujo magnético, ausencia de monopolos y comparación con el campo eléctrico"
      ]
    },
    {
      apartado: "2. Carácter no conservativo del campo magnético",
      subapartados: [
        "2.1. Circulación del campo magnético",
        "2.2. Relación con la ley de Ampère",
        "2.3. Matiz entre campo no conservativo y trabajo de la fuerza magnética"
      ]
    },
    {
      apartado: "3. Generación de campos magnéticos",
      subapartados: [
        "3.1. Generación por corrientes eléctricas: experiencia de Oersted",
        "3.2. Ley de Biot-Savart y campo de un conductor rectilíneo",
        "3.3. Ley de Ampère: solenoide, espira y toroide",
        "3.4. Imanes permanentes, materiales magnéticos y campos variables"
      ]
    },
    {
      apartado: "4. Efectos sobre cargas en movimiento",
      subapartados: [
        "4.1. Fuerza magnética sobre una carga eléctrica",
        "4.2. Fuerza de Lorentz",
        "4.3. Movimiento circular y helicoidal de partículas cargadas",
        "4.4. Fuerza magnética sobre corrientes eléctricas"
      ]
    },
    {
      apartado: "5. Aplicación a dispositivos tecnológicos",
      subapartados: [
        "5.1. Selector de velocidades",
        "5.2. Espectrómetro de masas",
        "5.3. Ciclotrón",
        "5.4. Otras aplicaciones tecnológicas actuales"
      ]
    },
    {
      apartado: "6. Conclusiones",
      subapartados: []
    }
  ]
};

// N1 - Palabras clave parseadas
const N1_CONTENT = `1. Campo magnético

1.1. Concepto, unidad y representación del campo magnético

Campo vectorial B
Cómo se detecta B
Maxwell
Régimen estacionario

1.2. Líneas de campo, flujo magnético, ausencia de monopolos y comparación con el campo eléctrico

Líneas de campo
Líneas magnéticas
No existen Monopolos magnéticos clásicos
Ausencia de monopolos
Flujo magnético

2. Carácter no conservativo del campo magnético

2.1. Circulación del campo magnético

Campo conservativo
Potencial escalar global
Corriente enlazada
Circulación conecta geometría y fuente eléctrica.

2.2. Relación con la ley de Ampère

Ley de Ampère
Hilo rectilíneo
Corrientes estacionarias
Rotacional de B

2.3. Matiz entre campo no conservativo y trabajo de la fuerza magnética

Trabajo magnético
Fuerza magnética
Trabajo magnético
Campo magnético cambia
Región sin corriente

3. Generación de campos magnéticos

3.1. Generación por corrientes eléctricas: experiencia de Oersted

Corriente eléctrica con brújula
Electricidad y magnetismo
Corriente en conductor

3.2. Ley de Biot-Savart y campo de un conductor rectilíneo

Ley de Biot-Savart
Producto vectorial
Conductor rectilíneo
Regla de la mano derecha

3.3. Ley de Ampère: solenoide, espira y toroide

Ley de Ampère
Solenoide
Espira
Toroide
Electroimán y transformador

3.4. Imanes permanentes, materiales magnéticos y campos variables

Imán permanente
Ferromagnetismo
Diamagnetismo
Paramagnetismo
Término de Maxwell

4. Efectos sobre cargas en movimiento

4.1. Fuerza magnética sobre una carga eléctrica

Fuerza magnética
Regla de la mano derecha
Carga positiva y negativa

4.2. Fuerza de Lorentz

Fuerza de Lorentz
Influencia Campo eléctrico
Influencia Campo magnético
Campos combinados

4.3. Movimiento circular y helicoidal de partículas cargadas

Fuerza magnética = centrípeta
Energía cinética
Radio orbital
Velocidad angular
Componente paralela
Componente perpendicular
Trayectoria helicoidal
Plasmas

4.4. Fuerza magnética sobre corrientes eléctricas

Corriente eléctrica
Fuerza magnética
Aplicaciones

5. Aplicación a dispositivos tecnológicos

5.1. Selector de velocidades

E y B perpendiculares
Condición equilibrio
Velocidad seleccionada
Partículas que atraviesan

5.2. Espectrómetro de masas

Relación carga-masa
Trayectoria circular
Radio de curvatura
Isótopos

5.3. Ciclotrón

Partículas cargadas
Electrodos semicirculares
Frecuencia de resonancia
Energia final
Aplicacione
Limitación relativista

5.4. Otras aplicaciones tecnológicas actuales

Motores eléctricos
Sensores Hall
RMN
Electroimán`;

// N2 - Desarrollo esquemático
const N2_CONTENT = `1. Campo magnético

1.1. Concepto, unidad y representación del campo magnético

El campo magnético B es un campo vectorial asociado a imanes, corrientes y campos eléctricos variables.
Se detecta experimentalmente con brújulas, que indican dirección, y limaduras, que visualizan líneas de campo.
Su unidad en el SI es el tesla; también se usa el gauss. 1 T = 10⁴ G.
En el marco de Maxwell, electricidad y magnetismo forman una interacción electromagnética unificada.
En régimen estacionario puede estudiarse separado del campo eléctrico, aunque ambos campos están relacionados.

1.2. Líneas de campo, flujo magnético, ausencia de monopolos y comparación con el campo eléctrico

Las líneas de campo son tangentes a B y su densidad indica la intensidad magnética.
Las líneas magnéticas son cerradas, a diferencia de las líneas del campo eléctrico electrostático.
No existen monopolos magnéticos clásicos: todo imán presenta siempre polo norte y polo sur.
La ausencia de monopolos se expresa como ∇ · B = 0.
El flujo magnético neto por una superficie cerrada es nulo: ∮ B · dS = 0.

2. Carácter no conservativo del campo magnético

2.1. Circulación del campo magnético

Un campo conservativo tiene circulación nula en cualquier trayectoria cerrada.
En un campo conservativo puede definirse un potencial escalar global.
El campo magnético puede presentar circulación no nula si la trayectoria enlaza corriente.
La circulación conecta la geometría del campo magnético con sus fuentes eléctricas.

2.2. Relación con la ley de Ampère

La ley de Ampère relaciona circulación magnética y corriente enlazada.
Forma integral: ∮ B · dl = μ₀ I_enc.
Alrededor de un hilo rectilíneo con corriente, las líneas de B son circunferencias.
Para corrientes estacionarias, la forma local es ∇ × B = μ₀ J.
El rotacional de B está asociado a la densidad de corriente.

2.3. Matiz entre campo no conservativo y trabajo de la fuerza magnética

Campo no conservativo no significa que la fuerza magnética realice trabajo.
La fuerza magnética es perpendicular a la velocidad de la carga móvil.
El trabajo magnético es nulo y la energía cinética permanece constante.
El campo magnético cambia la dirección del movimiento, no el módulo de la velocidad.
En regiones sin corriente puede definirse localmente un potencial magnético escalar.

3. Generación de campos magnéticos

3.1. Generación por corrientes eléctricas: experiencia de Oersted

Oersted mostró que una corriente eléctrica desvía la aguja de una brújula.
La experiencia evidencia la relación entre electricidad y magnetismo.
Una corriente en un conductor genera un campo magnético alrededor del cable.
En el aula puede observarse con pila, conductor y brújula cercana.

3.2. Ley de Biot-Savart y campo de un conductor rectilíneo

La ley de Biot-Savart calcula B creado por un elemento de corriente.
Expresión: dB = μ₀ · I dl × uᵣ/4πr².
El producto vectorial fija dirección perpendicular al elemento de corriente y al vector posición.
Para un conductor rectilíneo indefinido: B = μ₀I / 2πR.
La regla de la mano derecha determina el sentido del campo circular.

3.3. Ley de Ampère: solenoide, espira y toroide

La ley de Ampère simplifica el cálculo de B en sistemas con alta simetría.
Un solenoide largo genera un campo interior casi uniforme y exterior casi nulo.
En un solenoide ideal: B = μ₀ n I.
Una espira circular actúa como dipolo magnético.
Un toroide concentra el campo magnético en su interior.
Electroimanes y transformadores se basan en bobinas recorridas por corriente.

3.4. Imanes permanentes, materiales magnéticos y campos variables

Los imanes permanentes producen campo magnético por organización microscópica de momentos magnéticos.
En ferromagnéticos, los dominios se orientan cooperativamente y generan magnetización macroscópica.
Los materiales diamagnéticos se oponen débilmente al campo aplicado.
Los materiales paramagnéticos se alinean débilmente con el campo externo.
El término de Maxwell permite que campos eléctricos variables generen campos magnéticos.
Esta corrección explica la propagación de ondas electromagnéticas.

4. Efectos sobre cargas en movimiento

4.1. Fuerza magnética sobre una carga eléctrica

Una carga solo experimenta fuerza magnética si está en movimiento  F = q v × B.
Módulo: F = qvB senθ.
La fuerza es nula si la velocidad es paralela al campo.
La fuerza es máxima si la velocidad es perpendicular al campo.
La regla de la mano derecha da el sentido para cargas positivas; en negativas se invierte.

4.2. Fuerza de Lorentz

La fuerza de Lorentz integra efectos eléctricos y magnéticos sobre una carga  F = q(E + v × B).
El campo eléctrico puede acelerar cargas incluso en reposo.
El campo magnético desvía cargas móviles sin modificar su energía cinética.
Campos combinados permiten seleccionar, desviar o acelerar partículas en dispositivos tecnológicos.

4.3. Movimiento circular y helicoidal de partículas cargadas

Si v es perpendicular a B, la fuerza magnética actúa como fuerza centrípeta.
El movimiento resultante es circular uniforme, con energía cinética constante.
Radio orbital: R = mv / |q|B.
Velocidad angular: ω = |q|B / m; periodo: T = 2πm / |q|B.
Si existe componente paralela, ésta permanece constante.
La combinación de giro y avance produce trayectoria helicoidal.
Este comportamiento aparece en plasmas, aceleradores y cinturones de radiación.

4.4. Fuerza magnética sobre corrientes eléctricas

Una corriente es un conjunto de cargas móviles en un conductor.
Sobre un elemento conductor actúa dF = I dl × B.
Para conductor rectilíneo en campo uniforme: F = ILB senθ.
Esta fuerza fundamenta motores eléctricos, altavoces, relés y actuadores electromagnéticos.

5. Aplicación a dispositivos tecnológicos

5.1. Selector de velocidades

Usa campos eléctrico y magnético perpendiculares entre sí.
La partícula no se desvía cuando se compensan fuerza eléctrica y magnética.
Condición de equilibrio: qE = qvB.
Velocidad seleccionada: v = E/B.
Solo partículas con esa velocidad atraviesan el dispositivo sin desviación.

5.2. Espectrómetro de masas

Separa partículas según su relación carga-masa.
Combina selector de velocidades y región con campo magnético perpendicular.
La fuerza magnética produce trayectorias circulares de distinto radio.
Relación característica: m = qBR / v.
Permite identificar isótopos, moléculas y muestras de interés químico o médico.

5.3. Ciclotrón

Acelerador circular de partículas cargadas mediante campo magnético y tensión alterna.
Las partículas giran dentro de electrodos semicirculares llamados "des".
La frecuencia de resonancia es f = qB / 2πm.
La energía final puede expresarse como Ec = (qBr)² / 2m.
Se usa para radioisótopos médicos, PET, investigación nuclear y terapia con partículas.
A velocidades altas aparecen limitaciones relativistas por pérdida de sincronización.

5.4. Otras aplicaciones tecnológicas actuales

Motores y generadores relacionan campos magnéticos, corrientes y transformación energética.
Sensores Hall miden campos magnéticos o corrientes mediante desviación de cargas.
La resonancia magnética nuclear aprovecha la interacción magnética de núcleos.
La levitación magnética reduce contacto mecánico en sistemas de transporte.
El confinamiento de plasmas usa campos magnéticos para controlar partículas cargadas.
Un electroimán escolar puede construirse con pila, cable y clavo de hierro.`;

// N3 - Redacción completa (resumida por brevedad)
const N3_CONTENT = `0. Introducción

El campo magnético constituye un contenido fundamental de Física y Química para comprender la interacción electromagnética, de acuerdo con el enunciado oficial del tema, centrado en el carácter no conservativo del campo magnético, la generación de campos magnéticos y los efectos sobre cargas en movimiento.

Su estudio permite interpretar el funcionamiento de motores eléctricos, espectrómetros de masas y equipos de resonancia magnética, así como aplicar modelos, leyes, procedimientos y evidencias para explicar fenómenos naturales, tecnológicos y sociales. Desde una perspectiva CTSA, este conocimiento ayuda a valorar el papel del electromagnetismo en la medicina, la industria, la producción energética, las comunicaciones, el transporte y el desarrollo de dispositivos de alta precisión.

Además, la investigación actual en materiales magnéticos, sensores Hall, aceleradores de partículas, confinamiento de plasmas y tecnologías de almacenamiento muestra la vigencia del tema para abordar retos relacionados con la salud, la energía, la caracterización de materiales y la innovación tecnológica. El magnetismo muestra que una carga en movimiento no solo transporta energía: también genera campos capaces de guiar, separar y acelerar partículas.

1. Campo magnético

1.1. Concepto, unidad y representación del campo magnético

El campo magnético, representado por B, es un campo vectorial que describe la influencia magnética en cada punto del espacio. Puede ser generado por imanes permanentes, corrientes eléctricas o campos eléctricos variables. Experimentalmente puede detectarse mediante una brújula, que se orienta según la dirección del campo, o mediante limaduras de hierro, que permiten visualizar la forma de sus líneas.

La unidad del campo magnético en el Sistema Internacional es el tesla, T. También se usa el gauss, especialmente en contextos experimentales o geofísicos, con la relación 1 T = 10⁴ G.

El campo magnético forma parte de la interacción electromagnética. En fenómenos estacionarios puede estudiarse separado del campo eléctrico, pero en el marco general de Maxwell ambos campos están relacionados: las corrientes y los campos eléctricos variables pueden generar campos magnéticos, y los campos magnéticos variables pueden inducir campos eléctricos.

1.2. Líneas de campo, flujo magnético, ausencia de monopolos y comparación con el campo eléctrico

Las líneas de campo magnético son tangentes al vector B en cada punto y su densidad representa la intensidad del campo. A diferencia del campo eléctrico electrostático, cuyas líneas pueden comenzar en cargas positivas y terminar en cargas negativas, las líneas del campo magnético son cerradas.

Esta propiedad expresa la ausencia de monopolos magnéticos aislados en el electromagnetismo clásico y se resume mediante ∇ · B = 0.

De forma equivalente, el flujo magnético neto a través de una superficie cerrada es nulo: ∮ B · dS = 0.

Por ello, no existen "cargas magnéticas" aisladas equivalentes a las cargas eléctricas. Un imán siempre presenta dos polos, norte y sur, y al dividirlo se obtienen nuevos imanes con ambos polos, no polos aislados. Esta diferencia es clave para distinguir la estructura del campo eléctrico y del campo magnético.

2. Carácter no conservativo del campo magnético

2.1. Circulación del campo magnético

Un campo vectorial es conservativo si su circulación a lo largo de cualquier trayectoria cerrada es cero. En ese caso puede definirse un potencial escalar global y el trabajo entre dos puntos no depende del camino seguido.

El campo magnético, en general, no es conservativo, porque su circulación alrededor de una curva cerrada puede ser distinta de cero cuando dicha curva enlaza una corriente eléctrica. Esta idea conecta directamente la geometría del campo magnético con sus fuentes.

2.2. Relación con la ley de Ampère

En magnetostática, la ley de Ampère establece que la circulación del campo magnético a lo largo de una curva cerrada es proporcional a la corriente neta enlazada por dicha curva: ∮ B · dl = μ₀ Ienc.

Por tanto, si existe corriente enlazada, la circulación de B no se anula. Por ejemplo, alrededor de un hilo rectilíneo por el que circula una corriente, las líneas de campo son circunferencias cerradas y la circulación sobre una trayectoria circular centrada en el hilo vale μ₀I.

En forma local, para corrientes estacionarias, la ley puede escribirse como: ∇ × B = μ₀ J, donde J es la densidad de corriente. Esta expresión indica que las corrientes eléctricas son fuente del rotacional del campo magnético.

2.3. Matiz entre campo no conservativo y trabajo de la fuerza magnética

Conviene precisar que el carácter no conservativo del campo magnético no significa que la fuerza magnética realice trabajo sobre una carga. La fuerza magnética sobre una partícula cargada móvil es siempre perpendicular a su velocidad, por lo que su trabajo instantáneo es nulo. Por ello, el campo magnético puede cambiar la dirección del movimiento, pero no el módulo de la velocidad ni la energía cinética.

Así, lo no conservativo se refiere a la circulación del campo B, no al trabajo de la fuerza magnética. Además, en regiones sin corriente y simplemente conexas, el rotacional de B puede ser nulo y puede introducirse un potencial magnético escalar local. Sin embargo, en presencia de corrientes o en regiones que las enlazan, el campo magnético no puede describirse globalmente como conservativo.

3. Generación de campos magnéticos

3.1. Generación por corrientes eléctricas: experiencia de Oersted

Históricamente, Oersted mostró que una corriente eléctrica desviaba la aguja de una brújula. Este experimento puso de manifiesto que electricidad y magnetismo no eran fenómenos independientes, sino manifestaciones relacionadas de una misma interacción. Una práctica sencilla de aula consiste en colocar una brújula cerca de un conductor conectado brevemente a una pila: al cerrar el circuito, la aguja se desvía, mostrando que la corriente genera un campo magnético.

3.2. Ley de Biot-Savart y campo de un conductor rectilíneo

La ley de Biot-Savart permite calcular el campo magnético creado por un elemento de corriente. Para un elemento diferencial dl recorrido por una intensidad I, el campo en un punto situado a distancia r viene dado por: dB = μ₀· I dl × uᵣ / 4π r².

Una aplicación importante es el campo creado por un conductor rectilíneo indefinido recorrido por una corriente I. Por simetría, las líneas de campo son circunferencias concéntricas alrededor del conductor, y el módulo del campo a una distancia R es: B = μ₀I / 2πR.

El sentido del campo se determina con la regla de la mano derecha: el pulgar indica el sentido de la corriente y los dedos el sentido de las líneas de campo.

3.3. Ley de Ampère: solenoide, espira y toroide

La ley de Ampère resulta especialmente útil en sistemas con alta simetría, como conductores rectilíneos, solenoides y toroides. Su aplicación permite calcular campos magnéticos sin integrar directamente la ley de Biot-Savart.

Un solenoide largo está formado por muchas espiras próximas recorridas por una corriente. En su interior el campo es aproximadamente uniforme y paralelo al eje, mientras que en el exterior es casi nulo. Si n es el número de espiras por unidad de longitud, el campo interior vale: B = μ₀ n I.

Una espira circular genera un campo magnético similar al de un pequeño dipolo magnético, intenso cerca de su centro. Un toroide, por su parte, concentra el campo en su interior, reduciendo mucho el campo externo. Estos sistemas son modelos básicos para comprender bobinas, transformadores, electroimanes y dispositivos de control industrial.

3.4. Imanes permanentes, materiales magnéticos y campos variables

Los imanes permanentes también generan campos magnéticos. A escala microscópica, su origen se relaciona con el momento magnético de los electrones y con la organización de dominios magnéticos. En materiales ferromagnéticos, como hierro, cobalto o níquel, muchos dominios pueden orientarse de forma cooperativa, produciendo un campo macroscópico apreciable.

También existen materiales diamagnéticos, débilmente repelidos por el campo, y paramagnéticos, débilmente atraídos. Esta clasificación permite conectar el magnetismo con materiales, sensores y aplicaciones industriales.

En una visión más completa del electromagnetismo, los campos eléctricos variables también generan campos magnéticos. Este término, introducido por Maxwell, completa la ley de Ampère y permite explicar la propagación de ondas electromagnéticas.

4. Efectos sobre cargas en movimiento

4.1. Fuerza magnética sobre una carga eléctrica

El efecto fundamental de un campo magnético sobre una carga eléctrica aparece solo si la carga está en movimiento. Una partícula de carga q que se mueve con velocidad v en un campo magnético B experimenta una fuerza F = q v × B. Su módulo es F = qvB sen θ.

La fuerza es perpendicular tanto a la velocidad como al campo magnético. Su sentido se determina mediante la regla de la mano derecha para cargas positivas y se invierte para cargas negativas. Si la velocidad es paralela al campo, la fuerza es nula; si es perpendicular, es máxima.

4.2. Fuerza de Lorentz

Cuando además existe un campo eléctrico E, la fuerza total sobre la carga viene dada por la fuerza de Lorentz: F = q(E + v × B).

Esta expresión permite combinar campos eléctricos y magnéticos para seleccionar, desviar o acelerar partículas. Es una de las ecuaciones centrales del tema, porque conecta el comportamiento microscópico de las cargas con el funcionamiento de numerosos dispositivos tecnológicos.

4.3. Movimiento circular y helicoidal de partículas cargadas

Si una partícula cargada entra en un campo magnético uniforme con velocidad perpendicular al campo, la fuerza magnética actúa como fuerza centrípeta. Como no cambia la energía cinética, la partícula describe un movimiento circular uniforme qvB = mv² / R, donde: R = mv / |q|B.

La velocidad angular es ω = |q|B / m y el periodo T = 2πm / |q|B.

Si la velocidad inicial no es perpendicular al campo, puede descomponerse en una componente paralela y otra perpendicular a B. La componente paralela permanece constante, mientras que la perpendicular origina el giro circular. La combinación de ambas produce una trayectoria helicoidal, frecuente en plasmas, aceleradores y cinturones de radiación terrestres.

4.4. Fuerza magnética sobre corrientes eléctricas

Una corriente eléctrica es un conjunto ordenado de cargas en movimiento. Por ello, un conductor recorrido por corriente también experimenta fuerza en presencia de un campo magnético. Sobre un elemento de conductor actúa dF = I dl × B.

Si el conductor es rectilíneo, de longitud L, y se encuentra en un campo uniforme F = ILB sen θ.

Esta interacción es la base del funcionamiento de motores eléctricos, altavoces, relés y actuadores electromagnéticos.

5. Aplicación a dispositivos tecnológicos

5.1. Selector de velocidades

El selector de velocidades utiliza campos eléctrico y magnético perpendiculares entre sí. Para que una partícula atraviese el dispositivo sin desviarse, la fuerza eléctrica y la magnética deben compensarse: qE = qvB.

Por tanto, v = E / B.

Solo las partículas con esa velocidad atraviesan el selector sin desviación.

5.2. Espectrómetro de masas

El espectrómetro de masas permite separar partículas según su relación carga-masa. Las partículas pasan primero por un selector de velocidades y después entran en una región con campo magnético perpendicular. Allí describen trayectorias circulares cuyo radio depende de su masa m = qBR / v.

Esto permite identificar isótopos, analizar moléculas y estudiar la composición de muestras en química, geología, medicina y ciencias ambientales.

5.3. Ciclotrón

El ciclotrón es un acelerador de partículas cargadas. Consta de dos electrodos semicirculares, llamados "des", situados en un campo magnético perpendicular. Las partículas giran por acción del campo magnético y se aceleran cada vez que cruzan el espacio entre las des gracias a una diferencia de potencial alterna.

La frecuencia de resonancia del ciclotrón es f = qB / 2πm y la energía cinética final puede expresarse como Ec = (qBr)² / 2m.

Este dispositivo se usa en investigación nuclear, producción de radioisótopos médicos, como los empleados en PET, y terapia con partículas. A velocidades muy altas aparecen limitaciones relativistas, porque la masa efectiva aumenta y se pierde la sincronización con la frecuencia de aceleración.

5.4. Otras aplicaciones tecnológicas actuales

Existen otras aplicaciones relevantes: motores eléctricos, generadores, altavoces, sensores Hall, trenes de levitación magnética, discos duros, resonancia magnética nuclear y sistemas de confinamiento de plasmas. Todas se fundamentan en la relación entre corrientes, campos magnéticos y fuerzas sobre cargas en movimiento.

Una experiencia sencilla adicional es construir un electroimán con una pila, un clavo de hierro y un hilo conductor enrollado. Al circular corriente, el clavo se imanta temporalmente, mostrando la generación de campo magnético por corrientes y su aplicación técnica.

Conclusiones

En conclusión, el estudio del campo magnético permite comprender la interacción electromagnética a partir de modelos vectoriales, leyes como las de Biot-Savart y Ampère, la fuerza de Lorentz, el flujo magnético y procedimientos de análisis basados en simetría y circulación. A lo largo del tema se ha mostrado cómo las corrientes eléctricas y los campos variables generan campos magnéticos, cómo su circulación no nula expresa su carácter no conservativo y cómo las cargas móviles experimentan fuerzas que permiten explicar dispositivos tecnológicos.

De este modo, se recupera la idea inicial: el magnetismo permite que las cargas en movimiento generen campos capaces de guiar, separar y acelerar partículas. El valor del tema no reside solo en su importancia teórica, sino también en su capacidad para interpretar situaciones reales vinculadas a la tecnología, la salud, la energía, la industria, los materiales y la vida cotidiana.

Por ello, este contenido contribuye a una comprensión científica más rigurosa de la realidad y favorece la toma de decisiones fundamentadas ante problemas actuales relacionados con dispositivos electromagnéticos, innovación médica, caracterización de materiales, transporte avanzado y tecnologías energéticas más eficientes.`;

async function load() {
  console.log("📚 Cargando TEMA-21 actualizado...\n");

  try {
    // Obtener TEMA-21
    const { data: tema } = await supabase
      .from("topics")
      .select("id")
      .eq("code", "TEMA-21")
      .single();

    if (!tema) {
      console.error("❌ TEMA-21 no encontrado");
      process.exit(1);
    }

    // Eliminar niveles anteriores
    console.log("Limpiando niveles anteriores...");
    await supabase
      .from("topic_levels")
      .delete()
      .eq("topic_id", tema.id);

    // Cargar N0
    await supabase.from("topic_levels").insert({
      topic_id: tema.id,
      level: 0,
      title: "Índice",
      content_json: N0_ESTRUCTURA
    });
    console.log("✅ N0 cargado");

    // Cargar N1
    await supabase.from("topic_levels").insert({
      topic_id: tema.id,
      level: 1,
      title: "Palabras clave",
      content_json: {
        tipo: "palabras_clave",
        texto: N1_CONTENT
      }
    });
    console.log("✅ N1 cargado");

    // Cargar N2
    await supabase.from("topic_levels").insert({
      topic_id: tema.id,
      level: 2,
      title: "Desarrollo esquemático",
      content_json: {
        tipo: "desarrollo_esquematico",
        texto: N2_CONTENT
      }
    });
    console.log("✅ N2 cargado");

    // Cargar N3
    await supabase.from("topic_levels").insert({
      topic_id: tema.id,
      level: 3,
      title: "Redacción completa",
      content_json: {
        tipo: "redaccion_completa",
        texto: N3_CONTENT
      }
    });
    console.log("✅ N3 cargado");

    console.log("\n✨ TEMA-21 actualizado completamente");
    console.log("\n📝 Próximos pasos:");
    console.log("  1. Verificar niveles en UI");
    console.log("  2. Verificar flashcards N2.5 y N3.5");
    console.log("  3. Deploy");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

load();

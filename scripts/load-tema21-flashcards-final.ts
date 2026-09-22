import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseServiceRole!);

// N2.5 Flashcards - Recuperación activa (86 tarjetas)
const N25_FLASHCARDS = [
  {
    id: 1,
    apartado: "1. Campo magnético",
    subapartado: "1.1. Concepto, unidad y representación del campo magnético",
    pregunta: "¿Qué tipo de magnitud es el campo magnético B?",
    respuesta: "Es un campo vectorial asociado a imanes, corrientes eléctricas y campos eléctricos variables.",
  },
  {
    id: 2,
    apartado: "1. Campo magnético",
    subapartado: "1.1. Concepto, unidad y representación del campo magnético",
    pregunta: "¿Qué instrumentos permiten detectar o visualizar el campo magnético?",
    respuesta: "La brújula indica su dirección y las limaduras de hierro visualizan sus líneas.",
  },
  {
    id: 3,
    apartado: "1. Campo magnético",
    subapartado: "1.1. Concepto, unidad y representación del campo magnético",
    pregunta: "¿Cuál es la unidad SI del campo magnético?",
    respuesta: "El tesla; también se usa el gauss, con 1 T = 10⁴ G.",
  },
  {
    id: 4,
    apartado: "1. Campo magnético",
    subapartado: "1.1. Concepto, unidad y representación del campo magnético",
    pregunta: "¿Qué unifica el marco de Maxwell?",
    respuesta: "Unifica electricidad y magnetismo dentro de la interacción electromagnética.",
  },
  {
    id: 5,
    apartado: "1. Campo magnético",
    subapartado: "1.1. Concepto, unidad y representación del campo magnético",
    pregunta: "¿Cómo puede estudiarse el campo magnético en régimen estacionario?",
    respuesta: "Puede estudiarse separado del campo eléctrico, aunque ambos campos están relacionados.",
  },
  {
    id: 6,
    apartado: "1. Campo magnético",
    subapartado: "1.2. Líneas de campo, flujo magnético, ausencia de monopolos y comparación con el campo eléctrico",
    pregunta: "¿Qué indican las líneas de campo magnético?",
    respuesta: "Son tangentes a B y su densidad indica la intensidad magnética.",
  },
  {
    id: 7,
    apartado: "1. Campo magnético",
    subapartado: "1.2. Líneas de campo, flujo magnético, ausencia de monopolos y comparación con el campo eléctrico",
    pregunta: "¿Qué diferencia básica hay entre líneas magnéticas y electrostáticas?",
    respuesta: "Las líneas magnéticas son cerradas; las electrostáticas pueden comenzar o terminar en cargas.",
  },
  {
    id: 8,
    apartado: "1. Campo magnético",
    subapartado: "1.2. Líneas de campo, flujo magnético, ausencia de monopolos y comparación con el campo eléctrico",
    pregunta: "¿Qué ocurre con los monopolos magnéticos en electromagnetismo clásico?",
    respuesta: "No existen monopolos magnéticos clásicos; todo imán presenta polo norte y sur.",
  },
  {
    id: 9,
    apartado: "1. Campo magnético",
    subapartado: "1.2. Líneas de campo, flujo magnético, ausencia de monopolos y comparación con el campo eléctrico",
    pregunta: "¿Cómo se expresa la ausencia de monopolos magnéticos?",
    respuesta: "Mediante la ecuación ∇ · B = 0.",
  },
  {
    id: 10,
    apartado: "1. Campo magnético",
    subapartado: "1.2. Líneas de campo, flujo magnético, ausencia de monopolos y comparación con el campo eléctrico",
    pregunta: "¿Cuánto vale el flujo magnético neto por una superficie cerrada?",
    respuesta: "Es nulo: ∮ B · dS = 0.",
  },
  {
    id: 11,
    apartado: "2. Carácter no conservativo del campo magnético",
    subapartado: "2.1. Circulación del campo magnético",
    pregunta: "¿Qué caracteriza a un campo conservativo?",
    respuesta: "Tiene circulación nula en cualquier trayectoria cerrada.",
  },
  {
    id: 12,
    apartado: "2. Carácter no conservativo del campo magnético",
    subapartado: "2.1. Circulación del campo magnético",
    pregunta: "¿Qué puede definirse en un campo conservativo?",
    respuesta: "Un potencial escalar global.",
  },
  {
    id: 13,
    apartado: "2. Carácter no conservativo del campo magnético",
    subapartado: "2.1. Circulación del campo magnético",
    pregunta: "¿Cuándo puede ser no nula la circulación del campo magnético?",
    respuesta: "Cuando la trayectoria cerrada enlaza una corriente eléctrica.",
  },
  {
    id: 14,
    apartado: "2. Carácter no conservativo del campo magnético",
    subapartado: "2.1. Circulación del campo magnético",
    pregunta: "¿Qué conecta la circulación del campo magnético?",
    respuesta: "Conecta la geometría del campo magnético con sus fuentes eléctricas.",
  },
  {
    id: 15,
    apartado: "2. Carácter no conservativo del campo magnético",
    subapartado: "2.2. Relación con la ley de Ampère",
    pregunta: "¿Qué relaciona la ley de Ampère en magnetostática?",
    respuesta: "Relaciona la circulación magnética con la corriente enlazada.",
  },
  {
    id: 16,
    apartado: "2. Carácter no conservativo del campo magnético",
    subapartado: "2.2. Relación con la ley de Ampère",
    pregunta: "¿Cuál es la forma integral de la ley de Ampère?",
    respuesta: "∮ B · dl = μ₀ I_enc.",
  },
  {
    id: 17,
    apartado: "2. Carácter no conservativo del campo magnético",
    subapartado: "2.2. Relación con la ley de Ampère",
    pregunta: "¿Cómo son las líneas de B alrededor de un hilo rectilíneo con corriente?",
    respuesta: "Son circunferencias centradas en el hilo.",
  },
  {
    id: 18,
    apartado: "2. Carácter no conservativo del campo magnético",
    subapartado: "2.2. Relación con la ley de Ampère",
    pregunta: "¿Cuál es la forma local de Ampère para corrientes estacionarias?",
    respuesta: "∇ × B = μ₀ J.",
  },
  {
    id: 19,
    apartado: "2. Carácter no conservativo del campo magnético",
    subapartado: "2.2. Relación con la ley de Ampère",
    pregunta: "¿A qué se asocia el rotacional de B?",
    respuesta: "A la densidad de corriente.",
  },
  {
    id: 20,
    apartado: "2. Carácter no conservativo del campo magnético",
    subapartado: "2.3. Matiz entre campo no conservativo y trabajo de la fuerza magnética",
    pregunta: "¿Campo no conservativo implica trabajo magnético no nulo?",
    respuesta: "No; campo no conservativo no significa que la fuerza magnética realice trabajo.",
  },
  {
    id: 21,
    apartado: "2. Carácter no conservativo del campo magnético",
    subapartado: "2.3. Matiz entre campo no conservativo y trabajo de la fuerza magnética",
    pregunta: "¿Qué orientación tiene la fuerza magnética respecto a la velocidad?",
    respuesta: "Es perpendicular a la velocidad de la carga móvil.",
  },
  {
    id: 22,
    apartado: "2. Carácter no conservativo del campo magnético",
    subapartado: "2.3. Matiz entre campo no conservativo y trabajo de la fuerza magnética",
    pregunta: "¿Qué ocurre con el trabajo magnético y la energía cinética?",
    respuesta: "El trabajo magnético es nulo y la energía cinética permanece constante.",
  },
  {
    id: 23,
    apartado: "2. Carácter no conservativo del campo magnético",
    subapartado: "2.3. Matiz entre campo no conservativo y trabajo de la fuerza magnética",
    pregunta: "¿Qué cambia el campo magnético en el movimiento de una carga?",
    respuesta: "Cambia la dirección del movimiento, no el módulo de la velocidad.",
  },
  {
    id: 24,
    apartado: "2. Carácter no conservativo del campo magnético",
    subapartado: "2.3. Matiz entre campo no conservativo y trabajo de la fuerza magnética",
    pregunta: "¿Dónde puede definirse localmente un potencial magnético escalar?",
    respuesta: "En regiones sin corriente.",
  },
  {
    id: 25,
    apartado: "3. Generación de campos magnéticos",
    subapartado: "3.1. Generación por corrientes eléctricas: experiencia de Oersted",
    pregunta: "¿Qué mostró Oersted con su experiencia?",
    respuesta: "Que una corriente eléctrica desvía la aguja de una brújula.",
  },
  {
    id: 26,
    apartado: "3. Generación de campos magnéticos",
    subapartado: "3.1. Generación por corrientes eléctricas: experiencia de Oersted",
    pregunta: "¿Qué relación evidenció la experiencia de Oersted?",
    respuesta: "Evidenció la relación entre electricidad y magnetismo.",
  },
  {
    id: 27,
    apartado: "3. Generación de campos magnéticos",
    subapartado: "3.1. Generación por corrientes eléctricas: experiencia de Oersted",
    pregunta: "¿Qué genera una corriente en un conductor?",
    respuesta: "Genera un campo magnético alrededor del cable.",
  },
  {
    id: 28,
    apartado: "3. Generación de campos magnéticos",
    subapartado: "3.1. Generación por corrientes eléctricas: experiencia de Oersted",
    pregunta: "¿Cómo puede observarse en aula el efecto de Oersted?",
    respuesta: "Con una pila, un conductor y una brújula cercana.",
  },
  {
    id: 29,
    apartado: "3. Generación de campos magnéticos",
    subapartado: "3.2. Ley de Biot-Savart y campo de un conductor rectilíneo",
    pregunta: "¿Qué calcula la ley de Biot-Savart?",
    respuesta: "Calcula el campo magnético creado por un elemento de corriente.",
  },
  {
    id: 30,
    apartado: "3. Generación de campos magnéticos",
    subapartado: "3.2. Ley de Biot-Savart y campo de un conductor rectilíneo",
    pregunta: "¿Cuál es la expresión diferencial de Biot-Savart?",
    respuesta: "dB = μ₀/4π · I dl × uᵣ / r².",
  },
  {
    id: 31,
    apartado: "3. Generación de campos magnéticos",
    subapartado: "3.2. Ley de Biot-Savart y campo de un conductor rectilíneo",
    pregunta: "¿Qué fija el producto vectorial en Biot-Savart?",
    respuesta: "Fija la dirección perpendicular al elemento de corriente y al vector posición.",
  },
  {
    id: 32,
    apartado: "3. Generación de campos magnéticos",
    subapartado: "3.2. Ley de Biot-Savart y campo de un conductor rectilíneo",
    pregunta: "¿Cuál es el campo de un conductor rectilíneo indefinido?",
    respuesta: "B = μ₀I / 2πR.",
  },
  {
    id: 33,
    apartado: "3. Generación de campos magnéticos",
    subapartado: "3.2. Ley de Biot-Savart y campo de un conductor rectilíneo",
    pregunta: "¿Qué determina la regla de la mano derecha en un conductor rectilíneo?",
    respuesta: "Determina el sentido del campo magnético circular.",
  },
  {
    id: 34,
    apartado: "3. Generación de campos magnéticos",
    subapartado: "3.3. Ley de Ampère: solenoide, espira y toroide",
    pregunta: "¿Cuándo simplifica el cálculo la ley de Ampère?",
    respuesta: "En sistemas con alta simetría.",
  },
  {
    id: 35,
    apartado: "3. Generación de campos magnéticos",
    subapartado: "3.3. Ley de Ampère: solenoide, espira y toroide",
    pregunta: "¿Qué campo genera un solenoide largo?",
    respuesta: "Un campo interior casi uniforme y exterior casi nulo.",
  },
  {
    id: 36,
    apartado: "3. Generación de campos magnéticos",
    subapartado: "3.3. Ley de Ampère: solenoide, espira y toroide",
    pregunta: "¿Cuál es el campo de un solenoide ideal?",
    respuesta: "B = μ₀ n I.",
  },
  {
    id: 37,
    apartado: "3. Generación de campos magnéticos",
    subapartado: "3.3. Ley de Ampère: solenoide, espira y toroide",
    pregunta: "¿Cómo se comporta una espira circular?",
    respuesta: "Actúa como un dipolo magnético.",
  },
  {
    id: 38,
    apartado: "3. Generación de campos magnéticos",
    subapartado: "3.3. Ley de Ampère: solenoide, espira y toroide",
    pregunta: "¿Dónde concentra el campo magnético un toroide?",
    respuesta: "Lo concentra en su interior.",
  },
  {
    id: 39,
    apartado: "3. Generación de campos magnéticos",
    subapartado: "3.3. Ley de Ampère: solenoide, espira y toroide",
    pregunta: "¿En qué se basan electroimanes y transformadores?",
    respuesta: "En bobinas recorridas por corriente.",
  },
  {
    id: 40,
    apartado: "3. Generación de campos magnéticos",
    subapartado: "3.4. Imanes permanentes, materiales magnéticos y campos variables",
    pregunta: "¿Por qué producen campo los imanes permanentes?",
    respuesta: "Por la organización microscópica de momentos magnéticos.",
  },
  {
    id: 41,
    apartado: "3. Generación de campos magnéticos",
    subapartado: "3.4. Imanes permanentes, materiales magnéticos y campos variables",
    pregunta: "¿Qué ocurre en los materiales ferromagnéticos?",
    respuesta: "Los dominios se orientan cooperativamente y generan magnetización macroscópica.",
  },
  {
    id: 42,
    apartado: "3. Generación de campos magnéticos",
    subapartado: "3.4. Imanes permanentes, materiales magnéticos y campos variables",
    pregunta: "¿Cómo responden los materiales diamagnéticos al campo aplicado?",
    respuesta: "Se oponen débilmente al campo aplicado.",
  },
  {
    id: 43,
    apartado: "3. Generación de campos magnéticos",
    subapartado: "3.4. Imanes permanentes, materiales magnéticos y campos variables",
    pregunta: "¿Cómo responden los materiales paramagnéticos al campo externo?",
    respuesta: "Se alinean débilmente con el campo externo.",
  },
  {
    id: 44,
    apartado: "3. Generación de campos magnéticos",
    subapartado: "3.4. Imanes permanentes, materiales magnéticos y campos variables",
    pregunta: "¿Qué permite el término de Maxwell?",
    respuesta: "Permite que campos eléctricos variables generen campos magnéticos.",
  },
  {
    id: 45,
    apartado: "3. Generación de campos magnéticos",
    subapartado: "3.4. Imanes permanentes, materiales magnéticos y campos variables",
    pregunta: "¿Qué explica la corrección de Maxwell?",
    respuesta: "Explica la propagación de ondas electromagnéticas.",
  },
  {
    id: 46,
    apartado: "4. Efectos sobre cargas en movimiento",
    subapartado: "4.1. Fuerza magnética sobre una carga eléctrica",
    pregunta: "¿Cuándo experimenta fuerza magnética una carga?",
    respuesta: "Cuando está en movimiento dentro de un campo magnético.",
  },
  {
    id: 47,
    apartado: "4. Efectos sobre cargas en movimiento",
    subapartado: "4.1. Fuerza magnética sobre una carga eléctrica",
    pregunta: "¿Cuál es la expresión vectorial de la fuerza magnética?",
    respuesta: "F = q v × B.",
  },
  {
    id: 48,
    apartado: "4. Efectos sobre cargas en movimiento",
    subapartado: "4.1. Fuerza magnética sobre una carga eléctrica",
    pregunta: "¿Cuál es el módulo de la fuerza magnética?",
    respuesta: "F = qvB senθ.",
  },
  {
    id: 49,
    apartado: "4. Efectos sobre cargas en movimiento",
    subapartado: "4.1. Fuerza magnética sobre una carga eléctrica",
    pregunta: "¿Cuándo es nula la fuerza magnética?",
    respuesta: "Cuando la velocidad es paralela al campo magnético.",
  },
  {
    id: 50,
    apartado: "4. Efectos sobre cargas en movimiento",
    subapartado: "4.1. Fuerza magnética sobre una carga eléctrica",
    pregunta: "¿Cuándo es máxima la fuerza magnética?",
    respuesta: "Cuando la velocidad es perpendicular al campo magnético.",
  },
  {
    id: 51,
    apartado: "4. Efectos sobre cargas en movimiento",
    subapartado: "4.1. Fuerza magnética sobre una carga eléctrica",
    pregunta: "¿Cómo afecta el signo de la carga al sentido de la fuerza?",
    respuesta: "La mano derecha da el sentido para positivas; en negativas se invierte.",
  },
  {
    id: 52,
    apartado: "4. Efectos sobre cargas en movimiento",
    subapartado: "4.2. Fuerza de Lorentz",
    pregunta: "¿Qué integra la fuerza de Lorentz?",
    respuesta: "Integra efectos eléctricos y magnéticos sobre una carga.",
  },
  {
    id: 53,
    apartado: "4. Efectos sobre cargas en movimiento",
    subapartado: "4.2. Fuerza de Lorentz",
    pregunta: "¿Cuál es la expresión de la fuerza de Lorentz?",
    respuesta: "F = q(E + v × B).",
  },
  {
    id: 54,
    apartado: "4. Efectos sobre cargas en movimiento",
    subapartado: "4.2. Fuerza de Lorentz",
    pregunta: "¿Qué puede hacer el campo eléctrico sobre cargas?",
    respuesta: "Puede acelerar cargas incluso en reposo.",
  },
  {
    id: 55,
    apartado: "4. Efectos sobre cargas en movimiento",
    subapartado: "4.2. Fuerza de Lorentz",
    pregunta: "¿Qué hace el campo magnético sobre cargas móviles?",
    respuesta: "Desvía cargas móviles sin modificar su energía cinética.",
  },
  {
    id: 56,
    apartado: "4. Efectos sobre cargas en movimiento",
    subapartado: "4.2. Fuerza de Lorentz",
    pregunta: "¿Qué permiten los campos eléctricos y magnéticos combinados?",
    respuesta: "Permiten seleccionar, desviar o acelerar partículas en dispositivos tecnológicos.",
  },
  {
    id: 57,
    apartado: "4. Efectos sobre cargas en movimiento",
    subapartado: "4.3. Movimiento circular y helicoidal de partículas cargadas",
    pregunta: "¿Qué función cumple la fuerza magnética si v es perpendicular a B?",
    respuesta: "Actúa como fuerza centrípeta.",
  },
  {
    id: 58,
    apartado: "4. Efectos sobre cargas en movimiento",
    subapartado: "4.3. Movimiento circular y helicoidal de partículas cargadas",
    pregunta: "¿Qué movimiento resulta si v es perpendicular a B?",
    respuesta: "Movimiento circular uniforme con energía cinética constante.",
  },
  {
    id: 59,
    apartado: "4. Efectos sobre cargas en movimiento",
    subapartado: "4.3. Movimiento circular y helicoidal de partículas cargadas",
    pregunta: "¿Cuál es el radio orbital de una carga en B uniforme?",
    respuesta: "R = mv / |q|B.",
  },
  {
    id: 60,
    apartado: "4. Efectos sobre cargas en movimiento",
    subapartado: "4.3. Movimiento circular y helicoidal de partículas cargadas",
    pregunta: "¿Cuáles son la velocidad angular y el periodo del giro?",
    respuesta: "ω = |q|B / m; T = 2πm / |q|B.",
  },
  {
    id: 61,
    apartado: "4. Efectos sobre cargas en movimiento",
    subapartado: "4.3. Movimiento circular y helicoidal de partículas cargadas",
    pregunta: "¿Qué ocurre si existe componente paralela de la velocidad?",
    respuesta: "La componente paralela permanece constante.",
  },
  {
    id: 62,
    apartado: "4. Efectos sobre cargas en movimiento",
    subapartado: "4.3. Movimiento circular y helicoidal de partículas cargadas",
    pregunta: "¿Qué produce la combinación de giro y avance?",
    respuesta: "Produce una trayectoria helicoidal.",
  },
  {
    id: 63,
    apartado: "4. Efectos sobre cargas en movimiento",
    subapartado: "4.3. Movimiento circular y helicoidal de partículas cargadas",
    pregunta: "¿Dónde aparece el movimiento helicoidal de cargas?",
    respuesta: "En plasmas, aceleradores y cinturones de radiación.",
  },
  {
    id: 64,
    apartado: "4. Efectos sobre cargas en movimiento",
    subapartado: "4.4. Fuerza magnética sobre corrientes eléctricas",
    pregunta: "¿Qué es una corriente eléctrica en este contexto?",
    respuesta: "Un conjunto de cargas móviles en un conductor.",
  },
  {
    id: 65,
    apartado: "4. Efectos sobre cargas en movimiento",
    subapartado: "4.4. Fuerza magnética sobre corrientes eléctricas",
    pregunta: "¿Qué fuerza actúa sobre un elemento conductor con corriente?",
    respuesta: "dF = I dl × B.",
  },
  {
    id: 66,
    apartado: "4. Efectos sobre cargas en movimiento",
    subapartado: "4.4. Fuerza magnética sobre corrientes eléctricas",
    pregunta: "¿Cuál es la fuerza sobre un conductor rectilíneo en campo uniforme?",
    respuesta: "F = ILB senθ.",
  },
  {
    id: 67,
    apartado: "4. Efectos sobre cargas en movimiento",
    subapartado: "4.4. Fuerza magnética sobre corrientes eléctricas",
    pregunta: "¿Qué dispositivos se basan en la fuerza sobre corrientes?",
    respuesta: "Motores eléctricos, altavoces, relés y actuadores electromagnéticos.",
  },
  {
    id: 68,
    apartado: "5. Aplicación a dispositivos tecnológicos",
    subapartado: "5.1. Selector de velocidades",
    pregunta: "¿Qué campos utiliza un selector de velocidades?",
    respuesta: "Campos eléctrico y magnético perpendiculares entre sí.",
  },
  {
    id: 69,
    apartado: "5. Aplicación a dispositivos tecnológicos",
    subapartado: "5.1. Selector de velocidades",
    pregunta: "¿Cuándo una partícula no se desvía en un selector?",
    respuesta: "Cuando se compensan la fuerza eléctrica y la fuerza magnética.",
  },
  {
    id: 70,
    apartado: "5. Aplicación a dispositivos tecnológicos",
    subapartado: "5.1. Selector de velocidades",
    pregunta: "¿Cuál es la condición de equilibrio del selector?",
    respuesta: "qE = qvB.",
  },
  {
    id: 71,
    apartado: "5. Aplicación a dispositivos tecnológicos",
    subapartado: "5.1. Selector de velocidades",
    pregunta: "¿Cuál es la velocidad seleccionada?",
    respuesta: "v = E/B.",
  },
  {
    id: 72,
    apartado: "5. Aplicación a dispositivos tecnológicos",
    subapartado: "5.1. Selector de velocidades",
    pregunta: "¿Qué partículas atraviesan el selector sin desviación?",
    respuesta: "Solo las partículas con velocidad v = E/B.",
  },
  {
    id: 73,
    apartado: "5. Aplicación a dispositivos tecnológicos",
    subapartado: "5.2. Espectrómetro de masas",
    pregunta: "¿Según qué magnitud separa partículas un espectrómetro de masas?",
    respuesta: "Según su relación carga-masa.",
  },
  {
    id: 74,
    apartado: "5. Aplicación a dispositivos tecnológicos",
    subapartado: "5.2. Espectrómetro de masas",
    pregunta: "¿Qué combina un espectrómetro de masas?",
    respuesta: "Combina selector de velocidades y una región con campo magnético perpendicular.",
  },
  {
    id: 75,
    apartado: "5. Aplicación a dispositivos tecnológicos",
    subapartado: "5.2. Espectrómetro de masas",
    pregunta: "¿Qué trayectoria produce el campo magnético en el espectrómetro?",
    respuesta: "Trayectorias circulares de distinto radio.",
  },
  {
    id: 76,
    apartado: "5. Aplicación a dispositivos tecnológicos",
    subapartado: "5.2. Espectrómetro de masas",
    pregunta: "¿Qué relación permite obtener la masa en el espectrómetro?",
    respuesta: "m = qBR / v.",
  },
  {
    id: 77,
    apartado: "5. Aplicación a dispositivos tecnológicos",
    subapartado: "5.2. Espectrómetro de masas",
    pregunta: "¿Qué permite identificar el espectrómetro de masas?",
    respuesta: "Isótopos, moléculas y muestras de interés químico o médico.",
  },
  {
    id: 78,
    apartado: "5. Aplicación a dispositivos tecnológicos",
    subapartado: "5.3. Ciclotrón",
    pregunta: "¿Qué es un ciclotrón?",
    respuesta: "Un acelerador circular de partículas cargadas mediante campo magnético y tensión alterna.",
  },
  {
    id: 79,
    apartado: "5. Aplicación a dispositivos tecnológicos",
    subapartado: "5.3. Ciclotrón",
    pregunta: "¿Dónde giran las partículas en un ciclotrón?",
    respuesta: "Dentro de electrodos semicirculares llamados des.",
  },
  {
    id: 80,
    apartado: "5. Aplicación a dispositivos tecnológicos",
    subapartado: "5.3. Ciclotrón",
    pregunta: "¿Cuál es la frecuencia de resonancia del ciclotrón?",
    respuesta: "f = qB / 2πm.",
  },
  {
    id: 81,
    apartado: "5. Aplicación a dispositivos tecnológicos",
    subapartado: "5.3. Ciclotrón",
    pregunta: "¿Cómo puede expresarse la energía final en un ciclotrón?",
    respuesta: "E_c = (qBr)² / 2m.",
  },
  {
    id: 82,
    apartado: "5. Aplicación a dispositivos tecnológicos",
    subapartado: "5.3. Ciclotrón",
    pregunta: "¿Para qué se utiliza el ciclotrón?",
    respuesta: "Para radioisótopos médicos, PET, investigación nuclear y terapia con partículas.",
  },
  {
    id: 83,
    apartado: "5. Aplicación a dispositivos tecnológicos",
    subapartado: "5.3. Ciclotrón",
    pregunta: "¿Qué limitación aparece a velocidades altas en el ciclotrón?",
    respuesta: "Limitaciones relativistas por pérdida de sincronización.",
  },
  {
    id: 84,
    apartado: "5. Aplicación a dispositivos tecnológicos",
    subapartado: "5.4. Otras aplicaciones tecnológicas actuales",
    pregunta: "¿Qué relación tecnológica tienen motores y generadores?",
    respuesta: "Relacionan campos magnéticos, corrientes y transformación energética.",
  },
  {
    id: 85,
    apartado: "5. Aplicación a dispositivos tecnológicos",
    subapartado: "5.4. Otras aplicaciones tecnológicas actuales",
    pregunta: "¿Qué miden los sensores Hall?",
    respuesta: "Miden campos magnéticos o corrientes mediante desviación de cargas.",
  },
  {
    id: 86,
    apartado: "5. Aplicación a dispositivos tecnológicos",
    subapartado: "5.4. Otras aplicaciones tecnológicas actuales",
    pregunta: "¿Qué técnica médica aprovecha la interacción magnética de núcleos?",
    respuesta: "La resonancia magnética nuclear.",
  },
];

// N3.5 Flashcards - Reconstrucción científica (27 tarjetas)
const N35_FLASHCARDS = [
  {
    id: 1,
    apartado: "1. Campo magnético",
    subapartado: "1.1. Concepto, unidad y representación del campo magnético",
    pregunta: "Explica por qué el campo magnético debe tratarse como una magnitud vectorial.",
    respuesta: "Porque sus efectos dependen no solo de la intensidad, sino también de la dirección y el sentido. Esto permite explicar la orientación de brújulas, la forma de las líneas de campo y la fuerza sobre cargas móviles, que cambia según la geometría entre velocidad y campo.",
  },
  {
    id: 2,
    apartado: "1. Campo magnético",
    subapartado: "1.1. Concepto, unidad y representación del campo magnético",
    pregunta: "Analiza la utilidad experimental de la brújula y las limaduras de hierro.",
    respuesta: "La brújula permite detectar la dirección local del campo magnético, mientras que las limaduras muestran de forma visual la distribución espacial de sus líneas. Como resultado, ambos recursos conectan un concepto abstracto con evidencias observables y ayudan a interpretar la geometría del campo.",
  },
  {
    id: 3,
    apartado: "1. Campo magnético",
    subapartado: "1.2. Líneas de campo, flujo magnético, ausencia de monopolos y comparación con el campo eléctrico",
    pregunta: "Compara las líneas del campo magnético con las del campo eléctrico electrostático.",
    respuesta: "Las líneas del campo eléctrico electrostático pueden comenzar y terminar en cargas, porque existen cargas positivas y negativas aisladas. En cambio, las líneas magnéticas son cerradas, porque no se observan monopolos magnéticos clásicos. Por lo tanto, la representación geométrica refleja diferencias físicas profundas entre ambos campos.",
  },
  {
    id: 4,
    apartado: "1. Campo magnético",
    subapartado: "1.2. Líneas de campo, flujo magnético, ausencia de monopolos y comparación con el campo eléctrico",
    pregunta: "Justifica por qué el flujo magnético neto por una superficie cerrada es nulo.",
    respuesta: "Porque las líneas de campo magnético son cerradas y no nacen ni mueren en fuentes puntuales aisladas. Toda línea que entra en una superficie cerrada también sale de ella. Como resultado, el balance neto de flujo magnético es cero, coherente con la ausencia de monopolos.",
  },
  {
    id: 5,
    apartado: "2. Carácter no conservativo del campo magnético",
    subapartado: "2.1. Circulación del campo magnético",
    pregunta: "Explica por qué la circulación permite estudiar el carácter no conservativo del campo magnético.",
    respuesta: "La circulación mide el comportamiento del campo a lo largo de una trayectoria cerrada. Si esta circulación no es nula, el campo no puede describirse mediante un potencial escalar global. En magnetismo, esto ocurre cuando la trayectoria enlaza corriente, por lo tanto conecta geometría y fuentes eléctricas.",
  },
  {
    id: 6,
    apartado: "2. Carácter no conservativo del campo magnético",
    subapartado: "2.2. Relación con la ley de Ampère",
    pregunta: "Justifica por qué la ley de Ampère evidencia el carácter no conservativo del campo magnético.",
    respuesta: "Porque establece que la circulación de B alrededor de una curva cerrada es proporcional a la corriente enlazada. Si existe corriente neta, la circulación no se anula. Como resultado, el campo magnético no se comporta como un campo conservativo global en presencia de corrientes.",
  },
  {
    id: 7,
    apartado: "2. Carácter no conservativo del campo magnético",
    subapartado: "2.2. Relación con la ley de Ampère",
    pregunta: "Analiza la relación entre un hilo rectilíneo con corriente y las circunferencias de campo magnético.",
    respuesta: "La corriente en el hilo actúa como fuente del rotacional del campo magnético. Por simetría, el campo tiene el mismo módulo a igual distancia del hilo y su dirección es tangente a circunferencias concéntricas. Esto permite aplicar Ampère de forma sencilla y obtener una circulación no nula.",
  },
  {
    id: 8,
    apartado: "2. Carácter no conservativo del campo magnético",
    subapartado: "2.3. Matiz entre campo no conservativo y trabajo de la fuerza magnética",
    pregunta: "Compara el carácter no conservativo de B con el trabajo realizado por la fuerza magnética.",
    respuesta: "El carácter no conservativo se refiere a la circulación del campo B, no al trabajo mecánico sobre una carga. La fuerza magnética es perpendicular a la velocidad, por lo que no cambia la energía cinética. Por lo tanto, puede haber circulación no nula sin trabajo magnético.",
  },
  {
    id: 9,
    apartado: "3. Generación de campos magnéticos",
    subapartado: "3.1. Generación por corrientes eléctricas: experiencia de Oersted",
    pregunta: "Explica por qué la experiencia de Oersted fue clave para unificar electricidad y magnetismo.",
    respuesta: "Porque mostró que una corriente eléctrica podía desviar una brújula, evidenciando que el movimiento de cargas genera efectos magnéticos. Esto rompió la separación entre fenómenos eléctricos y magnéticos, y abrió el camino hacia una teoría electromagnética unificada basada en corrientes y campos.",
  },
  {
    id: 10,
    apartado: "3. Generación de campos magnéticos",
    subapartado: "3.2. Ley de Biot-Savart y campo de un conductor rectilíneo",
    pregunta: "Analiza cómo la ley de Biot-Savart conecta corriente, geometría y campo magnético.",
    respuesta: "La ley de Biot-Savart relaciona cada elemento de corriente con el campo que produce en un punto. La dirección depende del producto vectorial, por lo que la geometría entre corriente y posición es decisiva. Como resultado, permite obtener campos circulares en conductores rectilíneos.",
  },
  {
    id: 11,
    apartado: "3. Generación de campos magnéticos",
    subapartado: "3.2. Ley de Biot-Savart y campo de un conductor rectilíneo",
    pregunta: "Justifica por qué el campo de un conductor rectilíneo disminuye con la distancia.",
    respuesta: "Porque la influencia magnética de la corriente se distribuye en circunferencias de radio creciente alrededor del conductor. Al aumentar la distancia, el mismo efecto se reparte sobre trayectorias mayores. Por ello, el módulo del campo decrece de forma inversamente proporcional a la distancia.",
  },
  {
    id: 12,
    apartado: "3. Generación de campos magnéticos",
    subapartado: "3.3. Ley de Ampère: solenoide, espira y toroide",
    pregunta: "Compara el campo magnético de un solenoide largo y el de un toroide.",
    respuesta: "En un solenoide largo, el campo es casi uniforme en el interior y casi nulo fuera, salvo efectos de borde. En un toroide, el campo queda más confinado en el interior del núcleo. Como resultado, ambos usan corrientes enrolladas, pero el toroide reduce mejor el campo externo.",
  },
  {
    id: 13,
    apartado: "3. Generación de campos magnéticos",
    subapartado: "3.3. Ley de Ampère: solenoide, espira y toroide",
    pregunta: "Explica por qué las bobinas son esenciales en electroimanes y transformadores.",
    respuesta: "Porque una corriente enrollada multiplica el efecto magnético de cada espira y concentra el campo en una región. Esto permite generar campos intensos y controlables. Como resultado, las bobinas son la base de electroimanes, transformadores y numerosos dispositivos de control industrial.",
  },
  {
    id: 14,
    apartado: "3. Generación de campos magnéticos",
    subapartado: "3.4. Imanes permanentes, materiales magnéticos y campos variables",
    pregunta: "Explica por qué los materiales ferromagnéticos producen campos macroscópicos apreciables.",
    respuesta: "Porque sus dominios magnéticos pueden orientarse cooperativamente, sumando muchos momentos magnéticos microscópicos en una dirección preferente. Esta alineación genera magnetización macroscópica. Como resultado, materiales como hierro, cobalto o níquel pueden comportarse como imanes permanentes o núcleos de electroimanes.",
  },
  {
    id: 15,
    apartado: "3. Generación de campos magnéticos",
    subapartado: "3.4. Imanes permanentes, materiales magnéticos y campos variables",
    pregunta: "Justifica la importancia del término de Maxwell en la generación de campos magnéticos.",
    respuesta: "Porque permite que un campo eléctrico variable actúe como fuente de campo magnético, incluso sin corriente conductora. Esta corrección completa la ley de Ampère y hace coherente la teoría electromagnética. Como consecuencia, permite explicar la propagación de ondas electromagnéticas.",
  },
  {
    id: 16,
    apartado: "4. Efectos sobre cargas en movimiento",
    subapartado: "4.1. Fuerza magnética sobre una carga eléctrica",
    pregunta: "Analiza por qué una carga en reposo no experimenta fuerza magnética.",
    respuesta: "La fuerza magnética depende del producto vectorial entre velocidad y campo magnético. Si la carga está en reposo, su velocidad es nula y el producto también lo es. Por lo tanto, el campo magnético solo actúa dinámicamente sobre cargas en movimiento.",
  },
  {
    id: 17,
    apartado: "4. Efectos sobre cargas en movimiento",
    subapartado: "4.1. Fuerza magnética sobre una carga eléctrica",
    pregunta: "Deduce qué ocurre si la velocidad de una carga es paralela al campo magnético.",
    respuesta: "Si la velocidad es paralela al campo, el ángulo entre ambos es cero y el seno vale cero. Por ello, la fuerza magnética se anula. Como resultado, la partícula no se desvía por acción magnética en esa dirección.",
  },
  {
    id: 18,
    apartado: "4. Efectos sobre cargas en movimiento",
    subapartado: "4.2. Fuerza de Lorentz",
    pregunta: "Compara el efecto del campo eléctrico y del campo magnético sobre una carga.",
    respuesta: "El campo eléctrico puede acelerar una carga incluso si está en reposo, cambiando su energía cinética. El campo magnético solo actúa sobre cargas móviles y desvía su trayectoria sin realizar trabajo. Por lo tanto, ambos campos tienen efectos complementarios en la fuerza de Lorentz.",
  },
  {
    id: 19,
    apartado: "4. Efectos sobre cargas en movimiento",
    subapartado: "4.3. Movimiento circular y helicoidal de partículas cargadas",
    pregunta: "Justifica por qué una carga describe movimiento circular si entra perpendicularmente en B.",
    respuesta: "Porque la fuerza magnética es perpendicular a la velocidad y apunta hacia el centro de la trayectoria. Actúa como fuerza centrípeta sin cambiar la energía cinética. Como resultado, la partícula mantiene rapidez constante, pero cambia continuamente de dirección.",
  },
  {
    id: 20,
    apartado: "4. Efectos sobre cargas en movimiento",
    subapartado: "4.3. Movimiento circular y helicoidal de partículas cargadas",
    pregunta: "Explica cómo se forma una trayectoria helicoidal en un campo magnético uniforme.",
    respuesta: "La velocidad se descompone en una componente perpendicular y otra paralela al campo. La componente perpendicular produce giro circular, mientras la paralela permanece constante y provoca avance. Como resultado, la trayectoria combina rotación y desplazamiento longitudinal, formando una hélice.",
  },
  {
    id: 21,
    apartado: "4. Efectos sobre cargas en movimiento",
    subapartado: "4.4. Fuerza magnética sobre corrientes eléctricas",
    pregunta: "Analiza por qué un conductor con corriente experimenta fuerza magnética.",
    respuesta: "Porque la corriente está formada por cargas móviles dentro del conductor. Cada carga experimenta fuerza magnética y la suma de esas fuerzas se transmite al conductor. Como resultado, un cable con corriente puede moverse en un campo magnético externo.",
  },
  {
    id: 22,
    apartado: "5. Aplicación a dispositivos tecnológicos",
    subapartado: "5.1. Selector de velocidades",
    pregunta: "Justifica cómo un selector de velocidades permite filtrar partículas.",
    respuesta: "El dispositivo combina campos eléctrico y magnético perpendiculares. Solo las partículas cuya velocidad cumple la condición de equilibrio tienen fuerza neta nula y atraviesan sin desviarse. Las demás se desvían, por lo tanto el aparato actúa como filtro cinemático.",
  },
  {
    id: 23,
    apartado: "5. Aplicación a dispositivos tecnológicos",
    subapartado: "5.2. Espectrómetro de masas",
    pregunta: "Explica cómo el espectrómetro de masas separa partículas de distinta masa.",
    respuesta: "Tras seleccionar una velocidad, las partículas entran en un campo magnético perpendicular y describen trayectorias circulares. El radio depende de la relación carga-masa. Como resultado, partículas con distinta masa impactan en posiciones diferentes, permitiendo identificar isótopos o moléculas.",
  },
  {
    id: 24,
    apartado: "5. Aplicación a dispositivos tecnológicos",
    subapartado: "5.3. Ciclotrón",
    pregunta: "Analiza por qué el ciclotrón necesita sincronizar el campo eléctrico alterno.",
    respuesta: "Las partículas giran por acción del campo magnético y cruzan repetidamente el espacio entre las des. Para acelerar en cada cruce, el campo eléctrico debe cambiar de signo en el momento adecuado. Por ello, la frecuencia de resonancia garantiza una ganancia acumulada de energía.",
  },
  {
    id: 25,
    apartado: "5. Aplicación a dispositivos tecnológicos",
    subapartado: "5.3. Ciclotrón",
    pregunta: "Deduce por qué aparecen limitaciones relativistas en el ciclotrón.",
    respuesta: "A velocidades muy altas, los efectos relativistas modifican la relación entre masa, velocidad y frecuencia de giro. Como resultado, la partícula deja de sincronizarse con el campo eléctrico alterno. Esto limita la aceleración eficiente en ciclotrones clásicos.",
  },
  {
    id: 26,
    apartado: "5. Aplicación a dispositivos tecnológicos",
    subapartado: "5.4. Otras aplicaciones tecnológicas actuales",
    pregunta: "Analiza la relación común entre motores, generadores y sensores Hall.",
    respuesta: "Los tres dispositivos explotan la interacción entre corrientes, cargas móviles y campos magnéticos. En motores aparece fuerza sobre corrientes; en generadores se transforma movimiento en electricidad; en sensores Hall se detecta desviación de cargas. Como resultado, conectan magnetismo con tecnología cotidiana.",
  },
  {
    id: 27,
    apartado: "5. Aplicación a dispositivos tecnológicos",
    subapartado: "5.4. Otras aplicaciones tecnológicas actuales",
    pregunta: "Explica por qué el magnetismo tiene relevancia sanitaria y tecnológica actual.",
    respuesta: "Porque permite diagnosticar mediante resonancia magnética, producir radioisótopos médicos, controlar partículas en aceleradores y desarrollar sensores o sistemas de almacenamiento. Por lo tanto, no es solo un contenido teórico, sino una base para tecnologías sanitarias, industriales y energéticas.",
  },
];

async function loadFlashcards() {
  console.log("🚀 Cargando flashcards TEMA-21 (N2.5 y N3.5)...\n");

  try {
    const { data: tema } = await supabase
      .from("topics")
      .select("id")
      .eq("code", "TEMA-21")
      .single();

    if (!tema) {
      console.log("❌ TEMA-21 no encontrado");
      process.exit(1);
    }

    // Cargar N2.5 en topic_levels
    const n25Content = {
      tipo: "recuperacion_activa",
      flashcards: N25_FLASHCARDS,
    };

    const { error: errorN25 } = await supabase
      .from("topic_levels")
      .upsert(
        {
          topic_id: tema.id,
          level: 2.5,
          title: "Recuperación activa",
          content_json: n25Content,
        },
        { onConflict: "topic_id,level" }
      );

    if (errorN25) {
      console.error("❌ Error cargando N2.5:", errorN25.message);
      process.exit(1);
    }

    console.log(`✅ N2.5: ${N25_FLASHCARDS.length} flashcards cargadas`);

    // Cargar N3.5 en topic_levels
    const n35Content = {
      tipo: "reconstruccion_cientifica",
      flashcards: N35_FLASHCARDS,
    };

    const { error: errorN35 } = await supabase
      .from("topic_levels")
      .upsert(
        {
          topic_id: tema.id,
          level: 3.5,
          title: "Reconstrucción científica",
          content_json: n35Content,
        },
        { onConflict: "topic_id,level" }
      );

    if (errorN35) {
      console.error("❌ Error cargando N3.5:", errorN35.message);
      process.exit(1);
    }

    console.log(`✅ N3.5: ${N35_FLASHCARDS.length} flashcards cargadas`);

    console.log("\n✅ Carga completada:");
    console.log(`   - N2.5: 86 flashcards (recuperación activa)`);
    console.log(`   - N3.5: 27 flashcards (reconstrucción científica)`);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

loadFlashcards();

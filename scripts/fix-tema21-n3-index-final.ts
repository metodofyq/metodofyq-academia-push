import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseServiceRole!);

const INDICE_COMPLETO = `# Índice

0. Introducción
1. Campo magnético
1.1. Concepto, unidad y representación del campo magnético
1.2. Líneas de campo, flujo magnético, ausencia de monopolos y comparación con el campo eléctrico
2. Carácter no conservativo del campo magnético
2.1. Circulación del campo magnético
2.2. Relación con la ley de Ampère
2.3. Matiz entre campo no conservativo y trabajo de la fuerza magnética
3. Generación de campos magnéticos
3.1. Generación por corrientes eléctricas: experiencia de Oersted
3.2. Ley de Biot-Savart y campo de un conductor rectilíneo
3.3. Ley de Ampère: solenoide, espira y toroide
3.4. Imanes permanentes, materiales magnéticos y campos variables
4. Efectos sobre cargas en movimiento
4.1. Fuerza magnética sobre una carga eléctrica
4.2. Fuerza de Lorentz
4.3. Movimiento circular y helicoidal de partículas cargadas
4.4. Fuerza magnética sobre corrientes eléctricas
5. Aplicación a dispositivos tecnológicos
5.1. Selector de velocidades
5.2. Espectrómetro de masas
5.3. Ciclotrón
5.4. Otras aplicaciones tecnológicas actuales
6. Conclusiones

---

`;

const BIBLIOGRAFIA = `

## Bibliografía

- Landau, L. D., & Lifshitz, E. M. (1988). *Teoría clásica de campos*. Reverté.
- Griffiths, D. J. (2013). *Introduction to Electrodynamics* (4ª ed.). Pearson.
- Jackson, J. D. (1998). *Classical Electrodynamics* (3ª ed.). Wiley.
- Purcell, E. M., & Morin, D. J. (2013). *Electricity and Magnetism* (3ª ed.). Cambridge University Press.
- Tipler, P. A., & Mosca, G. (2012). *Física para la Ciencia y la Tecnología* (6ª ed.). Reverté.
`;

async function fixN3IndexFinal() {
  console.log("🔧 Actualizando N3 con índice completo y bibliografía...\n");

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

    const { data: n3Level } = await supabase
      .from("topic_levels")
      .select("content_json")
      .eq("topic_id", tema.id)
      .eq("level", 3)
      .single();

    if (!n3Level) {
      console.log("❌ Nivel 3 no encontrado");
      process.exit(1);
    }

    const content = n3Level.content_json as Record<string, any>;
    let texto = content.texto || "";

    // Remover el índice antiguo si existe
    texto = texto.replace(/^# Índice\n\n[\s\S]*?---\n\n/, "");

    // Prepender el nuevo índice
    const textoActualizado = INDICE_COMPLETO + texto;

    // Agregar bibliografía al final si no existe
    let textoFinal = textoActualizado;
    if (!textoFinal.includes("Bibliografía")) {
      // Remover conclusiones antiguas y agregar nuevas con número
      textoFinal = textoFinal.replace(
        /^\s*(?:6\.\s+)?Conclusiones\n/m,
        "6. Conclusiones\n"
      );
      // Agregar bibliografía al final
      if (!textoFinal.endsWith("\n")) textoFinal += "\n";
      textoFinal += BIBLIOGRAFIA;
    }

    // Actualizar fantasy text también
    const fantasma = INDICE_COMPLETO + textoFinal;

    const updatedContent = {
      ...content,
      texto: textoFinal,
      "texto-fantasma": fantasma,
    };

    const { error } = await supabase
      .from("topic_levels")
      .update({ content_json: updatedContent })
      .eq("topic_id", tema.id)
      .eq("level", 3);

    if (error) {
      console.error("❌ Error:", error.message);
      process.exit(1);
    }

    console.log("✅ N3 actualizado:");
    console.log(`   - Índice completo preprendido`);
    console.log(`   - Número "6." añadido a Conclusiones`);
    console.log(`   - Bibliografía añadida al final`);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

// Helper para extraer solo texto sin formato
function text(t: string): string {
  return t.replace(/[*_`#]/g, "");
}

fixN3IndexFinal();

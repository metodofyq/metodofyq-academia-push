#!/usr/bin/env tsx
/**
 * Script para corregir Nivel 1 - Extraer palabras clave correctamente por subapartado
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl!, supabaseServiceRole!);

async function fixNivel1() {
  console.log("🔧 Corrigiendo Nivel 1 - Palabras clave por subapartado...\n");

  // Palabras clave organizadas por subapartado (extraído del texto original)
  const keywords: Record<string, string> = {
    "1.1. La naturaleza del conocimiento científico": "Conocimiento científico, Objetividad científica, Evidencia empírica, Leyes y modelos, Teorías científicas",
    "1.2. Principales modelos epistemológicos": "Inductivismo, Problema de la inducción, Método hipotético-deductivo, Falsacionismo, Paradigmas científicos, Programas de investigación, Progreso epistemológico",
    "1.3. La visión actual de la ciencia": "Nature of Science, Pluralidad metodológica, Modelos científicos, Consenso científico, Revisabilidad del consenso, Interdisciplinariedad, Ciencia abierta",

    "2.1. Concepto y características de las revoluciones científicas": "Revolución científica, Reorganización conceptual, Ciencia normal, Anomalías científicas, Transformación epistemológica",
    "2.2. El cambio de paradigma y el progreso científico": "Paradigma científico, Cambio de paradigma, Progreso científico, Visión acumulativa, Discontinuidad científica, Cambio revolucionario",
    "2.3. Principales revoluciones científicas en Física y Química": "Revolución copernicana, Tycho Brahe, Leyes de Kepler, Galileo Galilei, Síntesis newtoniana, Relatividad, Mecánica cuántica, Revolución química, Química cuantitativa, Transformación científica",

    "3.1. El carácter dinámico y provisional del conocimiento científico": "Provisionalidad, Revisión científica, Innovación instrumental, Autocorrección científica, Incertidumbre, Progreso experimental",
    "3.2. El papel de la experimentación y la revisión del conocimiento": "Proceso de investigación, Mediación observacional, Control de variables, Reproducibilidad, Revisión por pares, Falibilidad científica, Retroalimentación científica",
    "3.3. Un ejemplo de construcción del conocimiento: modelo atómico": "Modelo de Dalton, Modelo de Thomson, Insuficiencia de Dalton, Experimento de Rutherford, Núcleo atómico, Vacío atómico, Modelo de Bohr, Modelo mecánico-cuántico, Revisión de modelos, Capacidad explicativa",

    "4.1. Influencia del contexto histórico, cultural y económico": "Contexto histórico, Factores culturales, Recursos científicos, Financiación científica, Desigualdad científica, Grandes infraestructuras, Interdependencia ciencia-sociedad",
    "4.2. Relaciones entre ciencia, sociedad y desarrollo científico": "Ciencia y sociedad, Impacto científico, Demandas sociales, Instituciones científicas, Transferencia del conocimiento, Divulgación científica, Políticas científicas",
    "4.3. Ética y responsabilidad en la actividad científica": "Ética científica, Deontología científica, Integridad científica, Responsabilidad científica, Gobernanza científica, Regulación científica, Principio de precaución, Riesgos científico-tecnológicos",

    "5.1. El pensamiento crítico y la valoración de las evidencias": "Pensamiento crítico, Argumentación científica, Consenso experto, Escepticismo científico, Fiabilidad de fuentes, Correlación y causalidad, Variables de confusión, Pseudociencias y desinformación, Evaluación crítica",
    "5.2. Actitudes propias del trabajo científico": "Curiosidad científica, Rigor metodológico, Objetividad, Creatividad científica, Colaboración científica, Apertura a la revisión, Revisión de conclusiones",
    "5.3. La alfabetización científica y la toma de decisiones": "Alfabetización científica, Decisiones basadas en evidencias, Cultura científica, Cuestiones sociocientíficas, Gestión del riesgo, Incertidumbre de evidencias, Participación ciudadana, Ciudadanía responsable",
  };

  try {
    const { data: topic } = await supabase
      .from("topics")
      .select("id")
      .eq("code", "TEMA-01")
      .single();

    if (!topic) throw new Error("TEMA-01 no encontrado");

    const topicId = topic.id;

    // Actualizar Nivel 1 con keywords correctas
    const { error } = await supabase
      .from("topic_levels")
      .update({ content_json: { keywords } })
      .eq("topic_id", topicId)
      .eq("level", 1);

    if (error) throw error;

    console.log("✅ Nivel 1 actualizado con palabras clave correctas\n");
    console.log(`📊 Total de subapartados: ${Object.keys(keywords).length}`);

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

fixNivel1();

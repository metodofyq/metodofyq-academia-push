-- Crear tabla para Propuesta Didáctica
-- Similar a topic_level4_legislacion pero para el nuevo nivel
CREATE TABLE IF NOT EXISTS topic_propuesta_didactica (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  lectura TEXT NOT NULL,
  actividad TEXT NOT NULL,
  dinamica VARCHAR(50) DEFAULT 'dictado-corrector',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(topic_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_propuesta_didactica_topic ON topic_propuesta_didactica(topic_id);

-- Trigger para actualizar updated_at
CREATE TRIGGER topic_propuesta_didactica_updated_at
  BEFORE UPDATE ON topic_propuesta_didactica
  FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();

-- RLS: Permitir lectura a todos (es contenido público del curso)
ALTER TABLE topic_propuesta_didactica ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read all" ON topic_propuesta_didactica;
CREATE POLICY "Allow read all" ON topic_propuesta_didactica
  FOR SELECT USING (true);

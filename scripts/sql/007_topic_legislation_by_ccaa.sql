-- Crear tabla para legislación por CCAA (Grupo 2)
CREATE TABLE IF NOT EXISTS topic_legislation_by_ccaa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  ccaa VARCHAR(100) NOT NULL,
  titulo VARCHAR(255),
  contenido TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(topic_id, ccaa)
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_legislation_topic ON topic_legislation_by_ccaa(topic_id);
CREATE INDEX IF NOT EXISTS idx_legislation_ccaa ON topic_legislation_by_ccaa(ccaa);
CREATE INDEX IF NOT EXISTS idx_legislation_topic_ccaa ON topic_legislation_by_ccaa(topic_id, ccaa);

-- RLS: Permitir lectura a todos (es contenido público del curso)
ALTER TABLE topic_legislation_by_ccaa ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read all" ON topic_legislation_by_ccaa
  FOR SELECT USING (true);

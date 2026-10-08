-- Migration: Create study_sessions table
-- Purpose: Track how much time each student dedicates to each topic
-- Date: 2026-10-08

CREATE TABLE study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for efficient queries
CREATE INDEX idx_study_sessions_student
ON study_sessions(student_id);

CREATE INDEX idx_study_sessions_topic
ON study_sessions(topic_id);

CREATE INDEX idx_study_sessions_student_topic
ON study_sessions(student_id, topic_id);

CREATE INDEX idx_study_sessions_started_at
ON study_sessions(started_at);

CREATE INDEX idx_study_sessions_student_started
ON study_sessions(student_id, started_at DESC);

-- Table comment
COMMENT ON TABLE study_sessions IS
'Tracks study sessions - when a student starts and ends studying a topic';

COMMENT ON COLUMN study_sessions.duration_minutes IS
'Calculated field: (ended_at - started_at) / 60 in seconds';

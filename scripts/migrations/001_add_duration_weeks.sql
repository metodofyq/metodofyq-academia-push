-- Migration: Add duration_weeks to study_plan_topics
-- Purpose: Allow configuring how many weeks a topic should be studied (1, 2, or 3)
-- Date: 2026-10-08

ALTER TABLE study_plan_topics
ADD COLUMN duration_weeks INTEGER DEFAULT 1
CHECK (duration_weeks IN (1, 2, 3));

COMMENT ON COLUMN study_plan_topics.duration_weeks IS
'Number of weeks to study this topic. Valid values: 1, 2, 3. Causes the weekly task sequence to repeat.';

CREATE INDEX idx_study_plan_topics_duration
ON study_plan_topics(study_plan_id, duration_weeks);

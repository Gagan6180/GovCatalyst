-- ================================================================
-- GovCatalyst — Expert Evaluation Layer Migration
-- Extends the existing evaluation_criteria + evaluation_scores tables
-- with an assignment queue, panel decisions, and override trail.
-- ================================================================

-- ── Extend evaluation_criteria with more metadata ───────────────
-- Add description and max_score if they don't exist
ALTER TABLE evaluation_criteria
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS max_score   NUMERIC(5,2) NOT NULL DEFAULT 10,
  ADD COLUMN IF NOT EXISTS category    VARCHAR(64)  NOT NULL DEFAULT 'Technical',
  ADD COLUMN IF NOT EXISTS is_active   BOOLEAN      NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS sort_order  SMALLINT     NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now();

-- ── Seed default criteria for every challenge ────────────────────
-- (Will be inserted per-challenge via the API, but this documents the template)

-- ── evaluation_assignments (who evaluates what, when) ────────────
CREATE TABLE IF NOT EXISTS evaluation_assignments (
  id               UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id   UUID         NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  evaluator_id     UUID         NOT NULL REFERENCES users(id),
  assigned_by      UUID         NOT NULL REFERENCES users(id),
  status           VARCHAR(32)  NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending','in_progress','submitted','withdrawn')),
  due_date         DATE,
  conflict_of_interest BOOLEAN  NOT NULL DEFAULT false,
  coi_reason       TEXT,
  assigned_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
  submitted_at     TIMESTAMPTZ,
  UNIQUE (application_id, evaluator_id)
);

-- ── Extend evaluation_scores with qualitative fields ────────────
ALTER TABLE evaluation_scores
  ADD COLUMN IF NOT EXISTS justification   TEXT,
  ADD COLUMN IF NOT EXISTS assignment_id   UUID REFERENCES evaluation_assignments(id);

-- ── evaluation_panel_decisions (aggregate across all evaluators) ─
CREATE TABLE IF NOT EXISTS evaluation_panel_decisions (
  id                   UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id       UUID         NOT NULL UNIQUE REFERENCES applications(id) ON DELETE CASCADE,
  evaluator_count      SMALLINT     NOT NULL DEFAULT 0,
  avg_weighted_score   NUMERIC(6,2) NOT NULL DEFAULT 0,
  panel_recommendation VARCHAR(32)  NOT NULL DEFAULT 'PENDING'
                         CHECK (panel_recommendation IN ('APPROVE','REJECT','CONDITIONAL','PENDING')),
  panel_summary        TEXT,
  finalized_at         TIMESTAMPTZ,
  finalized_by         UUID         REFERENCES users(id),
  -- Override fields
  is_overridden        BOOLEAN      NOT NULL DEFAULT false,
  override_decision    VARCHAR(32)
                         CHECK (override_decision IN ('APPROVE','REJECT','CONDITIONAL') OR override_decision IS NULL),
  override_reason      TEXT,
  override_by          UUID         REFERENCES users(id),
  override_at          TIMESTAMPTZ,
  created_at           TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- ── evaluation_appeals (startup can appeal a rejection) ──────────
CREATE TABLE IF NOT EXISTS evaluation_appeals (
  id               UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id   UUID         NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  startup_id       UUID         NOT NULL REFERENCES startups(id),
  appeal_reason    TEXT         NOT NULL,
  supporting_docs  TEXT,                      -- comma-separated URLs or filenames
  status           VARCHAR(32)  NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending','under_review','accepted','rejected')),
  reviewed_by      UUID         REFERENCES users(id),
  review_notes     TEXT,
  submitted_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
  reviewed_at      TIMESTAMPTZ,
  UNIQUE (application_id)                     -- one appeal per application
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_eval_assign_app   ON evaluation_assignments(application_id);
CREATE INDEX IF NOT EXISTS idx_eval_assign_eval  ON evaluation_assignments(evaluator_id);
CREATE INDEX IF NOT EXISTS idx_eval_assign_status ON evaluation_assignments(status);
CREATE INDEX IF NOT EXISTS idx_eval_scores_app   ON evaluation_scores(application_id);
CREATE INDEX IF NOT EXISTS idx_eval_scores_eval  ON evaluation_scores(evaluator_id);
CREATE INDEX IF NOT EXISTS idx_eval_panel_app    ON evaluation_panel_decisions(application_id);
CREATE INDEX IF NOT EXISTS idx_eval_appeals_app  ON evaluation_appeals(application_id);

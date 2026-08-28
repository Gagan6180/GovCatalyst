-- ================================================================
-- GovCatalyst — Independent Validation Layer Migration
-- Covers: validator assignments, milestone verification,
--         KPI evidence review, validation reports, and
--         final clearance with a "ready for scale/procurement" flag.
-- ================================================================

-- ── validator_assignments (who validates which pilot) ────────────
CREATE TABLE IF NOT EXISTS validator_assignments (
  id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  pilot_id      UUID         NOT NULL REFERENCES gov_pilots(id) ON DELETE CASCADE,
  validator_id  UUID         NOT NULL REFERENCES users(id),
  assigned_by   UUID         NOT NULL REFERENCES users(id),
  scope         TEXT,                     -- what specifically this validator should review
  status        VARCHAR(32)  NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','active','completed','withdrawn')),
  due_date      DATE,
  assigned_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
  completed_at  TIMESTAMPTZ,
  UNIQUE (pilot_id, validator_id)
);

-- ── milestone_verifications (validator signs off each milestone) ─
CREATE TABLE IF NOT EXISTS milestone_verifications (
  id                    UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id         UUID         NOT NULL REFERENCES validator_assignments(id) ON DELETE CASCADE,
  pilot_id              UUID         NOT NULL REFERENCES gov_pilots(id) ON DELETE CASCADE,
  validator_id          UUID         NOT NULL REFERENCES users(id),
  milestone_ref         VARCHAR(128) NOT NULL,   -- free-text milestone name / reference
  claimed_kpi_actual    TEXT,
  verified_kpi_actual   TEXT,
  evidence_ids          JSONB        NOT NULL DEFAULT '[]',  -- array of gov_pilot_evidences.id
  verification_status   VARCHAR(32)  NOT NULL DEFAULT 'pending'
                          CHECK (verification_status IN ('pending','verified','partially_verified','failed')),
  notes                 TEXT,
  verified_at           TIMESTAMPTZ,
  created_at            TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- ── kpi_validations (validator attests each KPI result) ──────────
CREATE TABLE IF NOT EXISTS kpi_validations (
  id                  UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id       UUID          NOT NULL REFERENCES validator_assignments(id) ON DELETE CASCADE,
  pilot_id            UUID          NOT NULL REFERENCES gov_pilots(id) ON DELETE CASCADE,
  kpi_id              UUID          NOT NULL REFERENCES gov_pilot_kpis(id) ON DELETE CASCADE,
  validator_id        UUID          NOT NULL REFERENCES users(id),
  claimed_value       NUMERIC(12,2) NOT NULL,
  verified_value      NUMERIC(12,2),
  discrepancy_pct     NUMERIC(8,2),          -- |claimed - verified| / claimed * 100
  data_sources        TEXT,                  -- evidence / source URLs reviewed
  verdict             VARCHAR(32)   NOT NULL DEFAULT 'pending'
                        CHECK (verdict IN ('pending','confirmed','adjusted','disputed')),
  notes               TEXT,
  validated_at        TIMESTAMPTZ,
  created_at          TIMESTAMPTZ   NOT NULL DEFAULT now(),
  UNIQUE (assignment_id, kpi_id)
);

-- ── validation_reports (final signed-off report per assignment) ──
CREATE TABLE IF NOT EXISTS validation_reports (
  id                       UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id            UUID         NOT NULL UNIQUE REFERENCES validator_assignments(id) ON DELETE CASCADE,
  pilot_id                 UUID         NOT NULL REFERENCES gov_pilots(id) ON DELETE CASCADE,
  validator_id             UUID         NOT NULL REFERENCES users(id),
  overall_verdict          VARCHAR(32)  NOT NULL DEFAULT 'pending'
                             CHECK (overall_verdict IN ('pending','PASS','CONDITIONAL_PASS','FAIL')),
  -- Dimension scores (0-100)
  kpi_achievement_score    NUMERIC(5,2) NOT NULL DEFAULT 0,
  data_integrity_score     NUMERIC(5,2) NOT NULL DEFAULT 0,
  process_compliance_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  stakeholder_feedback_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  composite_score          NUMERIC(5,2) NOT NULL DEFAULT 0,
  -- Narrative
  executive_summary        TEXT,
  key_findings             TEXT,
  deviations_noted         TEXT,
  recommendations          TEXT,
  -- Clearance
  ready_for_procurement    BOOLEAN      NOT NULL DEFAULT false,
  ready_for_scale          BOOLEAN      NOT NULL DEFAULT false,
  clearance_conditions     TEXT,
  -- Signature / submission
  submitted_at             TIMESTAMPTZ,
  created_at               TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at               TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- ── validation_objections (dept_admin can raise an objection) ────
CREATE TABLE IF NOT EXISTS validation_objections (
  id                UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id         UUID         NOT NULL REFERENCES validation_reports(id) ON DELETE CASCADE,
  pilot_id          UUID         NOT NULL REFERENCES gov_pilots(id) ON DELETE CASCADE,
  raised_by         UUID         NOT NULL REFERENCES users(id),
  reason            TEXT         NOT NULL,
  status            VARCHAR(32)  NOT NULL DEFAULT 'open'
                      CHECK (status IN ('open','addressed','dismissed')),
  validator_response TEXT,
  created_at        TIMESTAMPTZ  NOT NULL DEFAULT now(),
  resolved_at       TIMESTAMPTZ
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_val_assign_pilot     ON validator_assignments(pilot_id);
CREATE INDEX IF NOT EXISTS idx_val_assign_validator ON validator_assignments(validator_id);
CREATE INDEX IF NOT EXISTS idx_milestone_verif_pilot ON milestone_verifications(pilot_id);
CREATE INDEX IF NOT EXISTS idx_kpi_valid_pilot       ON kpi_validations(pilot_id);
CREATE INDEX IF NOT EXISTS idx_kpi_valid_kpi         ON kpi_validations(kpi_id);
CREATE INDEX IF NOT EXISTS idx_val_reports_pilot     ON validation_reports(pilot_id);
CREATE INDEX IF NOT EXISTS idx_val_objections_report ON validation_objections(report_id);

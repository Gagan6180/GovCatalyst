-- ================================================================
-- GovCatalyst — Pilot Telemetry & Alert Engine Migration
-- Adds telemetry readings with data source provenance (Manual, CSV,
-- REST API, IoT sensors, Govt systems) and real-time threshold alerts.
-- ================================================================

-- ── gov_kpi_telemetry_readings ──────────────────────────────────
CREATE TABLE IF NOT EXISTS gov_kpi_telemetry_readings (
  id                   UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  pilot_id             UUID          NOT NULL REFERENCES gov_pilots(id) ON DELETE CASCADE,
  kpi_id               UUID          NOT NULL REFERENCES gov_pilot_kpis(id) ON DELETE CASCADE,
  value                NUMERIC(14,2) NOT NULL,
  source_type          VARCHAR(32)   NOT NULL DEFAULT 'MANUAL'
                         CHECK (source_type IN ('MANUAL','CSV_UPLOAD','REST_API','IOT_SENSOR','GOVT_ERP')),
  source_reference     VARCHAR(255)  NOT NULL DEFAULT 'System Input', -- e.g. Device ID, Sensor UUID, Upload filename, API Client
  provenance_metadata  JSONB         NOT NULL DEFAULT '{}',           -- e.g. { "raw_unit": "INR", "device_type": "GPS_Tracker", "batch_id": "CSV-001" }
  recorded_at          TIMESTAMPTZ   NOT NULL DEFAULT now(),
  created_at           TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- ── gov_pilot_alerts ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gov_pilot_alerts (
  id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  pilot_id       UUID         NOT NULL REFERENCES gov_pilots(id) ON DELETE CASCADE,
  kpi_id         UUID         REFERENCES gov_pilot_kpis(id) ON DELETE SET NULL,
  severity       VARCHAR(16)  NOT NULL DEFAULT 'WARNING'
                   CHECK (severity IN ('INFO','WARNING','CRITICAL')),
  title          VARCHAR(255) NOT NULL,
  message        TEXT         NOT NULL,
  expected_value NUMERIC(14,2),
  actual_value   NUMERIC(14,2),
  variance_pct   NUMERIC(8,2),
  recipient_role VARCHAR(32)  NOT NULL DEFAULT 'ALL'
                   CHECK (recipient_role IN ('DEPT_ADMIN','STARTUP','VALIDATOR','ALL')),
  status         VARCHAR(32)  NOT NULL DEFAULT 'ACTIVE'
                   CHECK (status IN ('ACTIVE','ACKNOWLEDGED','RESOLVED')),
  acknowledged_by VARCHAR(255),
  acknowledged_at TIMESTAMPTZ,
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Indexes for high-frequency telemetry lookups
CREATE INDEX IF NOT EXISTS idx_telemetry_pilot_id ON gov_kpi_telemetry_readings(pilot_id);
CREATE INDEX IF NOT EXISTS idx_telemetry_kpi_id   ON gov_kpi_telemetry_readings(kpi_id);
CREATE INDEX IF NOT EXISTS idx_telemetry_recorded ON gov_kpi_telemetry_readings(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_pilot_id    ON gov_pilot_alerts(pilot_id);
CREATE INDEX IF NOT EXISTS idx_alerts_status      ON gov_pilot_alerts(status);

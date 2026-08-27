-- =========================================
-- 1. USERS & ROLES
-- =========================================
CREATE TYPE user_role AS ENUM ('dept_admin', 'startup', 'evaluator', 'validator', 'super_admin');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role user_role NOT NULL,
    department_name VARCHAR(150),      -- only for dept_admin
    designation VARCHAR(100),
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- =========================================
-- 2. STARTUP PROFILES
-- =========================================
CREATE TABLE startups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(150) NOT NULL,
    sector VARCHAR(100),
    stage VARCHAR(50),
    founded_year INT,
    team_size INT,
    past_turnover NUMERIC,
    tech_tags TEXT[],
    pitch_summary TEXT,
    website_url TEXT,

    -- verification fields (updated)
    dpiit_reg_number VARCHAR(50),
    verification_status VARCHAR(20) DEFAULT 'unverified',
    verification_method VARCHAR(30),
    verification_doc_url TEXT,
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);
-- =========================================
-- 3. CHALLENGES / PROBLEM STATEMENTS
-- =========================================
CREATE TYPE challenge_status AS ENUM (
    'draft', 'published', 'screening', 'evaluation',
    'pilot', 'validation', 'scale_up', 'closed', 'rejected'
);

CREATE TABLE challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dept_admin_id UUID REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    raw_problem_input TEXT,             -- original vague input from dept
    outcome_statement TEXT,             -- AI-refined outcome-based statement
    sector VARCHAR(100),
    tech_tags TEXT[],                   -- used for startup matching
    budget_ceiling NUMERIC,
    pilot_duration_days INT,
    risk_level VARCHAR(20),             -- low / medium / high
    status challenge_status DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- =========================================
-- 4. APPLICATIONS (Startup applies to Challenge)
-- =========================================
CREATE TYPE application_status AS ENUM (
    'submitted', 'eligibility_passed', 'eligibility_failed',
    'under_evaluation', 'shortlisted', 'rejected', 'selected_for_pilot'
);

CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
    startup_id UUID REFERENCES startups(id) ON DELETE CASCADE,
    proposal_summary TEXT,
    match_score NUMERIC,                -- AI-generated similarity score
    status application_status DEFAULT 'submitted',
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    UNIQUE (challenge_id, startup_id)
);

-- =========================================
-- 5. ELIGIBILITY SCREENING
-- =========================================
CREATE TABLE eligibility_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    criterion VARCHAR(150) NOT NULL,    -- e.g. "Min Turnover Waived (DPIIT)"
    is_relaxed BOOLEAN DEFAULT false,   -- true = alternate/relaxed criteria applied
    passed BOOLEAN,
    remarks TEXT,
    checked_at TIMESTAMP DEFAULT now()
);

-- =========================================
-- 6. EXPERT EVALUATION
-- =========================================
CREATE TABLE evaluation_criteria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
    criterion_name VARCHAR(150),        -- e.g. "Innovation", "Feasibility", "Scalability"
    weight NUMERIC CHECK (weight BETWEEN 0 AND 100)
);

CREATE TABLE evaluation_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    evaluator_id UUID REFERENCES users(id),
    criterion_id UUID REFERENCES evaluation_criteria(id),
    score NUMERIC CHECK (score BETWEEN 0 AND 10),
    comments TEXT,
    created_at TIMESTAMP DEFAULT now(),
    UNIQUE (application_id, evaluator_id, criterion_id)
);

-- =========================================
-- 7. PILOTS
-- =========================================
CREATE TYPE pilot_status AS ENUM (
    'setup', 'active', 'completed', 'terminated', 'validated'
);

CREATE TABLE pilots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    start_date DATE,
    end_date DATE,
    sandbox_scope TEXT,                 -- what data/environment startup gets access to
    data_access_level VARCHAR(50),      -- e.g. "anonymized", "restricted", "full"
    ip_ownership_clause TEXT,           -- who owns IP generated during pilot
    cybersecurity_requirements TEXT,
    status pilot_status DEFAULT 'setup',
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- =========================================
-- 8. MILESTONES & CONTRACTING
-- =========================================
CREATE TYPE milestone_status AS ENUM (
    'pending', 'in_progress', 'submitted', 'approved', 'rejected', 'paid'
);

CREATE TABLE milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pilot_id UUID REFERENCES pilots(id) ON DELETE CASCADE,
    title VARCHAR(200),
    description TEXT,
    due_date DATE,
    payment_amount NUMERIC,
    kpi_target TEXT,                    -- e.g. "Reduce processing time by 30%"
    kpi_actual TEXT,                    -- filled after measurement
    status milestone_status DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- =========================================
-- 9. PAYMENTS
-- =========================================
CREATE TYPE payment_status AS ENUM ('pending', 'processed', 'failed');

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    milestone_id UUID REFERENCES milestones(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    status payment_status DEFAULT 'pending',
    transaction_ref VARCHAR(150),
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT now()
);

-- =========================================
-- 10. PERFORMANCE MEASUREMENT / VALIDATION
-- =========================================
CREATE TABLE performance_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pilot_id UUID REFERENCES pilots(id) ON DELETE CASCADE,
    validator_id UUID REFERENCES users(id),
    overall_score NUMERIC CHECK (overall_score BETWEEN 0 AND 100),
    findings TEXT,
    recommendation VARCHAR(50),         -- "scale_up" / "terminate" / "extend_pilot"
    validated_at TIMESTAMP DEFAULT now()
);

-- =========================================
-- 11. DOCUMENTS (Auto-generated templates)
-- =========================================
CREATE TYPE document_type AS ENUM (
    'problem_statement', 'pilot_agreement', 'ip_data_clause',
    'evaluation_report', 'procurement_transition'
);

CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID REFERENCES challenges(id),
    pilot_id UUID REFERENCES pilots(id),
    doc_type document_type NOT NULL,
    file_url TEXT,                      -- link to generated PDF/doc
    generated_by VARCHAR(50) DEFAULT 'system', -- 'system' or user_id
    created_at TIMESTAMP DEFAULT now()
);

-- =========================================
-- 12. AUDIT TRAIL (Transparency Log)
-- =========================================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES users(id),
    action VARCHAR(150) NOT NULL,       -- e.g. "CHALLENGE_PUBLISHED", "MILESTONE_APPROVED"
    entity_type VARCHAR(50),            -- 'challenge', 'application', 'pilot', etc.
    entity_id UUID,
    details JSONB,
    created_at TIMESTAMP DEFAULT now()
);

-- =========================================
-- 13. Mock registry
-- =========================================
CREATE TABLE dpiit_mock_registry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dpiit_reg_number VARCHAR(50) UNIQUE NOT NULL,
    company_name VARCHAR(150) NOT NULL,
    incorporation_date DATE,
    sector VARCHAR(100),
    is_active BOOLEAN DEFAULT true,   -- lets you simulate an expired/revoked recognition
    created_at TIMESTAMP DEFAULT now()
);

INSERT INTO dpiit_mock_registry (dpiit_reg_number, company_name, incorporation_date, sector) VALUES
('DIPP12345', 'AgroSense Pvt Ltd', '2022-03-15', 'AgriTech'),
('DIPP67890', 'MedTrack Solutions', '2021-11-02', 'HealthTech'),
('DIPP24680', 'CleanGrid Energy', '2023-01-20', 'CleanTech');
-- etc.

ALTER TABLE eligibility_checks
  ADD COLUMN verification_method_used VARCHAR(30);

-- Add to users table
ALTER TABLE users
  ADD COLUMN account_status VARCHAR(20) DEFAULT 'active',
  -- 'pending' / 'approved' / 'rejected' / 'active'
  -- startup & super_admin default to 'active' immediately
  ADD COLUMN approved_by UUID REFERENCES users(id),
  ADD COLUMN approved_at TIMESTAMP;

-- OTP table (separate, since OTPs expire and shouldn't clutter users table)
CREATE TABLE otp_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    otp_code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT now()
);
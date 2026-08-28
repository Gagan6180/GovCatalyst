# GovCatalyst

> **From Government Challenges to Startup Solutions** — A transparent, competitive, and legally compliant innovation-procurement pathway.

---

## Overview

GovCatalyst is a structured end-to-end government innovation procurement platform that connects government departments facing operational problems with startups capable of delivering innovative solutions. It covers the full lifecycle — from challenge identification and startup discovery, through AI-assisted screening, expert panel evaluation, sandbox pilot design, milestone-based contracting, performance measurement, independent validation, and scale-up decisions.

---

## Project Structure

```
govCatalyst/
├── server/          # Node.js / Express backend (PostgreSQL)
└── docs/            # Frontend HTML/CSS/JS pages
```

---

## Branching Guidelines

Branches follow this naming convention: `<fe|be>/feat-<FeatureName>.<version>`

| Prefix | Meaning |
|--------|---------|
| `fe`   | Frontend |
| `be`   | Backend  |

**Examples:**
- `be/feat-Pilot.01` — Backend pilot module DB persistence
- `be/feat-Eval.01`  — Backend expert evaluation layer
- `fe/feat-login-page` — Frontend login page

---

## Backend — What's Been Built

### Tech Stack
- **Runtime**: Node.js + Express 5
- **Database**: PostgreSQL (raw `pg` pool — no ORM)
- **AI**: Google Gemini API (`@google/genai`)
- **Auth**: JWT + bcrypt + Nodemailer OTP
- **Validation**: Joi

---

### Roles
| Role | Description |
|------|-------------|
| `super_admin` | Platform admin — approves/rejects user registrations |
| `dept_admin` | Government department officer — creates challenges, assigns evaluators, manages pilots |
| `startup` | Startup company — applies to challenges, submits proposals, files appeals |
| `evaluator` | Domain expert — scores applications against a rubric |
| `validator` | Independent validator — verifies pilot evidence and milestone completion |

---

### Module 1 — Authentication & User Management

**Branch:** `be/feat-Auth.01`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Register (all roles); startup profile auto-created |
| `/api/auth/login` | POST | JWT login; blocks pending/rejected accounts |
| `/api/auth/me` | GET | Get current user profile |
| `/api/auth/pending-users` | GET | `super_admin`: list pending registrations |
| `/api/auth/approve/:userId` | POST | `super_admin`: approve user → sends OTP email |
| `/api/auth/reject/:userId` | POST | `super_admin`: reject user → sends rejection email |
| `/api/auth/verify-otp` | POST | Activate account via OTP |
| `/api/auth/dpiit/verify` | POST | Verify DPIIT registration number |
| `/api/auth/dpiit/confirm` | POST | Confirm and stamp DPIIT verification on startup profile |

**Key features:**
- Multi-step account activation: `pending → approved → OTP verified → active`
- DPIIT mock-registry verification for startup eligibility
- Email notifications at every stage (Nodemailer)

---

### Module 2 — Challenge Management

**Branch:** `be/feat-Challenges.01`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/challenges` | POST | `dept_admin`: create challenge (triggers AI processing) |
| `/api/challenges` | GET | List all challenges (filter by status/sector) |
| `/api/challenges/my` | GET | `dept_admin`: own challenges |
| `/api/challenges/:id` | GET | Get single challenge |
| `/api/challenges/:id` | PATCH | `dept_admin`: edit challenge fields |
| `/api/challenges/:id/publish` | PATCH | `dept_admin`: publish (draft → published) |

**Key features:**
- AI-powered outcome statement generation via Gemini — converts raw problem input into a structured, outcome-based problem statement
- Automatic tech-tag extraction from problem description
- Challenge lifecycle: `draft → published`
- Fields: title, sector, budget ceiling, pilot duration, risk level, turnover/experience requirements

---

### Module 3 — Application & AI Screening

**Branch:** `be/feat-Applications.01`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/applications/challenge/:challenge_id/apply` | POST | `startup`: apply with proposal |
| `/api/applications/my` | GET | `startup`: view own applications |
| `/api/applications/challenge/:challenge_id` | GET | `dept_admin`: view applications (shortlisted or all) |

**Key features:**
- AI proposal scoring (0–100) using Gemini — evaluates technical fit, DPIIT status, proposal quality
- Auto-shortlist at score ≥ 75 → status `shortlisted`
- Auto-reject below threshold → status `rejected`
- Detailed AI feedback: strengths, risks, recommendation
- Idempotent — re-submission triggers re-evaluation

---

### Module 4 — Expert Evaluation (Human Review Layer)

**Branch:** `be/feat-Eval.01`

The human expert panel sits between AI shortlisting and pilot selection. Every shortlisted application goes through structured scoring by domain experts.

**Workflow:**
```
AI shortlists (score ≥ 75)
  → dept_admin seeds 5-criterion rubric for the challenge
  → dept_admin assigns evaluator(s) to the application
  → Each evaluator scores all criteria (weighted, 0–10 each)
  → Evaluator declares Conflict of Interest if needed (auto-withdraw)
  → dept_admin finalizes panel → weighted avg aggregated
       ≥ 75 pts → APPROVE  |  ≥ 55 pts → CONDITIONAL  |  < 55 → REJECT
  → dept_admin can override with mandatory written justification
  → Application status updated; startup can file one appeal on rejection
  → dept_admin reviews appeal → accepted = reopens evaluation
```

**Default 5-criterion rubric** (seeded per challenge):
| Criterion | Weight |
|-----------|--------|
| Technical Feasibility | 25% |
| Innovation & Novelty | 20% |
| Alignment with Outcomes | 25% |
| Cost Effectiveness | 15% |
| Scalability & Replication | 15% |

| Endpoint | Method | Role | Description |
|----------|--------|------|-------------|
| `/api/evaluations/criteria` | POST | dept_admin | Add scoring criterion |
| `/api/evaluations/criteria/seed/:challengeId` | POST | dept_admin | Seed standard 5-criterion rubric |
| `/api/evaluations/criteria/:challengeId` | GET | all | View rubric |
| `/api/evaluations/criteria/:criterionId` | PATCH | dept_admin | Edit criterion |
| `/api/evaluations/criteria/:criterionId` | DELETE | dept_admin | Soft-delete criterion |
| `/api/evaluations/assign` | POST | dept_admin | Assign evaluator to application |
| `/api/evaluations/assignments/application/:id` | GET | dept_admin | All assignments for an application |
| `/api/evaluations/assignments/my` | GET | evaluator | Evaluator's own queue |
| `/api/evaluations/assignments/:id/conflict` | POST | evaluator | Declare conflict of interest |
| `/api/evaluations/scores/submit` | POST | evaluator | Submit all criteria scores |
| `/api/evaluations/scores/my/:applicationId` | GET | evaluator | Own scores + weighted total |
| `/api/evaluations/scores/:applicationId` | GET | dept_admin | All scores grouped by evaluator |
| `/api/evaluations/panel/:applicationId/finalize` | POST | dept_admin | Compute weighted panel recommendation |
| `/api/evaluations/panel/:applicationId` | GET | dept_admin | View panel decision |
| `/api/evaluations/panel/:applicationId/override` | POST | dept_admin | Override with written justification |
| `/api/evaluations/summary/:applicationId` | GET | dept_admin | Full evaluation dashboard |
| `/api/evaluations/appeal/:applicationId` | POST | startup | File rejection appeal |
| `/api/evaluations/appeals/pending` | GET | dept_admin | List pending appeals |
| `/api/evaluations/appeal/:applicationId/review` | PATCH | dept_admin | Accept / reject appeal |

---

### Module 5 — Pilot Design & Management

**Branch:** `be/feat-Pilot.01`

Full pilot lifecycle management with 13-state machine, cybersecurity gating, KPI tracking, risk & issue management, user feedback, evidence collection, and a 22-section completion report generator.

**Pilot Lifecycle State Machine:**
```
DRAFT → AGREEMENT_PENDING → AGREEMENT_APPROVED → SECURITY_CHECK
      → DATA_IP_CHECK → READY_FOR_DEPLOYMENT → DEPLOYMENT
      → ACTIVE_PILOT → MONITORING → PILOT_COMPLETED
      → EVALUATION → COMPLETED → SCALE / EXTEND / MODIFY / RE_PILOT / REJECT
```
*Any state can transition to PAUSED or TERMINATED where applicable.*

**Cybersecurity Gate:** Blocks activation (`READY_FOR_DEPLOYMENT` / `ACTIVE_PILOT`) if any CRITICAL checklist item is unresolved.

| Endpoint | Method | Role | Description |
|----------|--------|------|-------------|
| `/api/pilots` | GET | all | List all pilots |
| `/api/pilots` | POST | dept_admin | Create pilot with KPIs, risks, cyber-checklist |
| `/api/pilots/:id` | GET | all | Get pilot + all sub-resources |
| `/api/pilots/:id/status` | PATCH | dept_admin | State transition (validated by state machine) |
| `/api/pilots/:id/evaluate` | POST | dept_admin | Automated outcome engine (KPI + risk + security) |
| `/api/pilots/:id/report` | GET | all | Generate 22-section completion report |
| `/api/pilots/:id/audit` | GET | all | View full audit log |
| `/api/pilots/:id/kpis` | GET/POST | all/dept_admin | List / add KPIs |
| `/api/pilots/:id/kpis/:kpiId` | PATCH | dept_admin | Update KPI current value (auto-recalculates improvement %) |
| `/api/pilots/:id/risks` | GET/POST | all/dept_admin | List / add risks |
| `/api/pilots/:id/risks/:riskId/status` | PATCH | dept_admin | Update risk status |
| `/api/pilots/:id/issues` | GET/POST | all | List / log issues |
| `/api/pilots/:id/issues/:issueId/resolve` | PATCH | dept_admin | Resolve issue |
| `/api/pilots/:id/feedback` | GET/POST | all | List / submit user feedback |
| `/api/pilots/:id/evidences` | GET/POST | all | List / submit evidence |
| `/api/pilots/:id/evidences/:evidenceId/verify` | PATCH | validator | Verify / reject evidence |

---

### Database Schema Summary

| Table | Purpose |
|-------|---------|
| `users` | All roles — auth, status, approval trail |
| `startups` | Startup profiles + DPIIT verification |
| `challenges` | Government problem statements |
| `applications` | Startup applications to challenges |
| `eligibility_checks` | Per-application eligibility screening record |
| `evaluation_criteria` | Weighted scoring rubric per challenge |
| `evaluation_scores` | Per-criterion score by each evaluator |
| `evaluation_assignments` | Evaluator → application queue with COI support |
| `evaluation_panel_decisions` | Aggregated panel recommendation + override trail |
| `evaluation_appeals` | Startup appeal on rejection |
| `gov_pilots` | Full pilot design and lifecycle record |
| `gov_pilot_kpis` | KPIs per pilot with baseline/target/current |
| `gov_pilot_risks` | Risk register per pilot |
| `gov_pilot_issues` | Issue log per pilot |
| `gov_pilot_feedbacks` | User satisfaction feedback per pilot |
| `gov_pilot_evidences` | Evidence/document submissions per pilot |
| `gov_pilot_audit_logs` | Persisted audit trail for all pilot state changes |
| `milestones` | Payment milestone records |
| `payments` | Payment tracking |
| `otp_verifications` | OTP store for account activation |
| `audit_logs` | Platform-wide audit log |
| `dpiit_mock_registry` | Mock DPIIT startup registry for verification |
| `documents` | Document store |
| `performance_reports` | Pilot performance reports |

---

### Services & Utilities

| File | Purpose |
|------|---------|
| `aiServices.js` | Gemini API — outcome statement generation + proposal scoring |
| `pilot.service.js` | KPI improvement calc, cybersecurity gate evaluation, automated outcome engine |
| `document.service.js` | 22-section completion report + bilateral agreement generator |
| `audit.service.js` | Action logging |
| `emailService.js` | Nodemailer — registration, OTP, rejection emails |
| `stateMachine.js` | Generic state-transition validator (13-state pilot lifecycle graph) |
| `responseFormatter.js` | Standardised `{ success, data, message }` API responses |
| `authUtils.js` | JWT sign/verify + bcrypt helpers |

---

## Running Locally

```bash
# 1. Install dependencies
cd server
npm install

# 2. Configure environment
cp .env.example .env
# Fill in: DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME
#          JWT_SECRET, GEMINI_API_KEY, SMTP_* credentials

# 3. Run DB migrations (in order)
psql -U postgres -d <DB_NAME> -f seed/pilot_tables.sql
psql -U postgres -d <DB_NAME> -f seed/evaluation_tables.sql

# 4. Seed test data
npm run seed:superadmin
npm run seed:dept-admin
npm run seed:startup
npm run seed:challenges

# 5. Start dev server
npm run dev
# → http://localhost:5009
```

---

## API Base URL

```
http://localhost:5009/api
```

All protected routes require:
```
Authorization: Bearer <jwt_token>
```

---

## What's Still To Build

| Gap | Priority |
|-----|----------|
| Milestone-based contracting & payment release API | 🔴 High |
| Independent validator workflow (evidence verification flow) | 🔴 High |
| Scale-up / procurement pathway (committee voting, GeM link) | 🟡 Medium |
| File/document upload (`multer` + storage) | 🟡 Medium |
| Startup notification system (payment events, status changes) | 🟡 Medium |
| Startup matching / discovery engine | 🟠 Medium |
| Challenge lifecycle (closed/completed statuses + deadlines) | 🟠 Medium |
| CORS + Helmet applied to app.js | 🟠 Medium |
| Audit log DB persistence for non-pilot actions | 🟠 Medium |
| Reusable template library API (data/IP, cybersecurity clauses) | 🟠 Low |

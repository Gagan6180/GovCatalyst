/**
 * GovCatalyst — Pilot Controller (DB-backed)
 * All data persisted via pilot.db.js (raw pg pool — no in-memory store)
 */

const {
  Pilot, PilotKpi, PilotRisk, PilotIssue,
  PilotFeedback, PilotEvidence, PilotAuditLog
} = require('../models/pilot.db');
const pilotService   = require('../services/pilot.service');
const documentService = require('../services/document.service');
const { formatSuccess, formatError } = require('../utils/responseFormatter');

/** Generate a human-readable pilot code (stored separately from UUID PK) */
function generatePilotCode() {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `PILOT-${year}-${rand}`;
}

/** Resolve a pilot by UUID or by pilot_code */
async function resolvePilot(idOrCode) {
  // UUID pattern
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidPattern.test(idOrCode)) {
    return Pilot.findById(idOrCode);
  }
  return Pilot.findByCode(idOrCode);
}

// ─────────────────────────────────────────────────────────────────
// LIST ALL PILOTS
// GET /api/pilots
// ─────────────────────────────────────────────────────────────────
async function getAllPilots(req, res) {
  try {
    const pilots = await Pilot.findAll();
    return formatSuccess(res, pilots, 'Pilots retrieved successfully');
  } catch (err) {
    return formatError(res, err.message);
  }
}

// ─────────────────────────────────────────────────────────────────
// GET ONE PILOT (with all sub-resources)
// GET /api/pilots/:id
// ─────────────────────────────────────────────────────────────────
async function getPilotById(req, res) {
  try {
    const { id } = req.params;
    const pilot = await resolvePilot(id);
    if (!pilot) return formatError(res, 'Pilot not found', 404);

    // Eager-load sub-resources in parallel using UUID PK
    const [kpis, risks, issues, feedbackList, evidences] = await Promise.all([
      PilotKpi.findByPilot(pilot.id),
      PilotRisk.findByPilot(pilot.id),
      PilotIssue.findByPilot(pilot.id),
      PilotFeedback.findByPilot(pilot.id),
      PilotEvidence.findByPilot(pilot.id),
    ]);

    const { avgSatisfaction } = await PilotFeedback.averageByPilot(pilot.id);

    return formatSuccess(res, {
      ...pilot,
      kpis,
      risks,
      issues,
      feedbackList,
      evidences,
      averageSatisfaction: avgSatisfaction,
    }, 'Pilot retrieved successfully');
  } catch (err) {
    return formatError(res, err.message);
  }
}

// ─────────────────────────────────────────────────────────────────
// CREATE PILOT
// POST /api/pilots
// ─────────────────────────────────────────────────────────────────
async function createPilot(req, res) {
  try {
    const data    = req.body;
    const pilotCode = generatePilotCode();
    const user      = req.user?.name || req.user?.email || 'Authorized Officer';
    const userId    = req.user?.user_id || req.user?.id || null;

    const pilot = await Pilot.create({
      pilotCode,
      name:                  data.name,
      problemStatementText:  data.problemStatement || data.problemStatementText,
      department:            data.department,
      startup:               data.startup,
      startupLead:           data.startupLead,
      solution:              data.solution,
      objective:             data.objective,
      baselineObjective:     data.baselineObjective,
      targetObjective:       data.targetObjective,
      minAcceptableResult:   data.minAcceptableResult,
      successCondition:      data.successCondition,
      location:              data.location,
      startDate:             data.startDate,
      endDate:               data.endDate,
      durationWeeks:         data.durationWeeks,
      usersCount:            data.usersCount,
      scopeIncluded:         data.scopeIncluded,
      scopeExcluded:         data.scopeExcluded,
      budgetAllocated:       data.budgetAllocated,
      pilotOwner:            data.pilotOwner || user,
      cyberChecklist:        data.cyberChecklist,
      dataRules:             data.dataRules,
      ipRules:               data.ipRules,
    });

    // Bulk-insert KPIs if provided
    const pilotId = pilot.id; // UUID primary key from DB
    if (Array.isArray(data.kpis) && data.kpis.length > 0) {
      await Promise.all(data.kpis.map((k, i) =>
        PilotKpi.create({ ...k, pilotId, kpiCode: k.kpiCode || `KPI-${i + 1}` })
      ));
    }

    // Bulk-insert risks if provided
    if (Array.isArray(data.risks) && data.risks.length > 0) {
      await Promise.all(data.risks.map((r, i) =>
        PilotRisk.create({ ...r, pilotId, riskCode: r.riskCode || `RSK-${String(i + 1).padStart(2, '0')}` })
      ));
    }

    await PilotAuditLog.log({
      pilotId:  pilot.id,
      userId,
      action:   'Pilot Created',
      detail:   `Pilot "${pilot.name}" (${pilot.pilot_code}) created for ${pilot.startup}`,
      oldValue: 'None',
      newValue: 'DRAFT',
    });

    return formatSuccess(res, pilot, 'Pilot created successfully', 201);
  } catch (err) {
    return formatError(res, err.message);
  }
}

// ─────────────────────────────────────────────────────────────────
// UPDATE STATUS / STATE TRANSITION
// PATCH /api/pilots/:id/status
// ─────────────────────────────────────────────────────────────────
async function updateStatus(req, res) {
  try {
    const { id }                    = req.params;
    const { targetStatus, reason }  = req.body;
    const user   = req.user?.name  || req.user?.email || 'Authorized Officer';
    const userId = req.user?.user_id || req.user?.id  || null;

    const pilot = await resolvePilot(id);
    if (!pilot) return formatError(res, 'Pilot not found', 404);

    if (!pilotService.canTransition(pilot.status, targetStatus)) {
      return formatError(res,
        `Invalid state transition from "${pilot.status}" to "${targetStatus}"`, 400
      );
    }

    // Security gate: block activation until critical checklist passes
    const activationStates = ['READY_FOR_DEPLOYMENT', 'DEPLOYMENT', 'ACTIVE_PILOT'];
    if (activationStates.includes(targetStatus)) {
      const gate = pilotService.evaluateSecurityGate(pilot.cyber_checklist || []);
      if (!gate.canActivate) {
        return formatError(res,
          'Pilot activation blocked: unresolved critical cybersecurity checks',
          403, gate.failedCriticalChecks
        );
      }
    }

    const updated = await Pilot.updateStatus(pilot.id, targetStatus);

    await PilotAuditLog.log({
      pilotId: pilot.id, userId,
      action: `Status → ${targetStatus}`,
      detail: reason || `Pilot status updated to ${targetStatus}`,
      oldValue: pilot.status,
      newValue: targetStatus,
    });

    return formatSuccess(res, updated, `Status updated to ${targetStatus}`);
  } catch (err) {
    return formatError(res, err.message);
  }
}

// ─────────────────────────────────────────────────────────────────
// EVALUATE PILOT OUTCOME (automated engine)
// POST /api/pilots/:id/evaluate
// ─────────────────────────────────────────────────────────────────
async function evaluatePilot(req, res) {
  try {
    const { id }   = req.params;
    const pilot    = await resolvePilot(id);
    if (!pilot) return formatError(res, 'Pilot not found', 404);

    const kpis   = await PilotKpi.findByPilot(pilot.id);
    const risks  = await PilotRisk.findByPilot(pilot.id);

    const evaluation = pilotService.calculateAutomatedOutcome(kpis, risks, pilot.security_status);

    const updated = await Pilot.updateOutcome(
      pilot.id,
      evaluation.outcome,
      req.body.committeeDecision || 'PENDING',
      evaluation.rationale
    );

    await PilotAuditLog.log({
      pilotId: pilot.id,
      userId:  req.user?.user_id || null,
      action:  'Pilot Evaluated',
      detail:  evaluation.rationale,
      oldValue: pilot.outcome,
      newValue: evaluation.outcome,
    });

    return formatSuccess(res, {
      pilotId:   id,
      outcome:   evaluation.outcome,
      rationale: evaluation.rationale,
      pilot:     updated,
    }, 'Pilot evaluated successfully');
  } catch (err) {
    return formatError(res, err.message);
  }
}

// ─────────────────────────────────────────────────────────────────
// 22-SECTION COMPLETION REPORT
// GET /api/pilots/:id/report
// ─────────────────────────────────────────────────────────────────
async function getCompletionReport(req, res) {
  try {
    const { id } = req.params;
    const pilot  = await resolvePilot(id);
    if (!pilot) return formatError(res, 'Pilot not found', 404);

    const [kpis, risks, issues, feedbackList, evidences] = await Promise.all([
      PilotKpi.findByPilot(pilot.id),
      PilotRisk.findByPilot(pilot.id),
      PilotIssue.findByPilot(pilot.id),
      PilotFeedback.findByPilot(pilot.id),
      PilotEvidence.findByPilot(pilot.id),
    ]);
    const { avgSatisfaction } = await PilotFeedback.averageByPilot(pilot.id);

    // Map DB snake_case columns to the shape document.service expects
    const pilotDoc = {
      id:                   pilot.id,
      name:                 pilot.name,
      problemStatement:     pilot.problem_statement_text,
      problemStatementText: pilot.problem_statement_text,
      department:           pilot.department,
      startup:              pilot.startup,
      startupLead:          pilot.startup_lead,
      solution:             pilot.solution,
      objective:            pilot.objective,
      baselineObjective:    pilot.baseline_objective,
      targetObjective:      pilot.target_objective,
      location:             pilot.location,
      startDate:            pilot.start_date,
      endDate:              pilot.end_date,
      durationWeeks:        pilot.duration_weeks,
      usersCount:           pilot.users_count,
      scopeIncluded:        pilot.scope_included,
      scopeExcluded:        pilot.scope_excluded,
      budgetAllocated:      pilot.budget_allocated,
      budgetSpent:          pilot.budget_spent,
      pilotOwner:           pilot.pilot_owner,
      outcome:              pilot.outcome,
      committeeDecision:    pilot.committee_decision,
      committeeReason:      pilot.committee_reason,
      securityStatus:       pilot.security_status,
      cyberChecklist:       pilot.cyber_checklist,
      dataRules:            pilot.data_rules,
      ipRules:              pilot.ip_rules,
      kpis,
      risks,
      issues,
      feedbackList,
      evidences,
      averageSatisfaction:  avgSatisfaction,
    };

    const report = documentService.generate22SectionReport(pilotDoc);
    return formatSuccess(res, report, '22-Section Completion Report generated');
  } catch (err) {
    return formatError(res, err.message);
  }
}

// ─────────────────────────────────────────────────────────────────
// KPI ROUTES
// ─────────────────────────────────────────────────────────────────
async function addKpi(req, res) {
  try {
    const { id: pilotId } = req.params;
    const pilot = await resolvePilot(pilotId);
    if (!pilot) return formatError(res, 'Pilot not found', 404);

    const kpi = await PilotKpi.create({ ...req.body, pilotId: pilot.id });
    return formatSuccess(res, kpi, 'KPI added', 201);
  } catch (err) {
    return formatError(res, err.message);
  }
}

async function updateKpi(req, res) {
  try {
    const { kpiId } = req.params;
    const { current } = req.body;

    // Recalculate improvement & status server-side using the service
    const pilotUUID = (await resolvePilot(req.params.id))?.id;
    const existing  = pilotUUID ? await PilotKpi.findByPilot(pilotUUID) : [];
    const kpi = existing.find(k => k.id === kpiId);
    if (!kpi) return formatError(res, 'KPI not found', 404);

    const { improvementPercent, status } = pilotService.calculateKPIImprovement(
      kpi.baseline, current, kpi.target, kpi.min_acceptable, kpi.direction
    );

    const updated = await PilotKpi.update(kpiId, { current, improvementPercent, status });
    return formatSuccess(res, updated, 'KPI updated');
  } catch (err) {
    return formatError(res, err.message);
  }
}

async function getKpis(req, res) {
  try {
    const pilot = await resolvePilot(req.params.id);
    if (!pilot) return formatError(res, 'Pilot not found', 404);
    const kpis = await PilotKpi.findByPilot(pilot.id);
    return formatSuccess(res, kpis, 'KPIs retrieved');
  } catch (err) {
    return formatError(res, err.message);
  }
}

// ─────────────────────────────────────────────────────────────────
// RISK ROUTES
// ─────────────────────────────────────────────────────────────────
async function addRisk(req, res) {
  try {
    const { id: pilotId } = req.params;
    const pilot = await resolvePilot(pilotId);
    if (!pilot) return formatError(res, 'Pilot not found', 404);

    const risk = await PilotRisk.create({ ...req.body, pilotId: pilot.id });
    return formatSuccess(res, risk, 'Risk added', 201);
  } catch (err) {
    return formatError(res, err.message);
  }
}

async function updateRiskStatus(req, res) {
  try {
    const { riskId }  = req.params;
    const { status }  = req.body;
    const updated     = await PilotRisk.updateStatus(riskId, status);
    if (!updated) return formatError(res, 'Risk not found', 404);
    return formatSuccess(res, updated, 'Risk status updated');
  } catch (err) {
    return formatError(res, err.message);
  }
}

async function getRisks(req, res) {
  try {
    const pilot = await resolvePilot(req.params.id);
    if (!pilot) return formatError(res, 'Pilot not found', 404);
    const risks = await PilotRisk.findByPilot(pilot.id);
    return formatSuccess(res, risks, 'Risks retrieved');
  } catch (err) {
    return formatError(res, err.message);
  }
}

// ─────────────────────────────────────────────────────────────────
// ISSUE ROUTES
// ─────────────────────────────────────────────────────────────────
async function addIssue(req, res) {
  try {
    const { id: pilotId } = req.params;
    const pilot = await resolvePilot(pilotId);
    if (!pilot) return formatError(res, 'Pilot not found', 404);

    const reportedBy = req.body.reportedBy || req.user?.name || 'Officer';
    const issue = await PilotIssue.create({ ...req.body, pilotId: pilot.id, reportedBy });
    return formatSuccess(res, issue, 'Issue logged', 201);
  } catch (err) {
    return formatError(res, err.message);
  }
}

async function resolveIssue(req, res) {
  try {
    const { issueId }            = req.params;
    const { resolution, status } = req.body;
    const updated = await PilotIssue.resolve(issueId, { resolution, status });
    if (!updated) return formatError(res, 'Issue not found', 404);
    return formatSuccess(res, updated, 'Issue resolved');
  } catch (err) {
    return formatError(res, err.message);
  }
}

async function getIssues(req, res) {
  try {
    const pilot = await resolvePilot(req.params.id);
    if (!pilot) return formatError(res, 'Pilot not found', 404);
    const issues = await PilotIssue.findByPilot(pilot.id);
    return formatSuccess(res, issues, 'Issues retrieved');
  } catch (err) {
    return formatError(res, err.message);
  }
}

// ─────────────────────────────────────────────────────────────────
// FEEDBACK ROUTES
// ─────────────────────────────────────────────────────────────────
async function addFeedback(req, res) {
  try {
    const { id: pilotId } = req.params;
    const pilot = await resolvePilot(pilotId);
    if (!pilot) return formatError(res, 'Pilot not found', 404);

    const userName = req.body.userName || req.user?.name || 'Anonymous';
    const feedback = await PilotFeedback.create({ ...req.body, pilotId: pilot.id, userName });
    const stats    = await PilotFeedback.averageByPilot(pilot.id);
    return formatSuccess(res, { feedback, stats }, 'Feedback recorded', 201);
  } catch (err) {
    return formatError(res, err.message);
  }
}

async function getFeedback(req, res) {
  try {
    const pilot = await resolvePilot(req.params.id);
    if (!pilot) return formatError(res, 'Pilot not found', 404);
    const [feedbackList, stats] = await Promise.all([
      PilotFeedback.findByPilot(pilot.id),
      PilotFeedback.averageByPilot(pilot.id),
    ]);
    return formatSuccess(res, { feedbackList, stats }, 'Feedback retrieved');
  } catch (err) {
    return formatError(res, err.message);
  }
}

// ─────────────────────────────────────────────────────────────────
// EVIDENCE ROUTES
// ─────────────────────────────────────────────────────────────────
async function addEvidence(req, res) {
  try {
    const { id: pilotId } = req.params;
    const pilot = await resolvePilot(pilotId);
    if (!pilot) return formatError(res, 'Pilot not found', 404);

    const uploadedBy = req.body.uploadedBy || req.user?.name || 'Officer';
    const evidence   = await PilotEvidence.create({ ...req.body, pilotId: pilot.id, uploadedBy });
    return formatSuccess(res, evidence, 'Evidence submitted', 201);
  } catch (err) {
    return formatError(res, err.message);
  }
}

async function verifyEvidence(req, res) {
  try {
    const { evidenceId } = req.params;
    const { status }     = req.body; // 'Verified' | 'Rejected'
    const updated        = await PilotEvidence.verify(evidenceId, status);
    if (!updated) return formatError(res, 'Evidence not found', 404);
    return formatSuccess(res, updated, `Evidence marked as ${status}`);
  } catch (err) {
    return formatError(res, err.message);
  }
}

async function getEvidences(req, res) {
  try {
    const pilot = await resolvePilot(req.params.id);
    if (!pilot) return formatError(res, 'Pilot not found', 404);
    const evidences = await PilotEvidence.findByPilot(pilot.id);
    return formatSuccess(res, evidences, 'Evidences retrieved');
  } catch (err) {
    return formatError(res, err.message);
  }
}

// ─────────────────────────────────────────────────────────────────
// AUDIT LOG
// GET /api/pilots/:id/audit
// ─────────────────────────────────────────────────────────────────
async function getAuditLog(req, res) {
  try {
    const pilot = await resolvePilot(req.params.id);
    if (!pilot) return formatError(res, 'Pilot not found', 404);
    const logs = await PilotAuditLog.findByPilot(pilot.id);
    return formatSuccess(res, logs, 'Audit log retrieved');
  } catch (err) {
    return formatError(res, err.message);
  }
}

module.exports = {
  getAllPilots, getPilotById, createPilot,
  updateStatus, evaluatePilot, getCompletionReport,
  // KPI
  addKpi, updateKpi, getKpis,
  // Risk
  addRisk, updateRiskStatus, getRisks,
  // Issue
  addIssue, resolveIssue, getIssues,
  // Feedback
  addFeedback, getFeedback,
  // Evidence
  addEvidence, verifyEvidence, getEvidences,
  // Audit
  getAuditLog,
};

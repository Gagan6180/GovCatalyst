/**
 * SIH26136 Pilot Module - Pilot Controller (Canonical)
 * GovCatalyst Government Innovation Procurement
 */

const pilotService = require('../services/pilot.service');
const documentService = require('../services/document.service');
const auditService = require('../services/audit.service');
const { formatSuccess, formatError } = require('../utils/responseFormatter');

// Preloaded in-memory store
let memoryPilots = [
  {
    id: "PILOT-2026-INFR-001",
    name: "AI-Powered Highway & Bridge Infrastructure Inspection Pilot",
    problemStatement: "PS-2026-NHAI-042: Manual visual inspection takes 10 hours per bridge deck with subjective error rates.",
    department: "National Highways Authority & Ministry of Road Transport",
    startup: "InspectAI Technologies Pvt Ltd (Startup A)",
    startupLead: "Dr. Vikram Sen (Chief Technology Officer)",
    solution: "Autonomous Drone Computer-Vision Defect Detection System",
    objective: "Test whether the startup's AI-based inspection solution reduces inspection time while maintaining high accuracy.",
    baselineObjective: "10 hours per bridge inspection.",
    targetObjective: "At least 40% reduction in inspection time (6 hours or less).",
    minAcceptableResult: "30% reduction (7 hours or less).",
    successCondition: "Target KPIs achieved without critical safety or security failures.",
    location: "NH-48 Corridor (Sector 12, 18, and 24 Bridge Overpasses)",
    startDate: "2026-06-01",
    endDate: "2026-07-27",
    durationWeeks: 8,
    usersCount: 10,
    scopeIncluded: ["3 bridge locations", "100 inspection cases", "10 government engineers", "GIS integration"],
    scopeExcluded: ["State-wide rollout", "Permanent procurement commitment"],
    budgetAllocated: 500000.00,
    budgetSpent: 460000.00,
    pilotOwner: "Shri Rajesh Verma (Chief Engineer)",
    status: "COMPLETED",
    outcome: "SUCCESSFUL",
    committeeDecision: "SCALE",
    committeeReason: "Achieved 42% inspection time reduction with 91% accuracy and 0 incidents.",
    securityStatus: "LOW RISK",
    kpis: [
      { id: "KPI-1", name: "Inspection Time", baseline: 10.0, target: 6.0, current: 5.8, unit: "hours", direction: "LOWER_IS_BETTER", improvementPercent: 42.0, status: "ACHIEVED" },
      { id: "KPI-2", name: "Defect Detection Accuracy", baseline: 82.0, target: 90.0, current: 91.0, unit: "%", direction: "HIGHER_IS_BETTER", improvementPercent: 10.97, status: "ACHIEVED" },
      { id: "KPI-3", name: "Cost per Inspection", baseline: 5000, target: 3500, current: 3200, unit: "₹", direction: "LOWER_IS_BETTER", improvementPercent: 36.0, status: "ACHIEVED" }
    ],
    cyberChecklist: [
      { id: "SEC-01", title: "Authentication (MFA/PKI)", status: true, severity: "CRITICAL" },
      { id: "SEC-02", title: "Role-based access control", status: true, severity: "CRITICAL" },
      { id: "SEC-03", title: "Encryption in transit (TLS 1.3)", status: true, severity: "CRITICAL" },
      { id: "SEC-04", title: "Encryption at rest (AES-256)", status: true, severity: "HIGH" },
      { id: "SEC-09", title: "CERT-In Vulnerability Assessment", status: true, severity: "CRITICAL" }
    ],
    risks: [
      { id: "RSK-01", description: "Drone sensor fails during live highway flight", level: "Medium", status: "Mitigated", owner: "InspectAI Lead" }
    ],
    issues: [
      { id: "ISS-101", description: "Optical glare on northern girder", severity: "Medium", status: "Resolved", resolution: "Added polarized CPL filter" }
    ],
    feedbackList: [
      { user: "Eng. Suresh Patil", overallSatisfaction: 4.5, comments: "Huge safety improvement over scaffolding." }
    ],
    averageSatisfaction: 4.5,
    paymentMilestones: [
      { id: "M1", title: "Milestone 1: Setup & Agreement", percentage: 20, amount: 100000, status: "PAID" },
      { id: "M2", title: "Milestone 2: Deployment & Validation", percentage: 20, amount: 100000, status: "PAID" },
      { id: "M3", title: "Milestone 3: 100 Inspections Completed", percentage: 30, amount: 150000, status: "PAID" },
      { id: "M4", title: "Milestone 4: Final Evaluation & Scale-Up", percentage: 30, amount: 110000, status: "PAID" }
    ],
    milestones: [
      { id: 1, title: "Agreement Approved", status: "COMPLETED" },
      { id: 2, title: "Security Checks Completed", status: "COMPLETED" },
      { id: 3, title: "System Deployment Completed", status: "COMPLETED" },
      { id: 4, title: "User Training Completed", status: "COMPLETED" },
      { id: 5, title: "Pilot Started", status: "COMPLETED" },
      { id: 6, title: "50% Pilot Completed", status: "COMPLETED" },
      { id: 7, title: "Pilot Completed", status: "COMPLETED" },
      { id: 8, title: "Final Evaluation Completed", status: "COMPLETED" }
    ]
  }
];

class PilotController {
  /**
   * List all Pilots
   */
  async getAllPilots(req, res) {
    try {
      return formatSuccess(res, memoryPilots, 'Pilots retrieved successfully');
    } catch (error) {
      return formatError(res, error.message);
    }
  }

  /**
   * Create New Pilot (Section 1)
   */
  async createPilot(req, res) {
    try {
      const data = req.body;
      const pilotId = `PILOT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      const newPilot = {
        id: pilotId,
        name: data.name,
        problemStatement: data.problemStatement,
        department: data.department,
        startup: data.startup,
        startupLead: data.startupLead,
        solution: data.solution,
        objective: data.objective,
        baselineObjective: data.baselineObjective,
        targetObjective: data.targetObjective,
        minAcceptableResult: data.minAcceptableResult,
        successCondition: data.successCondition,
        location: data.location,
        startDate: data.startDate,
        endDate: data.endDate,
        durationWeeks: data.durationWeeks || 8,
        usersCount: data.usersCount || 10,
        scopeIncluded: data.scopeIncluded || [],
        scopeExcluded: data.scopeExcluded || [],
        budgetAllocated: data.budgetAllocated || 0,
        budgetSpent: 0,
        pilotOwner: data.pilotOwner || req.user?.name || 'Govt Officer',
        status: 'DRAFT',
        outcome: 'PENDING',
        committeeDecision: 'PENDING',
        securityStatus: 'LOW RISK',
        kpis: data.kpis || [],
        cyberChecklist: data.cyberChecklist || [],
        risks: data.risks || [],
        issues: [],
        feedbackList: [],
        averageSatisfaction: 0,
        paymentMilestones: data.paymentMilestones || [],
        milestones: data.milestones || []
      };

      memoryPilots.push(newPilot);

      await auditService.logAction({
        pilotId: newPilot.id,
        user: newPilot.pilotOwner,
        action: 'Pilot Created',
        detail: `Created pilot for ${newPilot.startup}`,
        oldValue: 'None',
        newValue: 'DRAFT'
      });

      return formatSuccess(res, newPilot, 'Pilot created successfully', 201);
    } catch (error) {
      return formatError(res, error.message);
    }
  }

  /**
   * Get Pilot by ID
   */
  async getPilotById(req, res) {
    try {
      const { id } = req.params;
      const pilot = memoryPilots.find(p => p.id === id);
      if (!pilot) {
        return formatError(res, 'Pilot not found', 404);
      }
      return formatSuccess(res, pilot, 'Pilot retrieved successfully');
    } catch (error) {
      return formatError(res, error.message);
    }
  }

  /**
   * Update Status / State Transition
   */
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { targetStatus, reason } = req.body;
      const user = req.user?.name || req.body.user || 'Authorized Officer';
      const pilot = memoryPilots.find(p => p.id === id);

      if (!pilot) {
        return formatError(res, 'Pilot not found', 404);
      }

      // State transition check
      if (!pilotService.canTransition(pilot.status, targetStatus)) {
        return formatError(res, `Invalid state transition from ${pilot.status} to ${targetStatus}`, 400);
      }

      // Security gating check before deployment/activation
      if (targetStatus === 'READY_FOR_DEPLOYMENT' || targetStatus === 'DEPLOYMENT' || targetStatus === 'ACTIVE_PILOT') {
        const securityGate = pilotService.evaluateSecurityGate(pilot.cyberChecklist);
        if (!securityGate.canActivate) {
          return formatError(res, 'Pilot activation blocked by cybersecurity gate: critical vulnerabilities unresolved', 403, securityGate.failedCriticalChecks);
        }
      }

      const oldStatus = pilot.status;
      pilot.status = targetStatus;

      await auditService.logAction({
        pilotId: pilot.id,
        user,
        action: `Status Transition to ${targetStatus}`,
        detail: reason || `Updated pilot status to ${targetStatus}`,
        oldValue: oldStatus,
        newValue: targetStatus
      });

      return formatSuccess(res, pilot, `Status successfully updated to ${targetStatus}`);
    } catch (error) {
      return formatError(res, error.message);
    }
  }

  /**
   * Evaluate Automated Outcome & Final Recommendation (Section 19, 20)
   */
  async evaluatePilot(req, res) {
    try {
      const { id } = req.params;
      const pilot = memoryPilots.find(p => p.id === id);
      if (!pilot) {
        return formatError(res, 'Pilot not found', 404);
      }

      const evaluation = pilotService.calculateAutomatedOutcome(pilot.kpis, pilot.risks, pilot.securityStatus);
      pilot.outcome = evaluation.outcome;

      return formatSuccess(res, {
        pilotId: pilot.id,
        outcome: evaluation.outcome,
        rationale: evaluation.rationale
      }, 'Pilot evaluated successfully');
    } catch (error) {
      return formatError(res, error.message);
    }
  }

  /**
   * Get 22-Section Pilot Completion Report (Section 22)
   */
  async getCompletionReport(req, res) {
    try {
      const { id } = req.params;
      const pilot = memoryPilots.find(p => p.id === id);
      if (!pilot) {
        return formatError(res, 'Pilot not found', 404);
      }

      const report = documentService.generate22SectionReport(pilot);
      return formatSuccess(res, report, '22-Section Pilot Completion Report generated successfully');
    } catch (error) {
      return formatError(res, error.message);
    }
  }
}

module.exports = new PilotController();

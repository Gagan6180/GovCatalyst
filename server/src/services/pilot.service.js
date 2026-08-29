/**
 * SIH26136 Pilot Module - Pilot Service (Canonical Business Logic)
 * GovCatalyst Government Innovation Procurement
 */

const { isValidTransition, getNextStates } = require('../utils/stateMachine');
const auditService = require('./audit.service');

class PilotService {
  /**
   * Validate state transition
   */
  canTransition(currentStatus, targetStatus) {
    return isValidTransition(currentStatus, targetStatus);
  }

  /**
   * Get allowed next statuses
   */
  getAllowedNextStatuses(currentStatus) {
    return getNextStates(currentStatus);
  }

  /**
   * Calculate KPI values, percentage improvement and RAG indicator
   * Formula:
   * Lower-is-better: ((Baseline - Current) / Baseline) * 100
   * Higher-is-better: ((Current - Baseline) / Baseline) * 100
   * RAG Indicator:
   * - GREEN: Target reached or on track (>= 100% of trajectory)
   * - YELLOW: Behind target but within minimum acceptable threshold
   * - RED: Severely lagging or below minimum acceptable threshold
   */
  calculateKPIImprovement(baseline, current, target, minAcceptable, direction = 'LOWER_IS_BETTER') {
    const numBaseline = parseFloat(baseline);
    const numCurrent = parseFloat(current);
    const numTarget = parseFloat(target);
    const numMin = parseFloat(minAcceptable);

    if (isNaN(numBaseline) || isNaN(numCurrent) || numBaseline === 0) {
      return { improvementPercent: 0, status: 'UNKNOWN', rag: 'RED', progressPercent: 0 };
    }

    let improvement = 0;
    let isAchieved = false;
    let progressPercent = 0;

    if (direction === 'LOWER_IS_BETTER') {
      improvement = ((numBaseline - numCurrent) / numBaseline) * 100;
      isAchieved = numCurrent <= numTarget;
      const targetDelta = numBaseline - numTarget;
      const actualDelta = numBaseline - numCurrent;
      progressPercent = targetDelta !== 0 ? (actualDelta / targetDelta) * 100 : (isAchieved ? 100 : 0);
    } else {
      improvement = ((numCurrent - numBaseline) / numBaseline) * 100;
      isAchieved = numCurrent >= numTarget;
      const targetDelta = numTarget - numBaseline;
      const actualDelta = numCurrent - numBaseline;
      progressPercent = targetDelta !== 0 ? (actualDelta / targetDelta) * 100 : (isAchieved ? 100 : 0);
    }

    const improvementPercent = Math.round(improvement * 100) / 100;
    const clampedProgress = Math.round(Math.max(0, Math.min(progressPercent, 150)) * 10) / 10;

    let status = 'AT_RISK';
    let rag = 'YELLOW';

    if (isAchieved) {
      status = 'ACHIEVED';
      rag = 'GREEN';
    } else if (direction === 'LOWER_IS_BETTER' ? numCurrent <= numMin : numCurrent >= numMin) {
      status = 'ON_TRACK';
      rag = clampedProgress >= 75 ? 'GREEN' : 'YELLOW';
    } else {
      status = 'CRITICAL_BEHIND';
      rag = 'RED';
    }

    return {
      improvementPercent,
      progressPercent: clampedProgress,
      status,
      rag,
      isAchieved
    };
  }

  /**
   * Evaluate whether a newly ingested telemetry reading triggers an alert
   */
  evaluateTelemetryAlert(kpi, readingValue) {
    const numValue = parseFloat(readingValue);
    const numBaseline = parseFloat(kpi.baseline);
    const numTarget = parseFloat(kpi.target);
    const numMin = parseFloat(kpi.min_acceptable || kpi.minAcceptable || kpi.target);
    const direction = kpi.direction || 'LOWER_IS_BETTER';

    const kpiName = kpi.name || 'KPI Metric';
    const unit = kpi.unit || '';

    let isBehind = false;
    let severity = 'INFO';
    let variancePct = 0;
    let message = '';

    if (direction === 'LOWER_IS_BETTER') {
      if (numValue > numMin) {
        isBehind = true;
        severity = numValue > numBaseline ? 'CRITICAL' : 'WARNING';
        variancePct = Math.round(((numValue - numTarget) / (numBaseline - numTarget || 1)) * 100);
        message = `${kpiName} is lagging behind target. Current value is ${numValue} ${unit}, exceeding maximum threshold ${numMin} ${unit}.`;
      }
    } else {
      if (numValue < numMin) {
        isBehind = true;
        severity = numValue < numBaseline ? 'CRITICAL' : 'WARNING';
        variancePct = Math.round(((numTarget - numValue) / (numTarget - numBaseline || 1)) * 100);
        message = `${kpiName} is ${variancePct}% below the expected target milestone. Current value is ${numValue} ${unit} (Minimum target: ${numMin} ${unit}).`;
      }
    }

    return {
      hasAlert: isBehind,
      severity,
      title: `${severity === 'CRITICAL' ? 'Critical SLA Breach' : 'Target Threshold Warning'}: ${kpiName}`,
      message,
      expectedValue: numTarget,
      actualValue: numValue,
      variancePct
    };
  }

  /**
   * Evaluate 14-point cybersecurity checklist
   * Gating: Blocks pilot activation if any critical unresolved security check fails
   */
  evaluateSecurityGate(checklist) {
    if (!Array.isArray(checklist) || checklist.length === 0) {
      return {
        canActivate: false,
        securityStatus: 'CRITICAL RISK',
        failedCriticalChecks: ['Security checklist not populated']
      };
    }

    const failedCritical = checklist.filter(c => c.severity === 'CRITICAL' && !c.status);
    const totalChecks = checklist.length;
    const passedChecks = checklist.filter(c => c.status).length;

    let securityStatus = 'LOW RISK';
    if (failedCritical.length > 0) {
      securityStatus = 'CRITICAL RISK';
    } else if (passedChecks < totalChecks * 0.8) {
      securityStatus = 'MEDIUM RISK';
    }

    return {
      canActivate: failedCritical.length === 0,
      securityStatus,
      totalChecks,
      passedChecks,
      failedCriticalChecks: failedCritical.map(c => c.title || c.id)
    };
  }

  /**
   * Automated Pilot Result Engine
   * Multi-factor outcome & Recommendation Calculator:
   * - SCALE: Targets achieved, no open critical risks, security passed
   * - MODIFY & RETEST: Partial success / near targets, manageable risks
   * - STOP: Failure to achieve core KPIs, unresolved critical risks or security failure
   */
  calculateAutomatedOutcome(kpis = [], risks = [], securityStatus = 'LOW RISK') {
    const totalKpis = kpis.length || 1;
    const achievedCount = kpis.filter(k => k.status === 'ACHIEVED' || k.rag === 'GREEN').length;
    const atRiskCount = kpis.filter(k => k.status === 'CRITICAL_BEHIND' || k.rag === 'RED').length;
    const targetAchievementScore = Math.round((achievedCount / totalKpis) * 100);

    const hasCriticalRisk = risks.some(r => r.level === 'Critical' && r.status === 'Open');
    const securityPassed = securityStatus === 'LOW RISK' || securityStatus === 'MEDIUM RISK';

    let recommendation = 'STOP';
    let outcome = 'FAILED';
    let rationale = '';
    let procurementAction = '';

    if (targetAchievementScore >= 80 && !hasCriticalRisk && securityPassed) {
      recommendation = 'SCALE';
      outcome = 'SUCCESSFUL';
      rationale = `High performance: ${targetAchievementScore}% target KPI achievement with zero critical risks and verified security clearance.`;
      procurementAction = 'Issue GFR Rule 194 Direct Innovation Procurement / Commercial Scale-up Contract.';
    } else if (targetAchievementScore >= 50 && !hasCriticalRisk) {
      recommendation = 'MODIFY & RETEST';
      outcome = 'PARTIALLY_SUCCESSFUL';
      rationale = `Moderate performance: ${targetAchievementScore}% KPI achievement. Refinement of operational parameters or second trial iteration advised.`;
      procurementAction = 'Extend sandbox period by 30–60 days with modified parameter thresholds.';
    } else {
      recommendation = 'STOP';
      outcome = 'FAILED';
      rationale = hasCriticalRisk
        ? 'Unmitigated critical risks present during trial execution.'
        : `Insufficient outcome achievement (${targetAchievementScore}% target attainment).`;
      procurementAction = 'Close sandbox pilot trial without commercial procurement transition.';
    }

    return {
      outcome,
      recommendation,
      targetAchievementScore,
      achievedCount,
      totalKpis,
      hasCriticalRisk,
      securityPassed,
      rationale,
      procurementAction
    };
  }

  /**
   * Generate Full Structured Pilot Evaluation Report
   */
  generateEvaluationReport(pilot, kpis = [], risks = [], evidences = [], feedbacks = []) {
    const outcomeAnalysis = this.calculateAutomatedOutcome(kpis, risks, pilot.security_status || pilot.securityStatus);
    const avgSatisfaction = this.calculateFeedbackAverage(feedbacks);

    const kpiSummary = kpis.map(k => {
      const imp = this.calculateKPIImprovement(k.baseline, k.current, k.target, k.min_acceptable || k.minAcceptable, k.direction);
      return {
        id: k.id,
        code: k.kpi_code || k.kpiCode,
        name: k.name,
        category: k.category,
        unit: k.unit,
        baseline: parseFloat(k.baseline),
        target: parseFloat(k.target),
        actual: parseFloat(k.current),
        improvementPercent: imp.improvementPercent,
        progressPercent: imp.progressPercent,
        rag: imp.rag,
        status: imp.status
      };
    });

    const verifiedEvidences = evidences.filter(e => e.verification_status === 'Verified' || e.verificationStatus === 'Verified').length;

    return {
      reportId: `EVAL-REP-${pilot.pilot_code || pilot.id.slice(0, 8).toUpperCase()}`,
      generatedAt: new Date().toISOString(),
      pilot: {
        id: pilot.id,
        code: pilot.pilot_code || pilot.pilotCode,
        name: pilot.name,
        department: pilot.department,
        startup: pilot.startup,
        solution: pilot.solution,
        objective: pilot.objective,
        location: pilot.location,
        startDate: pilot.start_date || pilot.startDate,
        endDate: pilot.end_date || pilot.endDate,
        budgetAllocated: parseFloat(pilot.budget_allocated || pilot.budgetAllocated || 0),
        budgetSpent: parseFloat(pilot.budget_spent || pilot.budgetSpent || 0)
      },
      evaluation: {
        targetAchievementScore: outcomeAnalysis.targetAchievementScore,
        outcome: outcomeAnalysis.outcome,
        recommendation: outcomeAnalysis.recommendation,
        rationale: outcomeAnalysis.rationale,
        procurementAction: outcomeAnalysis.procurementAction,
        kpiAchievementRate: `${outcomeAnalysis.achievedCount}/${outcomeAnalysis.totalKpis} KPIs on Track`,
        averageSatisfaction: avgSatisfaction,
        evidenceCount: evidences.length,
        verifiedEvidenceCount: verifiedEvidences,
        openRisksCount: risks.filter(r => r.status === 'Open').length
      },
      kpiMatrix: kpiSummary,
      evidenceLedger: evidences,
      riskMatrix: risks
    };
  }

  /**
   * Calculate User Satisfaction Composite
   */
  calculateFeedbackAverage(feedbackList = []) {
    if (!Array.isArray(feedbackList) || feedbackList.length === 0) return 0;
    const sum = feedbackList.reduce((acc, f) => acc + (parseFloat(f.overall_satisfaction || f.overallSatisfaction) || 0), 0);
    return Math.round((sum / feedbackList.length) * 10) / 10;
  }
}

module.exports = new PilotService();

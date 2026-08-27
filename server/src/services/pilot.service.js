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
   * Calculate KPI values and percentage improvement
   * Formula:
   * Lower-is-better: ((Baseline - Current) / Baseline) * 100
   * Higher-is-better: ((Current - Baseline) / Baseline) * 100
   */
  calculateKPIImprovement(baseline, current, target, minAcceptable, direction = 'LOWER_IS_BETTER') {
    const numBaseline = parseFloat(baseline);
    const numCurrent = parseFloat(current);
    const numTarget = parseFloat(target);
    const numMin = parseFloat(minAcceptable);

    if (isNaN(numBaseline) || isNaN(numCurrent) || numBaseline === 0) {
      return { improvementPercent: 0, status: 'UNKNOWN' };
    }

    let improvement = 0;
    let isAchieved = false;

    if (direction === 'LOWER_IS_BETTER') {
      improvement = ((numBaseline - numCurrent) / numBaseline) * 100;
      isAchieved = numCurrent <= numTarget;
    } else {
      improvement = ((numCurrent - numBaseline) / numBaseline) * 100;
      isAchieved = numCurrent >= numTarget;
    }

    const improvementPercent = Math.round(improvement * 100) / 100;
    const status = isAchieved ? 'ACHIEVED' : (numCurrent >= numMin ? 'ON_TRACK' : 'AT_RISK');

    return {
      improvementPercent,
      status,
      isAchieved
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
   * Automated Pilot Result Engine (Section 19)
   * Multi-factor outcome calculator
   */
  calculateAutomatedOutcome(kpis = [], risks = [], securityStatus = 'LOW RISK') {
    const allKpisAchieved = kpis.length > 0 && kpis.every(k => k.status === 'ACHIEVED');
    const someKpisAchieved = kpis.some(k => k.status === 'ACHIEVED' || k.status === 'ON_TRACK');
    const hasCriticalRisk = risks.some(r => r.level === 'Critical' && r.status === 'Open');
    const securityPassed = securityStatus === 'LOW RISK' || securityStatus === 'MEDIUM RISK';

    if (allKpisAchieved && !hasCriticalRisk && securityPassed) {
      return {
        outcome: 'SUCCESSFUL',
        rationale: 'All defined target KPIs were successfully achieved without security or operational failures.'
      };
    } else if (someKpisAchieved && !hasCriticalRisk) {
      return {
        outcome: 'PARTIALLY_SUCCESSFUL',
        rationale: 'Core KPIs partially met; refinement or timeline extension recommended.'
      };
    } else {
      return {
        outcome: 'FAILED',
        rationale: 'Major KPIs not achieved, critical unresolved risks present, or security clearance failed.'
      };
    }
  }

  /**
   * Calculate User Satisfaction Composite
   */
  calculateFeedbackAverage(feedbackList = []) {
    if (!Array.isArray(feedbackList) || feedbackList.length === 0) return 0;
    const sum = feedbackList.reduce((acc, f) => acc + (parseFloat(f.overallSatisfaction) || 0), 0);
    return Math.round((sum / feedbackList.length) * 10) / 10;
  }
}

module.exports = new PilotService();

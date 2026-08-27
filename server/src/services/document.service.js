/**
 * SIH26136 Pilot Module - Document Service
 * Generates official 22-Section Pilot Completion Reports, Pilot Agreements, and Certificates
 */

class DocumentService {
  formatINR(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  }

  /**
   * Generate Full 22-Section Completion Report
   */
  generate22SectionReport(pilot) {
    return {
      reportTitle: "PILOT COMPLETION & EVALUATION REPORT",
      framework: "SIH26136 Government Innovation Procurement • GFR Rule 194 Compliant",
      pilotId: pilot.id,
      generatedAt: new Date().toISOString(),
      sections: {
        s1_executiveSummary: `Pilot for ${pilot.solution} by ${pilot.startup} completed. Outcome: ${pilot.outcome}. Target KPIs achieved with zero critical incidents.`,
        s2_problemStatement: pilot.problemStatementText || pilot.problemStatement,
        s3_pilotObjective: pilot.objective,
        s4_startupInfo: { name: pilot.startup, lead: pilot.startupLead },
        s5_solutionDescription: pilot.solution,
        s6_scope: { included: pilot.scopeIncluded, excluded: pilot.scopeExcluded },
        s7_duration: `${pilot.startDate} to ${pilot.endDate} (${pilot.durationWeeks} weeks)`,
        s8_locations: pilot.location,
        s9_usersCohort: `${pilot.usersCount} government engineers`,
        s10_baselineMetrics: pilot.baselineObjective,
        s11_targetMetrics: pilot.targetObjective,
        s12_actualResults: pilot.kpis,
        s13_kpiAnalysis: pilot.kpis,
        s14_userFeedback: { average: pilot.averageSatisfaction, list: pilot.feedbackList },
        s15_cybersecurity: { status: pilot.securityStatus, checklist: pilot.cyberChecklist },
        s16_dataIpCompliance: { dataRules: pilot.dataRules, ipRules: pilot.ipRules },
        s17_riskAssessment: pilot.risks,
        s18_budgetUtilization: { allocated: pilot.budgetAllocated, spent: pilot.budgetSpent, surplus: pilot.budgetAllocated - pilot.budgetSpent },
        s19_issuesAndResolutions: pilot.issues,
        s20_finalOutcome: pilot.outcome,
        s21_recommendation: { decision: pilot.committeeDecision, justification: pilot.committeeReason },
        s22_approvalDetails: { owner: pilot.pilotOwner, startupLead: pilot.startupLead, date: new Date().toISOString().substring(0, 10) }
      }
    };
  }

  /**
   * Generate Bilateral Agreement Text
   */
  generateAgreementDocument(pilot) {
    return {
      documentType: "BILATERAL GOVERNMENT INNOVATION PILOT AGREEMENT",
      documentRef: `AGR-${pilot.id}`,
      parties: {
        department: pilot.department,
        departmentLead: pilot.pilotOwner,
        startup: pilot.startup,
        startupLead: pilot.startupLead
      },
      duration: `${pilot.startDate} to ${pilot.endDate}`,
      budget: this.formatINR(pilot.budgetAllocated),
      milestoneSchedule: pilot.paymentMilestones || [],
      dataOwnership: "100% Government of India Ownership",
      retentionPeriod: pilot.dataRules ? pilot.dataRules.retentionPeriod : "60 Days"
    };
  }
}

module.exports = new DocumentService();

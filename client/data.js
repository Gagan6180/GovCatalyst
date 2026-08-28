/**
 * SIH26136 Pilot Module - GovCatalyst Data Store & Sample Scenarios
 * Implements full schema for Startup-Friendly Government Innovation Procurement
 */

const SIH_DATA = {
  // Pre-loaded Official Demo Scenario (Section 25)
  demoPilot: {
    id: "PILOT-2026-INFR-001",
    name: "AI-Powered Highway & Bridge Infrastructure Inspection Pilot",
    problemStatement: "PS-2026-NHAI-042: Manual visual inspection of concrete bridges and highway overpasses is slow, hazardous, and takes an average of 10 hours per bridge deck with subjective error rates.",
    department: "National Highways Authority & Ministry of Road Transport",
    startup: "InspectAI Technologies Pvt Ltd (Startup A)",
    startupLead: "Dr. Vikram Sen (Chief Technology Officer)",
    solution: "Autonomous Drone Computer-Vision Defect Detection & Structural Assessment System",
    objective: "Test whether the startup's AI-based infrastructure inspection solution can reduce inspection time while maintaining acceptable inspection accuracy.",
    baselineObjective: "10 hours per bridge inspection.",
    targetObjective: "At least 40% reduction in inspection time (6 hours or less).",
    minAcceptableResult: "30% reduction (7 hours or less).",
    successCondition: "Target KPIs are achieved without critical security, safety or operational failures.",
    location: "NH-48 Corridor (Sector 12, 18, and 24 Bridge Overpasses)",
    startDate: "2026-06-01",
    endDate: "2026-07-27",
    durationWeeks: 8,
    usersCount: 10,
    scopeIncluded: [
      "3 government highway bridge locations",
      "100 inspection cases across span decks",
      "10 certified government highway engineers & inspectors",
      "Edge-AI automated crack & spalling detection",
      "Existing government GIS & asset workflow integration",
      "Continuous performance measurement & telemetry",
      "Bi-weekly structured user feedback cycles"
    ],
    scopeExcluded: [
      "Full state-wide highway network deployment",
      "Permanent government asset procurement commitment",
      "Large-scale permanent civil infrastructure changes",
      "Unapproved commercial or model-training data usage",
      "Production deployment beyond designated test zones"
    ],
    budgetAllocated: 500000,
    budgetSpent: 460000,
    pilotOwner: "Shri Rajesh Verma (Chief Engineer, Quality & Standards)",
    status: "COMPLETED", // DRAFT, AGREEMENT_PENDING, AGREEMENT_APPROVED, SECURITY_CHECK, DATA_IP_CHECK, READY_FOR_DEPLOYMENT, DEPLOYMENT, ACTIVE_PILOT, MONITORING, PILOT_COMPLETED, EVALUATION, SUCCESSFUL
    outcome: "SUCCESSFUL", // SUCCESSFUL, PARTIALLY_SUCCESSFUL, FAILED
    committeeDecision: "SCALE", // SCALE, EXTEND, MODIFY, RE_PILOT, REJECT
    committeeReason: "The AI solution delivered exceptional operational efficiencies, reducing bridge inspection time by 42% while surpassing target accuracy (91% vs 90% target) with zero critical safety or cybersecurity incidents.",
    committeeRecommendation: "Proceed to scale-up and commercial procurement across 12 highway divisions under GFR Rule 194 / Innovation Procurement Framework.",
    
    // 5-Phase Plan (Section 4)
    phases: [
      {
        id: 1,
        name: "PHASE 1 — PREPARATION",
        status: "COMPLETED",
        tasks: [
          { name: "Finalize pilot agreement & indemnity clauses", status: "COMPLETED" },
          { name: "Verify startup DPIIT certification & tax clearances", status: "COMPLETED" },
          { name: "Complete 14-point cybersecurity assessment", status: "COMPLETED" },
          { name: "Execute bilateral data governance & IP agreement", status: "COMPLETED" },
          { name: "Configure edge servers & cloud gateway", status: "COMPLETED" },
          { name: "Train 10 government inspection engineers", status: "COMPLETED" },
          { name: "Establish baseline telemetry (10 hrs / 82% accuracy)", status: "COMPLETED" }
        ]
      },
      {
        id: 2,
        name: "PHASE 2 — DEPLOYMENT",
        status: "COMPLETED",
        tasks: [
          { name: "Deploy startup drone fleet & image pipeline", status: "COMPLETED" },
          { name: "Configure field base station infrastructure", status: "COMPLETED" },
          { name: "Connect approved GIS bridge registry APIs", status: "COMPLETED" },
          { name: "Create RBAC accounts for government inspectors", status: "COMPLETED" },
          { name: "Perform technical end-to-end sandbox testing", status: "COMPLETED" },
          { name: "Perform penetration & telemetry security testing", status: "COMPLETED" }
        ]
      },
      {
        id: 3,
        name: "PHASE 3 — CONTROLLED PILOT",
        status: "COMPLETED",
        tasks: [
          { name: "Initiate live inspections at 3 pilot bridge zones", status: "COMPLETED" },
          { name: "Monitor daily system uptime & drone telemetry", status: "COMPLETED" },
          { name: "Record real-world inspection cycle times", status: "COMPLETED" },
          { name: "Log field issues & defect false-positive rates", status: "COMPLETED" },
          { name: "Track automated KPI benchmarks against baseline", status: "COMPLETED" },
          { name: "Collect structured inspector satisfaction feedback", status: "COMPLETED" }
        ]
      },
      {
        id: 4,
        name: "PHASE 4 — EVALUATION",
        status: "COMPLETED",
        tasks: [
          { name: "Compare baseline (10h) with pilot results (5.8h)", status: "COMPLETED" },
          { name: "Calculate 42% inspection time efficiency gain", status: "COMPLETED" },
          { name: "Review vulnerability & incident response logs (0 issues)", status: "COMPLETED" },
          { name: "Audit operational safety protocols during live flights", status: "COMPLETED" },
          { name: "Reconcile pilot expenditures (₹4,60,000 / ₹5,00,000)", status: "COMPLETED" },
          { name: "Collect final committee & field stakeholder sign-offs", status: "COMPLETED" }
        ]
      },
      {
        id: 5,
        name: "PHASE 5 — FINAL DECISION",
        status: "COMPLETED",
        tasks: [
          { name: "Formulate automated multi-factor outcome (SUCCESSFUL)", status: "COMPLETED" },
          { name: "Convene Innovation Procurement Evaluation Committee", status: "COMPLETED" },
          { name: "Evaluate scale-up feasibility & commercial unit pricing", status: "COMPLETED" },
          { name: "Issue formal SCALE-UP recommendation & completion report", status: "COMPLETED" }
        ]
      }
    ],

    // Payment Milestones (Section 6)
    paymentMilestones: [
      {
        id: "M1",
        title: "Milestone 1: Pilot setup, agreement & security clearance",
        percentage: 20,
        amount: 100000,
        status: "PAID",
        evidence: "DOC-M1-AGREEMENT-SIGNED.pdf",
        verificationDate: "2026-06-05",
        approvedBy: "Shri Rajesh Verma (Pilot Owner)",
        paymentRef: "PFMS-TXN-9982341",
        notes: "Agreement executed, DPIIT papers verified, 14-point cybersecurity checklist cleared with Low Risk score."
      },
      {
        id: "M2",
        title: "Milestone 2: System deployment & technical validation",
        percentage: 20,
        amount: 100000,
        status: "PAID",
        evidence: "DOC-M2-DEPLOYMENT-LOGS.pdf",
        verificationDate: "2026-06-20",
        approvedBy: "Priya Sharma (Tech Director)",
        paymentRef: "PFMS-TXN-9985512",
        notes: "Drone gateway integrated with GIS, 10 inspector credentials provisioned, sandbox test passed with 100% telemetry success."
      },
      {
        id: "M3",
        title: "Milestone 3: Controlled pilot execution (100 inspections)",
        percentage: 30,
        amount: 150000,
        status: "PAID",
        evidence: "DOC-M3-INSPECTION-RECORDS.pdf",
        verificationDate: "2026-07-18",
        approvedBy: "Shri Rajesh Verma (Pilot Owner)",
        paymentRef: "PFMS-TXN-9990145",
        notes: "100 bridge deck inspections executed across 3 locations. Real-world runtime average clocked at 5.8 hours per inspection."
      },
      {
        id: "M4",
        title: "Milestone 4: Final evaluation report & scale-up clearance",
        percentage: 30,
        amount: 110000,
        status: "PAID",
        evidence: "DOC-M4-FINAL-EVALUATION-REPORT.pdf",
        verificationDate: "2026-07-27",
        approvedBy: "Committee Chairperson",
        paymentRef: "PFMS-TXN-9994820",
        notes: "Final 22-section report submitted and approved. Total pilot expenditure closed at ₹4,60,000 with ₹40,000 unspent surplus returned to Treasury."
      }
    ],

    // Data & IP Governance (Section 7, 8)
    dataRules: {
      accessScope: "Strictly limited to geo-spatial bridge deck imagery, asset metadata, and defect logs for Sector 12, 18, and 24 overpasses.",
      ownership: "100% Government of India / NHAI Ownership. Startup has zero proprietary claim over raw or processed bridge telemetry.",
      purposeLimitation: "Telemetry and imagery may be used solely for evaluating crack detection accuracy in this pilot.",
      sharingRestrictions: "Strictly prohibited from transferring, publishing, or sharing with any third-party cloud or offshore repository.",
      retentionPeriod: "60 Days post-pilot completion",
      deletionProtocol: "Cryptographic sanitization and certified data wipe verified by Ministry Cyber Cell on 2026-08-15."
    },
    ipRules: {
      startupExistingIP: "Pre-existing core computer vision algorithms, flight path planners, and neural weights remain InspectAI IP.",
      govtExistingIP: "National Highway GIS maps, bridge design blueprints, and historical safety ratings remain Government IP.",
      pilotOutputs: "Inspection reports, defect taxonomy annotations, benchmark datasets, and CAD overlays co-licensed for NHAI operational use without royalty.",
      ipSignoffStatus: "ACKNOWLEDGED_BY_BOTH_PARTIES"
    },

    // 14-Point Cybersecurity Checklist (Section 9)
    cyberChecklist: [
      { id: "SEC-01", title: "Authentication implemented (Multi-Factor / PKI)", status: true, severity: "CRITICAL", notes: "NIC SSO integration with mandatory TOTP" },
      { id: "SEC-02", title: "Role-based access control (RBAC) implemented", status: true, severity: "CRITICAL", notes: "Strict separation between Inspector, Supervisor, and Admin" },
      { id: "SEC-03", title: "Encryption in transit (TLS 1.3)", status: true, severity: "CRITICAL", notes: "All drone telemetry encrypted via TLS 1.3 / AES-GCM" },
      { id: "SEC-04", title: "Encryption at rest where required (AES-256)", status: true, severity: "HIGH", notes: "Storage volumes encrypted with HSM-managed keys" },
      { id: "SEC-05", title: "Secure API communication with HMAC / JWT", status: true, severity: "HIGH", notes: "Mutual TLS & rotating OAuth2 tokens" },
      { id: "SEC-06", title: "Comprehensive audit logging enabled", status: true, severity: "MEDIUM", notes: "Immutable append-only syslog streamed to Gov SIEM" },
      { id: "SEC-07", title: "Live access & anomaly monitoring enabled", status: true, severity: "HIGH", notes: "Automated alert for off-hours login or geofence breaches" },
      { id: "SEC-08", title: "Disaster recovery & backup mechanism defined", status: true, severity: "MEDIUM", notes: "Daily geo-redundant snapshots retained for 30 days" },
      { id: "SEC-09", title: "Vulnerability assessment (CERT-In) completed", status: true, severity: "CRITICAL", notes: "CERT-In empaneled auditor report clean, 0 high vulnerabilities" },
      { id: "SEC-10", title: "Incident response & breach notification SLA defined", status: true, severity: "HIGH", notes: "Mandatory 2-hour reporting SLA to Pilot Owner" },
      { id: "SEC-11", title: "Data minimization principles implemented", status: true, severity: "MEDIUM", notes: "Facial blurring & civilian license plate masking active" },
      { id: "SEC-12", title: "User access revocation process automated", status: true, severity: "HIGH", notes: "Instant 1-click credential kill-switch" },
      { id: "SEC-13", title: "Third-party vendor & dependency audit reviewed", status: true, severity: "MEDIUM", notes: "Software Bill of Materials (SBOM) scanned" },
      { id: "SEC-14", title: "Designated Security Contact identified", status: true, severity: "LOW", notes: "CISO Contact: ciso@inspectai.tech / +91-98765-43210" }
    ],
    securityStatus: "LOW RISK",

    // Risk Register (Section 10)
    risks: [
      {
        id: "RSK-01",
        description: "Startup drone sensor hardware or software fails during live highway flight over active traffic.",
        category: "Technical",
        probability: "Low",
        impact: "High",
        level: "Medium",
        mitigation: "Pre-flight geofenced safety nets, dual-redundant parachute system, and mandatory off-peak traffic flight windows.",
        owner: "Dr. Vikram Sen (Startup Lead)",
        status: "Mitigated"
      },
      {
        id: "RSK-02",
        description: "Adverse weather conditions (heavy rain/monsoon winds) delay the 8-week inspection schedule.",
        category: "Operational",
        probability: "Medium",
        impact: "Medium",
        level: "Medium",
        mitigation: "Built 10-day schedule buffer and IP67 weather-tolerant sensor pods for light precipitation.",
        owner: "Shri Rajesh Verma (Govt Owner)",
        status: "Mitigated"
      },
      {
        id: "RSK-03",
        description: "False positive crack classifications causing unnecessary manual re-inspections.",
        category: "Technical",
        probability: "Medium",
        impact: "Low",
        level: "Low",
        mitigation: "Active human-in-the-loop review threshold: classifications below 90% confidence queued for engineer confirmation.",
        owner: "InspectAI AI Team",
        status: "Closed"
      },
      {
        id: "RSK-04",
        description: "Data leakage or unauthorized cloud backup of bridge blueprints.",
        category: "Security",
        probability: "Low",
        impact: "High",
        level: "Low",
        mitigation: "Air-gapped on-prem processing node; no internet data backhaul of structural raw blueprints.",
        owner: "Cyber Officer",
        status: "Closed"
      }
    ],

    // 8 Standard Milestones (Section 11)
    milestones: [
      { id: 1, title: "Milestone 1: Pilot Agreement Approved", dueDate: "2026-06-03", responsible: "Govt Legal & Startup Lead", status: "COMPLETED", evidence: "Bilateral_Agreement_Signed.pdf", approved: true, timestamp: "2026-06-03 16:30" },
      { id: 2, title: "Milestone 2: Security and Data Checks Completed", dueDate: "2026-06-08", responsible: "Govt Cyber Officer", status: "COMPLETED", evidence: "CERTIn_Security_Audit_Pass.pdf", approved: true, timestamp: "2026-06-08 11:15" },
      { id: 3, title: "Milestone 3: System Deployment Completed", dueDate: "2026-06-15", responsible: "InspectAI Engineering Lead", status: "COMPLETED", evidence: "Edge_BaseStation_Deploy.pdf", approved: true, timestamp: "2026-06-15 14:00" },
      { id: 4, title: "Milestone 4: User Training Completed", dueDate: "2026-06-20", responsible: "Govt Training Coordinator", status: "COMPLETED", evidence: "10_Engineers_Cert_Sheet.pdf", approved: true, timestamp: "2026-06-20 17:45" },
      { id: 5, title: "Milestone 5: Controlled Pilot Started", dueDate: "2026-06-22", responsible: "Shri Rajesh Verma", status: "COMPLETED", evidence: "First_Flight_Telemetry_Log.json", approved: true, timestamp: "2026-06-22 09:30" },
      { id: 6, title: "Milestone 6: 50% Pilot Completed (50 Inspections)", dueDate: "2026-07-08", responsible: "Senior Field Inspector", status: "COMPLETED", evidence: "Mid_Pilot_Inspection_Batch.pdf", approved: true, timestamp: "2026-07-08 18:00" },
      { id: 7, title: "Milestone 7: Pilot Completed (100 Inspections)", dueDate: "2026-07-20", responsible: "InspectAI & Field Team", status: "COMPLETED", evidence: "100_Bridge_Dossiers.zip", approved: true, timestamp: "2026-07-20 15:20" },
      { id: 8, title: "Milestone 8: Final Evaluation Completed", dueDate: "2026-07-27", responsible: "Evaluation Committee", status: "COMPLETED", evidence: "Evaluation_Committee_Report.pdf", approved: true, timestamp: "2026-07-27 16:00" }
    ],

    // KPI Tracking Engine (Section 13)
    kpis: [
      {
        id: "KPI-1",
        name: "Inspection Time per Bridge Deck",
        category: "Efficiency",
        direction: "LOWER_IS_BETTER",
        unit: "hours",
        baseline: 10.0,
        current: 5.8,
        target: 6.0,
        minAcceptable: 7.0,
        improvementPercent: 42.0, // ((10 - 5.8)/10)*100 = 42%
        status: "ACHIEVED",
        historical: [
          { week: "Baseline", value: 10.0 },
          { week: "W1-W2", value: 8.4 },
          { week: "W3-W4", value: 7.1 },
          { week: "W5-W6", value: 6.2 },
          { week: "W7-W8", value: 5.8 }
        ]
      },
      {
        id: "KPI-2",
        name: "Inspection Defect Detection Accuracy",
        category: "Quality",
        direction: "HIGHER_IS_BETTER",
        unit: "%",
        baseline: 82.0,
        current: 91.0,
        target: 90.0,
        minAcceptable: 85.0,
        improvementPercent: 10.97, // percentage points: +9 pp
        status: "ACHIEVED",
        historical: [
          { week: "Baseline", value: 82.0 },
          { week: "W1-W2", value: 84.5 },
          { week: "W3-W4", value: 87.0 },
          { week: "W5-W6", value: 89.5 },
          { week: "W7-W8", value: 91.0 }
        ]
      },
      {
        id: "KPI-3",
        name: "Cost per Bridge Inspection",
        category: "Financial",
        direction: "LOWER_IS_BETTER",
        unit: "₹",
        baseline: 5000,
        current: 3200,
        target: 3500,
        minAcceptable: 4000,
        improvementPercent: 36.0, // ((5000 - 3200)/5000)*100 = 36%
        status: "ACHIEVED",
        historical: [
          { week: "Baseline", value: 5000 },
          { week: "W1-W2", value: 4600 },
          { week: "W3-W4", value: 4100 },
          { week: "W5-W6", value: 3600 },
          { week: "W7-W8", value: 3200 }
        ]
      }
    ],

    // Live Issue Management (Section 14)
    issues: [
      {
        id: "ISS-101",
        reportedBy: "Eng. Suresh Patil (Field Inspector)",
        date: "2026-06-25 10:30",
        category: "Technical",
        description: "Drone optical glare on northern girder of Sector 18 bridge during midday sun caused defect image washout.",
        severity: "Medium",
        assignedTo: "Karan Johar (Computer Vision Lead, InspectAI)",
        resolution: "Added polarized CPL optical filter to camera payload and recalibrated HDR auto-exposure curve.",
        status: "Resolved"
      },
      {
        id: "ISS-102",
        reportedBy: "Govt IT Officer",
        date: "2026-07-02 14:15",
        category: "Data",
        description: "GIS asset API sync timed out during bulk upload of 25 CAD overlays.",
        severity: "Low",
        assignedTo: "InspectAI Cloud Engineer",
        resolution: "Implemented retry queue with exponential backoff and chunked payload batching.",
        status: "Resolved"
      },
      {
        id: "ISS-103",
        reportedBy: "Eng. Ananya Roy",
        date: "2026-07-12 16:45",
        category: "User Experience",
        description: "Inspector dashboard PDF export cut off defect coordinate tables on A4 printout.",
        severity: "Low",
        assignedTo: "InspectAI UI Engineer",
        resolution: "Adjusted PDF CSS pagination and table margins for standardized print layout.",
        status: "Resolved"
      }
    ],

    // User Feedback (Section 15)
    feedbackList: [
      {
        id: "FB-01",
        user: "Shri Ashok Kumar (Executive Engineer, Zone 1)",
        role: "Senior Inspector",
        easeOfUse: 4,
        performance: 5,
        reliability: 4,
        accuracy: 5,
        overallSatisfaction: 5,
        comments: "The automated crack classification saved our field team at least 4 hours per bridge. Safety improvement is tremendous as inspectors no longer need scaffolding on high spans."
      },
      {
        id: "FB-02",
        user: "Eng. Suresh Patil",
        role: "Field Highway Engineer",
        easeOfUse: 4,
        performance: 4,
        reliability: 4,
        accuracy: 4,
        overallSatisfaction: 4,
        comments: "Very intuitive tablet interface. Once the polarizing filter was added, defect detection in high sunlight was pinpoint accurate."
      },
      {
        id: "FB-03",
        user: "Eng. Ananya Roy",
        role: "Quality Assurance Officer",
        easeOfUse: 5,
        performance: 5,
        reliability: 4,
        accuracy: 4,
        overallSatisfaction: 4.5,
        comments: "CAD annotation auto-export directly plugged into our state asset maintenance management database without manual re-entry."
      },
      {
        id: "FB-04",
        user: "Mohd. Tariq",
        role: "Site Safety Supervisor",
        easeOfUse: 4,
        performance: 4,
        reliability: 5,
        accuracy: 4,
        overallSatisfaction: 4.3,
        comments: "Zero safety incidents during all 100 drone missions. Geofencing and obstacle avoidance functioned reliably."
      }
    ],
    averageSatisfaction: 4.4,

    // Evidence Repository (Section 16)
    evidenceFiles: [
      { id: "EVD-01", name: "Sector12_Bridge_Deck_Crack_Map.png", type: "Image / CAD", uploadedBy: "InspectAI Tech", date: "2026-06-26", milestone: "Milestone 5", status: "Verified" },
      { id: "EVD-02", name: "CERTIn_Empaneled_Cyber_Audit_Report.pdf", type: "Security Report", uploadedBy: "Security Officer", date: "2026-06-08", milestone: "Milestone 2", status: "Verified" },
      { id: "EVD-03", name: "100_Bridge_Telemetry_Raw_Dataset.csv", type: "Performance Data", uploadedBy: "System Gateway", date: "2026-07-20", milestone: "Milestone 7", status: "Verified" },
      { id: "EVD-04", name: "10_Engineers_Training_Evaluation_Signoffs.pdf", type: "Training Sheet", uploadedBy: "Govt Coordinator", date: "2026-06-20", milestone: "Milestone 4", status: "Verified" },
      { id: "EVD-05", name: "Comparative_Time_And_Cost_Model.xlsx", type: "Financial Model", uploadedBy: "Finance Auditor", date: "2026-07-25", milestone: "Milestone 8", status: "Verified" }
    ],

    // Scale-Up Recommendation Model (Section 21)
    scaleUp: {
      pilotPerformance: "Target exceeded (42% time reduction vs 40% target; 91% accuracy vs 90% target)",
      targetAchievementPercent: 105,
      estimatedScaleCost: 28000000,
      expectedAnnualBenefit: "₹7.4 Crores annual savings in inspection labor & hazard insurance + 60% faster structural maintenance response",
      securityStatus: "Passed (14/14 checks verified; Low Risk profile)",
      riskStatus: "Low (All 4 identified risks closed or mitigated)",
      scalabilityRating: "High",
      procurementRoute: "GFR Rule 194 / Single-source Innovation Scale-Up upon successful pilot completion",
      scaleScope: "Deploy to 1,200 bridges across 12 State Highway Divisions over 24 months."
    },

    // Audit Trail (Section 23)
    auditTrail: [
      { id: 1, time: "2026-06-01 10:15", user: "Shri Rajesh Verma (Pilot Owner)", action: "Pilot Created", detail: "Created AI Infrastructure Inspection Pilot for InspectAI Technologies.", oldValue: "None", newValue: "DRAFT" },
      { id: 2, time: "2026-06-03 16:30", user: "Legal Director", action: "Pilot Agreement Executed", detail: "Both Government & Startup leads digitally signed bilateral pilot agreement.", oldValue: "DRAFT", newValue: "AGREEMENT_APPROVED" },
      { id: 3, time: "2026-06-08 11:15", user: "Security Officer", action: "Cybersecurity Checklist Approved", detail: "14 security checkpoints cleared with Low Risk certification.", oldValue: "AGREEMENT_APPROVED", newValue: "SECURITY_CHECK" },
      { id: 4, time: "2026-06-10 14:00", user: "Data Governance Lead", action: "Data/IP Agreement Sealed", detail: "Data retention set to 60 days; Govt retains 100% telemetry ownership.", oldValue: "SECURITY_CHECK", newValue: "READY_FOR_DEPLOYMENT" },
      { id: 5, time: "2026-06-15 15:30", user: "Finance Officer", action: "Disbursed Milestone 1 Payment", detail: "Released ₹1,00,000 (20%) upon setup & agreement signoff. Ref: PFMS-TXN-9982341.", oldValue: "Pending", newValue: "PAID" },
      { id: 6, time: "2026-06-20 18:00", user: "Finance Officer", action: "Disbursed Milestone 2 Payment", detail: "Released ₹1,00,000 (20%) upon system deployment & training. Ref: PFMS-TXN-9985512.", oldValue: "Pending", newValue: "PAID" },
      { id: 7, time: "2026-06-22 09:30", user: "Shri Rajesh Verma", action: "Pilot Activated", detail: "Commenced live drone inspection trial at Sector 12 Bridge Deck.", oldValue: "READY_FOR_DEPLOYMENT", newValue: "ACTIVE_PILOT" },
      { id: 8, time: "2026-07-18 17:00", user: "Finance Officer", action: "Disbursed Milestone 3 Payment", detail: "Released ₹1,50,000 (30%) after 100 inspections completed. Ref: PFMS-TXN-9990145.", oldValue: "Pending", newValue: "PAID" },
      { id: 9, time: "2026-07-27 16:30", user: "Evaluation Committee", action: "Final Evaluation Sealed", detail: "Pilot marked SUCCESSFUL (42% time reduction, 91% accuracy). SCALE-UP recommended.", oldValue: "ACTIVE_PILOT", newValue: "COMPLETED" },
      { id: 10, time: "2026-07-27 17:00", user: "Finance Officer", action: "Disbursed Milestone 4 & Reconciled Budget", detail: "Released final ₹1,10,000. Total spend ₹4,60,000. ₹40,000 surplus returned to Treasury. Ref: PFMS-TXN-9994820.", oldValue: "Pending", newValue: "PAID" }
    ]
  },

  departments: [
    "Ministry of Road Transport & Highways / NHAI",
    "Ministry of Health & Family Welfare",
    "Ministry of Housing & Urban Affairs",
    "Department of Agriculture & Farmers Welfare",
    "Ministry of Jal Shakti (Water Resources)",
    "Department of School Education & Literacy",
    "Ministry of Power & Renewable Energy"
  ],

  startups: [
    { name: "InspectAI Technologies Pvt Ltd", founder: "Dr. Vikram Sen", sector: "Infrastructure / Drone AI", dpiit: "DPIIT-78192" },
    { name: "MedPulse Telematics", founder: "Dr. Aarti Nair", sector: "Healthtech / Remote Diagnostics", dpiit: "DPIIT-65412" },
    { name: "UrbanFlow Mobility", founder: "Rohit Deshmukh", sector: "Smart Cities / Traffic AI", dpiit: "DPIIT-89104" },
    { name: "AgriVision Remote Sensing", founder: "Pooja Reddy", sector: "Agritech / Satellite Analytics", dpiit: "DPIIT-43901" },
    { name: "JalRakshak IoT Systems", founder: "Amit Singhania", sector: "Water Management / Smart Metering", dpiit: "DPIIT-91283" }
  ]
};

window.SIH_DATA = SIH_DATA;

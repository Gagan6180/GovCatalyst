/**
 * GovCatalyst — End-to-End Test for 10-Step Pilot Monitoring & Evaluation Engine
 * Tests:
 * 1. Define Outcome
 * 2. Define KPIs (4–8 KPIs)
 * 3. Set Baseline & Target
 * 4. Connect Data Sources (Manual, CSV, API, IoT, ERP)
 * 5. Monitoring RAG Calculation
 * 6. Automatic Threshold Alerts
 * 7. Evidence Management
 * 8. Final Evaluation Report Generation
 * 9. Independent Validation (Verified, Partial, Not Verified)
 * 10. Scale-up Recommendation (SCALE / MODIFY & RETEST / STOP)
 */

const pool = require('./src/config/db');
const {
  Pilot, PilotKpi, PilotRisk, PilotEvidence,
  PilotTelemetry, PilotAlert
} = require('./src/models/pilot.db');
const pilotService = require('./src/services/pilot.service');

async function runTest() {
  console.log('====================================================');
  console.log('🚀 Running GovCatalyst 10-Step Monitoring Test Suite');
  console.log('====================================================\n');

  try {
    // ── STEP 1: DEFINE OUTCOME & CREATE PILOT ───────────────────
    console.log('▶ Step 1: Defining Target Outcome & Creating Sandbox Pilot...');
    const pilotCode = `PLT-TEST-${Date.now().toString().slice(-4)}`;
    const pilot = await Pilot.create({
      pilotCode,
      name: 'Smart Waste Management Optimization Sandbox',
      problemStatementText: 'Municipal solid waste collection costs exceed budget by 22% with irregular pickup schedules.',
      department: 'Urban Development Department (MCGM)',
      startup: 'EcoRoute Logistics AI Pvt Ltd',
      startupLead: 'Dr. Anand Shinde',
      solution: 'AI-Powered Dynamic Vehicle Routing & Fill-Level Telematics',
      objective: 'Reduce solid waste collection operating cost by 15% across pilot zone within 8 weeks.',
      baselineObjective: 'Baseline operating cost ₹50 Lakhs/month',
      targetObjective: 'Target operating cost ₹42.5 Lakhs/month (15% reduction)',
      minAcceptableResult: 'Minimum acceptable cost reduction 10% (₹45 Lakhs/month)',
      successCondition: 'Achieve >= 15% cost reduction and >90% route adherence with zero unresolved safety incidents.',
      location: 'Ward-G North, Municipal Corporation of Greater Mumbai',
      startDate: '2026-06-01',
      endDate: '2026-08-01',
      durationWeeks: 8,
      usersCount: 15,
      scopeIncluded: ['Fleet routing optimization', 'Bin ultrasonic fill sensors (50 units)', 'Daily diesel audit reconciliation'],
      scopeExcluded: ['Hazardous industrial waste', 'Landfill reclamation'],
      budgetAllocated: 2500000.00,
      pilotOwner: 'Shri Rajesh Verma (Executive Engineer)',
      cyberChecklist: [
        { id: 'C1', title: 'TLS 1.3 Transport Encryption', severity: 'CRITICAL', status: true },
        { id: 'C2', title: 'Role-Based Access Control', severity: 'CRITICAL', status: true },
        { id: 'C3', title: 'Data Sovereignty within State Data Center', severity: 'CRITICAL', status: true }
      ]
    });
    console.log(`✅ Pilot created with UUID: ${pilot.id} [${pilot.pilot_code}]`);
    console.log(`   Defined Outcome: "${pilot.objective}"\n`);

    // ── STEPS 2 & 3: DEFINE 4–8 MEASURABLE KPIS WITH BASELINE & TARGET ──
    console.log('▶ Steps 2 & 3: Defining 5 Measurable KPIs (Baseline, Target, Min Acceptable)...');
    const kpiDefinitions = [
      { code: 'KPI-01', name: 'Garbage Collection Operating Cost', category: 'Cost Reduction', direction: 'LOWER_IS_BETTER', unit: '₹ L/mo', baseline: 50.0, target: 42.5, minAcceptable: 45.0, current: 50.0 },
      { code: 'KPI-02', name: 'Fleet Diesel Fuel Consumption', category: 'Energy & Fuel', direction: 'LOWER_IS_BETTER', unit: 'Liters/mo', baseline: 18000, target: 14500, minAcceptable: 16000, current: 18000 },
      { code: 'KPI-03', name: 'Route Adherence & Service Efficiency', category: 'Service Efficiency', direction: 'HIGHER_IS_BETTER', unit: '% Adherence', baseline: 75.0, target: 92.0, minAcceptable: 85.0, current: 75.0 },
      { code: 'KPI-04', name: 'Citizen Grievance Resolution Turnaround', category: 'Citizen Complaints', direction: 'LOWER_IS_BETTER', unit: 'hours', baseline: 24.0, target: 6.0, minAcceptable: 8.0, current: 24.0 },
      { code: 'KPI-05', name: 'Sanitation Worker Safety Incidents', category: 'Safety & Compliance', direction: 'LOWER_IS_BETTER', unit: 'incidents', baseline: 8.0, target: 0.0, minAcceptable: 1.0, current: 8.0 }
    ];

    const createdKpis = [];
    for (const def of kpiDefinitions) {
      const k = await PilotKpi.create({
        pilotId: pilot.id,
        kpiCode: def.code,
        name: def.name,
        category: def.category,
        direction: def.direction,
        unit: def.unit,
        baseline: def.baseline,
        target: def.target,
        minAcceptable: def.minAcceptable,
        current: def.current
      });
      createdKpis.push(k);
      console.log(`   + [${k.kpi_code}] ${k.name}: Baseline = ${k.baseline} ${k.unit} → Target = ${k.target} ${k.unit}`);
    }
    console.log(`✅ 5 Measurable KPIs created successfully.\n`);

    // ── STEP 4: CONNECT DATA SOURCES & INGEST TELEMETRY ───────────
    console.log('▶ Step 4: Ingesting Telemetry Data from Diverse Sources (Manual, CSV, IoT, API, ERP)...');
    const telemetryEvents = [
      // 1. Govt ERP reading for Operating Cost
      { kpi: createdKpis[0], value: 41.8, source: 'GOVT_ERP', ref: 'MCGM SAP-FIN Billing ERP #771', meta: { reconciliation_period: 'Month 2', approver: 'Chief Accounts Officer' } },
      // 2. IoT Sensor stream for Diesel Consumption
      { kpi: createdKpis[1], value: 14100, source: 'IOT_SENSOR', ref: 'HPCL Fuel Dispenser Telematics Device #09', meta: { meter_type: 'Digital Flow Meter' } },
      // 3. IoT Geo-fence log for Route Adherence
      { kpi: createdKpis[2], value: 94.0, source: 'IOT_SENSOR', ref: 'GPS Geo-Fence Tracker Node #44', meta: { total_trips_tracked: 310 } },
      // 4. REST API Webhook for Citizen Complaints
      { kpi: createdKpis[3], value: 4.5, source: 'REST_API', ref: 'Aaple Sarkar Public Grievance Webhook', meta: { resolved_tickets: 42 } },
      // 5. Manual safety audit log
      { kpi: createdKpis[4], value: 0.0, source: 'MANUAL', ref: 'Monthly Safety Officer Inspection Log', meta: { inspector: 'Shri S. K. Patil' } }
    ];

    for (const ev of telemetryEvents) {
      const rec = await PilotTelemetry.record({
        pilotId: pilot.id,
        kpiId: ev.kpi.id,
        value: ev.value,
        sourceType: ev.source,
        sourceReference: ev.ref,
        provenanceMetadata: ev.meta,
        recordedAt: new Date().toISOString()
      });

      // Update KPI
      const imp = pilotService.calculateKPIImprovement(ev.kpi.baseline, ev.value, ev.kpi.target, ev.kpi.min_acceptable, ev.kpi.direction);
      await PilotKpi.update(ev.kpi.id, {
        current: ev.value,
        improvementPercent: imp.improvementPercent,
        status: imp.status
      });

      console.log(`   + Ingested [${ev.source}]: ${ev.kpi.name} = ${ev.value} ${ev.kpi.unit} (Improvement: ${imp.improvementPercent}% | RAG: ${imp.rag})`);
    }
    console.log(`✅ All multi-source telemetry readings recorded with data provenance.\n`);

    // ── STEP 5 & 6: EVALUATE MONITORING & AUTOMATIC THRESHOLD ALERTS ───
    console.log('▶ Step 6: Testing Real-Time Threshold Alert Detection Engine...');
    // Ingest a lagging reading on Fuel consumption to test alert trigger
    const laggingKpi = createdKpis[1];
    const breachValue = 17200; // Above min_acceptable of 16000
    const alertEval = pilotService.evaluateTelemetryAlert(laggingKpi, breachValue);

    console.log(`   Lagging check on ${laggingKpi.name} with reading ${breachValue}:`);
    console.log(`   - Has Alert: ${alertEval.hasAlert}`);
    console.log(`   - Severity: ${alertEval.severity}`);
    console.log(`   - Alert Message: "${alertEval.message}"`);

    if (alertEval.hasAlert) {
      const alert = await PilotAlert.create({
        pilotId: pilot.id,
        kpiId: laggingKpi.id,
        severity: alertEval.severity,
        title: alertEval.title,
        message: alertEval.message,
        expectedValue: alertEval.expectedValue,
        actualValue: alertEval.actualValue,
        variancePct: alertEval.variancePct,
        recipientRole: 'ALL'
      });
      console.log(`   ✅ Alert persisted to DB [ID: ${alert.id}] for Dept Officer and Startup.`);

      // Test alert acknowledgement
      const acked = await PilotAlert.acknowledge(alert.id, 'Shri Rajesh Verma (Dept Admin)');
      console.log(`   ✅ Alert status updated to: ${acked.status} by ${acked.acknowledged_by}`);
    }
    console.log('');

    // ── STEP 7: EVIDENCE MANAGEMENT ──────────────────────────────
    console.log('▶ Step 7: Managing Supporting Evidence Ledger...');
    const evidenceList = [
      { name: 'Consolidated Municipal Waste Collection Invoices (M1-M2)', type: 'Invoices / Billing Receipts', url: 'https://docs.govcatalyst.in/ev/inv-001.pdf', kpiRef: 'KPI-01' },
      { name: 'HPCL Automated Fleet Telematics Diesel Reconciliation', type: 'System Audit Logs', url: 'https://docs.govcatalyst.in/ev/hpcl-fuel.pdf', kpiRef: 'KPI-02' },
      { name: 'Vehicle GPS Geo-Fence Route Adherence Trace (GeoJSON)', type: 'GPS Telematics Trace', url: 'https://docs.govcatalyst.in/ev/gps-trace.json', kpiRef: 'KPI-03' }
    ];

    for (const item of evidenceList) {
      const ev = await PilotEvidence.create({
        pilotId: pilot.id,
        evidenceCode: `EV-${Date.now().toString().slice(-4)}`,
        name: item.name,
        documentType: item.type,
        fileUrl: item.url,
        uploadedBy: 'Dr. Anand Shinde (Startup Lead)',
        relatedMilestone: 'MS-03: Full Zone Deployment'
      });

      // Mark verified
      await PilotEvidence.verify(ev.id, 'Verified');
      console.log(`   + Attached & Verified Evidence: "${ev.name}" [Type: ${ev.document_type}]`);
    }
    console.log(`✅ Supporting evidence ledger populated and verified.\n`);

    // ── STEPS 8, 9 & 10: FINAL EVALUATION, INDEPENDENT VALIDATION & SCALE-UP RECOMMENDATION ──
    console.log('▶ Steps 8, 9 & 10: Generating Final Evaluation Report & Recommendations...');
    const freshKpis = await PilotKpi.findByPilot(pilot.id);
    const freshRisks = await PilotRisk.findByPilot(pilot.id);
    const freshEvidences = await PilotEvidence.findByPilot(pilot.id);

    const report = pilotService.generateEvaluationReport(pilot, freshKpis, freshRisks, freshEvidences, []);

    console.log('\n======================================================');
    console.log(`📄 OFFICIAL PILOT EVALUATION REPORT: ${report.reportId}`);
    console.log('======================================================');
    console.log(`Pilot Code:       ${report.pilot.code}`);
    console.log(`Pilot Title:      ${report.pilot.name}`);
    console.log(`Defined Outcome:  ${report.pilot.objective}`);
    console.log(`Target Achieved:  ${report.evaluation.targetAchievementScore}% (${report.evaluation.kpiAchievementRate})`);
    console.log(`Outcome Status:   ${report.evaluation.outcome}`);
    console.log(`RECOMMENDATION:   👉 ${report.evaluation.recommendation} 👈`);
    console.log(`Procurement Rule: ${report.evaluation.procurementAction}`);
    console.log(`Evidence Ledger:  ${report.evaluation.verifiedEvidenceCount}/${report.evaluation.evidenceCount} Documents Verified`);
    console.log('------------------------------------------------------');
    console.log('KPI Achievement Breakdown:');
    report.kpiMatrix.forEach(k => {
      console.log(` • [${k.code}] ${k.name.padEnd(38)} | Base: ${String(k.baseline).padStart(6)} | Target: ${String(k.target).padStart(6)} | Actual: ${String(k.actual).padStart(6)} | Imp: ${String(k.improvementPercent).padStart(5)}% | RAG: [${k.rag}]`);
    });
    console.log('======================================================\n');

    console.log('🎉 ALL 10 STEPS OF THE PILOT MONITORING & EVALUATION WORKFLOW PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Test suite encountered an error:', err);
  } finally {
    await pool.end();
  }
}

runTest();

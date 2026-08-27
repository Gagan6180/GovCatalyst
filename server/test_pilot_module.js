/**
 * Verification Test Script for GovCatalyst Pilot Module
 * Performs unit tests and live HTTP endpoint integration tests
 */

const assert = require('assert');
const http = require('http');
const app = require('./src/app');
const pilotService = require('./src/services/pilot.service');
const documentService = require('./src/services/document.service');
const auditService = require('./src/services/audit.service');
const { isValidTransition, getNextStates } = require('./src/utils/stateMachine');

// Helper to make HTTP requests to the test server
function makeRequest(server, path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const address = server.address();
    const options = {
      hostname: '127.0.0.1',
      port: address.port,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runVerificationTests() {
  console.log('=== STARTING GOVCATALYST PILOT MODULE VERIFICATION ===\n');

  // Test 1: State Machine Transitions
  console.log('Test 1: Testing State Machine transitions...');
  assert.strictEqual(isValidTransition('DRAFT', 'AGREEMENT_PENDING'), true, 'DRAFT -> AGREEMENT_PENDING should be valid');
  assert.strictEqual(isValidTransition('DRAFT', 'ACTIVE_PILOT'), false, 'DRAFT -> ACTIVE_PILOT should be invalid');
  assert.strictEqual(isValidTransition('ACTIVE_PILOT', 'MONITORING'), true, 'ACTIVE_PILOT -> MONITORING should be valid');
  assert.strictEqual(isValidTransition('COMPLETED', 'SCALE'), true, 'COMPLETED -> SCALE should be valid');
  console.log('✓ Test 1 Passed: State Machine transitions validated.\n');

  // Test 2: KPI Mathematical Formula Calculation
  console.log('Test 2: Testing KPI Math Engine (Lower vs Higher is better)...');
  // Lower is better (Inspection Time: 10h baseline -> 5.8h current, target 6h)
  const timeKpi = pilotService.calculateKPIImprovement(10.0, 5.8, 6.0, 7.0, 'LOWER_IS_BETTER');
  assert.strictEqual(timeKpi.improvementPercent, 42.0, 'Inspection time reduction should be 42%');
  assert.strictEqual(timeKpi.status, 'ACHIEVED', 'Status should be ACHIEVED');
  assert.strictEqual(timeKpi.isAchieved, true, 'isAchieved should be true');

  // Higher is better (Accuracy: 82% baseline -> 91% current, target 90%)
  const accKpi = pilotService.calculateKPIImprovement(82.0, 91.0, 90.0, 85.0, 'HIGHER_IS_BETTER');
  assert.strictEqual(accKpi.status, 'ACHIEVED', 'Accuracy status should be ACHIEVED');
  console.log('✓ Test 2 Passed: KPI mathematical formulas calculated accurately (42% reduction, 91% accuracy).\n');

  // Test 3: 14-Point Cybersecurity Gating
  console.log('Test 3: Testing Cybersecurity Activation Gate...');
  const passingChecklist = [
    { id: 'SEC-01', title: 'Authentication', severity: 'CRITICAL', status: true },
    { id: 'SEC-02', title: 'RBAC', severity: 'CRITICAL', status: true },
    { id: 'SEC-03', title: 'Encryption in transit', severity: 'CRITICAL', status: true },
    { id: 'SEC-09', title: 'CERT-In Assessment', severity: 'CRITICAL', status: true }
  ];
  const passGate = pilotService.evaluateSecurityGate(passingChecklist);
  assert.strictEqual(passGate.canActivate, true, 'Should authorize activation when critical checks pass');
  assert.strictEqual(passGate.securityStatus, 'LOW RISK', 'Security status should be LOW RISK');

  const failingChecklist = [
    { id: 'SEC-01', title: 'Authentication', severity: 'CRITICAL', status: false },
    { id: 'SEC-02', title: 'RBAC', severity: 'CRITICAL', status: true }
  ];
  const failGate = pilotService.evaluateSecurityGate(failingChecklist);
  assert.strictEqual(failGate.canActivate, false, 'Should block activation when critical check fails');
  assert.strictEqual(failGate.securityStatus, 'CRITICAL RISK', 'Security status should be CRITICAL RISK');
  console.log('✓ Test 3 Passed: Cybersecurity clearance gate strictly blocks activation on critical risks.\n');

  // Test 4: Automated Outcome Determination
  console.log('Test 4: Testing Multi-factor Outcome Calculator (Section 19)...');
  const evaluatedOutcome = pilotService.calculateAutomatedOutcome(
    [{ status: 'ACHIEVED' }, { status: 'ACHIEVED' }],
    [{ level: 'Medium', status: 'Mitigated' }],
    'LOW RISK'
  );
  assert.strictEqual(evaluatedOutcome.outcome, 'SUCCESSFUL', 'Outcome should evaluate to SUCCESSFUL');
  console.log('✓ Test 4 Passed: Multi-factor outcome successfully evaluated as SUCCESSFUL.\n');

  // Test 5: 22-Section Completion Report Generator
  console.log('Test 5: Testing 22-Section Document Service Report...');
  const samplePilot = {
    id: 'PILOT-2026-INFR-001',
    solution: 'AI Drone Inspection Platform',
    startup: 'InspectAI',
    startupLead: 'Dr. Vikram Sen',
    department: 'NHAI',
    pilotOwner: 'Shri Rajesh Verma',
    outcome: 'SUCCESSFUL',
    objective: 'Test inspection time reduction',
    baselineObjective: '10 hours',
    targetObjective: '6 hours',
    location: 'NH-48 Corridor',
    startDate: '2026-06-01',
    endDate: '2026-07-27',
    durationWeeks: 8,
    usersCount: 10,
    budgetAllocated: 500000,
    budgetSpent: 460000,
    kpis: [{ name: 'Inspection Time', improvementPercent: 42 }],
    averageSatisfaction: 4.5,
    committeeDecision: 'SCALE',
    committeeReason: 'Exceeded target KPIs'
  };
  const doc = documentService.generate22SectionReport(samplePilot);
  assert.strictEqual(doc.reportTitle, 'PILOT COMPLETION & EVALUATION REPORT');
  assert.ok(doc.sections.s1_executiveSummary, 'Section 1 Executive Summary must exist');
  assert.ok(doc.sections.s22_approvalDetails, 'Section 22 Approval Details must exist');
  console.log('✓ Test 5 Passed: 22-Section completion report successfully structured.\n');

  // Test 6: Audit Service Ledger
  console.log('Test 6: Testing Forensic Audit Ledger...');
  const auditEntry = await auditService.logAction({
    pilotId: samplePilot.id,
    user: 'Shri Rajesh Verma',
    action: 'Unit Test Execution',
    detail: 'Verification test runner validation',
    oldValue: 'DRAFT',
    newValue: 'ACTIVE_PILOT'
  });
  assert.strictEqual(auditEntry.action, 'Unit Test Execution');
  assert.strictEqual(auditEntry.pilotId, samplePilot.id);
  console.log('✓ Test 6 Passed: Audit event successfully appended to immutable ledger.\n');

  // Test 7: Live HTTP Server & REST API Endpoints Verification
  console.log('Test 7: Testing Live Express Server and REST API Endpoints...');
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));

  try {
    // 7.1 Health Check
    const healthRes = await makeRequest(server, '/api/v1/health');
    assert.strictEqual(healthRes.status, 200, 'Health check should return 200');
    assert.strictEqual(healthRes.body.status, 'HEALTHY', 'Service should report HEALTHY');
    console.log('  ✓ GET /api/v1/health -> 200 OK');

    // 7.2 Root Endpoint
    const rootRes = await makeRequest(server, '/');
    assert.strictEqual(rootRes.status, 200, 'Root endpoint should return 200');
    console.log('  ✓ GET / -> 200 OK');

    // 7.3 List Pilots
    const listRes = await makeRequest(server, '/api/v1/pilots');
    assert.strictEqual(listRes.status, 200, 'List pilots should return 200');
    assert.ok(listRes.body.success, 'Response should indicate success');
    assert.ok(Array.isArray(listRes.body.data), 'Data should be an array');
    console.log('  ✓ GET /api/v1/pilots -> 200 OK');

    // 7.4 Get Single Pilot
    const getRes = await makeRequest(server, '/api/v1/pilots/PILOT-2026-INFR-001');
    assert.strictEqual(getRes.status, 200, 'Get single pilot should return 200');
    assert.strictEqual(getRes.body.data.id, 'PILOT-2026-INFR-001');
    console.log('  ✓ GET /api/v1/pilots/PILOT-2026-INFR-001 -> 200 OK');

    // 7.5 Create Pilot
    const createRes = await makeRequest(server, '/api/v1/pilots', 'POST', {
      name: 'Smart Water Grid IoT Pilot',
      problemStatement: 'Non-revenue water losses exceed 35%',
      department: 'Ministry of Jal Shakti',
      startup: 'JalRakshak IoT Systems',
      startupLead: 'Amit Singhania',
      solution: 'Acoustic IoT Leak Detection Sensors',
      objective: 'Detect pipe micro-leaks within 2 hours',
      baselineObjective: '48 hours detection time',
      targetObjective: '2 hours or less',
      minAcceptableResult: '6 hours',
      successCondition: '95% leak accuracy',
      location: 'Ward 7 Water Distribution Network',
      startDate: '2026-09-01',
      endDate: '2026-10-27',
      budgetAllocated: 350000,
      pilotOwner: 'Er. R. K. Sharma'
    });
    assert.strictEqual(createRes.status, 201, 'Create pilot should return 201');
    assert.ok(createRes.body.data.id, 'Created pilot must have an auto-generated ID');
    const createdPilotId = createRes.body.data.id;
    console.log(`  ✓ POST /api/v1/pilots -> 201 Created (ID: ${createdPilotId})`);

    // 7.6 State Transition (DRAFT -> AGREEMENT_PENDING)
    const statusRes = await makeRequest(server, `/api/v1/pilots/${createdPilotId}/status`, 'PATCH', {
      targetStatus: 'AGREEMENT_PENDING',
      reason: 'Draft finalized and submitted for bilateral signing'
    });
    assert.strictEqual(statusRes.status, 200, 'Status transition should return 200');
    assert.strictEqual(statusRes.body.data.status, 'AGREEMENT_PENDING');
    console.log('  ✓ PATCH /api/v1/pilots/:id/status -> 200 OK (Transition: DRAFT -> AGREEMENT_PENDING)');

    // 7.7 Evaluate Pilot
    const evalRes = await makeRequest(server, '/api/v1/pilots/PILOT-2026-INFR-001/evaluate');
    assert.strictEqual(evalRes.status, 200, 'Evaluate pilot should return 200');
    assert.strictEqual(evalRes.body.data.outcome, 'SUCCESSFUL');
    console.log('  ✓ GET /api/v1/pilots/PILOT-2026-INFR-001/evaluate -> 200 OK (Outcome: SUCCESSFUL)');

    // 7.8 22-Section Completion Report
    const reportRes = await makeRequest(server, '/api/v1/pilots/PILOT-2026-INFR-001/report');
    assert.strictEqual(reportRes.status, 200, 'Report generation should return 200');
    assert.ok(reportRes.body.data.sections.s1_executiveSummary, 'Section 1 must be present');
    console.log('  ✓ GET /api/v1/pilots/PILOT-2026-INFR-001/report -> 200 OK (22-Section Report Generated)');

    console.log('\n✓ Test 7 Passed: Live HTTP Server and all REST API endpoints verified 100%.\n');
  } finally {
    server.close();
  }

  console.log('====================================================');
  console.log('🎉 ALL 7 GOVCATALYST PILOT MODULE TESTS PASSED 100%!');
  console.log('====================================================');
}

runVerificationTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});

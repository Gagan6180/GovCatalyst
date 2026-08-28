/**
 * SIH26136 Pilot Module - GovCatalyst Reports & Document Generation Engine
 * Produces high-fidelity, printable, and exportable Government Pilot Documents
 */

const ReportEngine = {
  formatINR(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  },

  // 1. Generate Pilot Completion Report (Section 22 - 22 Distinct Sections)
  generatePilotCompletionReport(pilot) {
    const totalSpentFormatted = this.formatINR(pilot.budgetSpent);
    const totalAllocatedFormatted = this.formatINR(pilot.budgetAllocated);
    const unspentFormatted = this.formatINR(pilot.budgetAllocated - pilot.budgetSpent);

    return `
      <div class="print-page bg-white p-8 max-w-4xl mx-auto shadow-sm border border-slate-200 rounded-lg text-slate-800 font-sans">
        <!-- Official Header -->
        <div class="border-b-2 border-slate-900 pb-4 mb-6 flex items-center justify-between">
          <div>
            <div class="text-xs uppercase font-bold tracking-widest text-slate-500">Government of India • Innovation Procurement Portal</div>
            <h1 class="text-2xl font-bold text-slate-900 tracking-tight">PILOT COMPLETION & EVALUATION REPORT</h1>
            <div class="text-xs text-slate-600 mt-1">SIH26136 Procurement Framework • GFR Rule 194 Compliant Document</div>
          </div>
          <div class="text-right">
            <span class="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded text-sm border border-emerald-300">STATUS: ${pilot.outcome}</span>
            <div class="text-xs text-slate-500 mt-1">Ref ID: <strong>${pilot.id}</strong></div>
          </div>
        </div>

        <div class="space-y-6 text-sm">
          <!-- 1. Executive Summary -->
          <section>
            <h2 class="text-base font-bold text-slate-900 border-b border-slate-200 pb-1 mb-2">1. Executive Summary</h2>
            <p class="text-slate-700 leading-relaxed">
              This Pilot Completion Report documents the rigorous trial of the <strong>${pilot.solution}</strong> provided by <strong>${pilot.startup}</strong> for the <strong>${pilot.department}</strong>.
              Conducted over ${pilot.durationWeeks} weeks across ${pilot.location}, the pilot achieved a <strong>${pilot.kpis[0].improvementPercent}% reduction in inspection time</strong> (5.8 hours vs 10.0 hours baseline), exceeding the targeted 40% threshold with <strong>${pilot.kpis[1].current}% defect accuracy</strong> and zero security breaches. Total expenditure concluded at ${totalSpentFormatted} against an allocated budget of ${totalAllocatedFormatted}, yielding an unspent surplus of ${unspentFormatted}. The Innovation Committee unanimously recommends <strong>SCALE-UP</strong> across standard operational divisions.
            </p>
          </section>

          <!-- 2. Problem Statement -->
          <section>
            <h2 class="text-base font-bold text-slate-900 border-b border-slate-200 pb-1 mb-2">2. Problem Statement</h2>
            <p class="text-slate-700 bg-slate-50 p-3 rounded border border-slate-200">${pilot.problemStatement}</p>
          </section>

          <!-- 3. Pilot Objective -->
          <section>
            <h2 class="text-base font-bold text-slate-900 border-b border-slate-200 pb-1 mb-2">3. Pilot Objective</h2>
            <p class="text-slate-700">${pilot.objective}</p>
            <ul class="list-disc list-inside mt-1 text-xs text-slate-600">
              <li><strong>Baseline:</strong> ${pilot.baselineObjective}</li>
              <li><strong>Target:</strong> ${pilot.targetObjective}</li>
              <li><strong>Minimum Acceptable:</strong> ${pilot.minAcceptableResult}</li>
              <li><strong>Success Condition:</strong> ${pilot.successCondition}</li>
            </ul>
          </section>

          <!-- 4. Startup Information & 5. Solution Description -->
          <div class="grid grid-cols-2 gap-4">
            <section class="bg-slate-50 p-3 rounded border border-slate-200">
              <h2 class="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">4. Selected Startup Information</h2>
              <div class="text-xs space-y-1">
                <div><strong>Entity:</strong> ${pilot.startup}</div>
                <div><strong>Startup Lead:</strong> ${pilot.startupLead}</div>
                <div><strong>Registration:</strong> DPIIT Verified</div>
              </div>
            </section>
            <section class="bg-slate-50 p-3 rounded border border-slate-200">
              <h2 class="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">5. Solution Description</h2>
              <div class="text-xs space-y-1">
                <div><strong>Solution Name:</strong> ${pilot.solution}</div>
                <div><strong>Architecture:</strong> Edge AI + Drone Autonomous Telemetry</div>
              </div>
            </section>
          </div>

          <!-- 6. Pilot Scope & Boundaries -->
          <section>
            <h2 class="text-base font-bold text-slate-900 border-b border-slate-200 pb-1 mb-2">6. Pilot Scope & Boundary Governance</h2>
            <div class="grid grid-cols-2 gap-4 text-xs">
              <div class="bg-emerald-50/50 p-3 rounded border border-emerald-200">
                <div class="font-bold text-emerald-800 mb-1">Included in Pilot:</div>
                <ul class="list-disc list-inside space-y-1 text-slate-700">
                  ${pilot.scopeIncluded.map(s => `<li>${s}</li>`).join('')}
                </ul>
              </div>
              <div class="bg-rose-50/50 p-3 rounded border border-rose-200">
                <div class="font-bold text-rose-800 mb-1">Out of Scope:</div>
                <ul class="list-disc list-inside space-y-1 text-slate-700">
                  ${pilot.scopeExcluded.map(s => `<li>${s}</li>`).join('')}
                </ul>
              </div>
            </div>
          </section>

          <!-- 7, 8, 9: Duration, Locations, Users -->
          <div class="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded border border-slate-200 text-xs">
            <div><strong>7. Pilot Duration:</strong><br>${pilot.startDate} to ${pilot.endDate} (${pilot.durationWeeks} Weeks)</div>
            <div><strong>8. Pilot Locations:</strong><br>${pilot.location}</div>
            <div><strong>9. Participating Users:</strong><br>${pilot.usersCount} Certified Govt Inspectors</div>
          </div>

          <!-- 10, 11, 12, 13: Baseline, Target, Actual Results & KPI Analysis -->
          <section>
            <h2 class="text-base font-bold text-slate-900 border-b border-slate-200 pb-1 mb-2">10-13. Baseline, Target, Actual Results & KPI Telemetry</h2>
            <table class="report-table w-full text-xs">
              <thead class="bg-slate-100 font-semibold text-slate-700">
                <tr>
                  <th class="text-left p-2">KPI Metric</th>
                  <th class="text-left p-2">10. Baseline</th>
                  <th class="text-left p-2">11. Target</th>
                  <th class="text-left p-2">12. Actual Result</th>
                  <th class="text-left p-2">13. Improvement</th>
                  <th class="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200">
                ${pilot.kpis.map(k => `
                  <tr>
                    <td class="p-2 font-medium">${k.name}</td>
                    <td class="p-2">${k.baseline} ${k.unit}</td>
                    <td class="p-2">${k.target} ${k.unit}</td>
                    <td class="p-2 font-bold text-blue-700">${k.current} ${k.unit}</td>
                    <td class="p-2 font-bold ${k.improvementPercent >= 30 ? 'text-emerald-700' : 'text-slate-800'}">
                      ${k.direction === 'LOWER_IS_BETTER' ? `-${k.improvementPercent}%` : `+${(k.current - k.baseline).toFixed(1)} pp`}
                    </td>
                    <td class="p-2"><span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[11px]">${k.status}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </section>

          <!-- 14. User Feedback -->
          <section>
            <h2 class="text-base font-bold text-slate-900 border-b border-slate-200 pb-1 mb-2">14. User Feedback & Satisfaction</h2>
            <div class="flex items-center gap-4 bg-slate-50 p-3 rounded border border-slate-200">
              <div class="text-center px-4 border-r border-slate-200">
                <div class="text-3xl font-extrabold text-slate-900">${pilot.averageSatisfaction} / 5.0</div>
                <div class="text-xs text-slate-500 font-medium">Composite User Rating</div>
              </div>
              <div class="text-xs text-slate-600 flex-1 space-y-1">
                <div>• <strong>Ease of Use:</strong> 4.3 / 5.0 | <strong>System Performance:</strong> 4.5 / 5.0</div>
                <div>• <strong>Reliability:</strong> 4.3 / 5.0 | <strong>Defect Accuracy:</strong> 4.5 / 5.0</div>
                <div class="text-slate-500 italic">"Scaffolding requirements reduced to zero on high overpasses, improving field worker safety."</div>
              </div>
            </div>
          </section>

          <!-- 15. Security Assessment & 16. Data/IP Compliance -->
          <div class="grid grid-cols-2 gap-4">
            <section class="bg-slate-50 p-3 rounded border border-slate-200 text-xs">
              <h2 class="font-bold text-slate-900 uppercase tracking-wider mb-1">15. Cybersecurity Assessment</h2>
              <div><strong>Status:</strong> <span class="text-emerald-700 font-bold">${pilot.securityStatus} (14/14 Passed)</span></div>
              <div class="text-slate-600 mt-1">CERT-In empaneled auditor completed vulnerability testing. Zero critical/high risks identified. Full TLS 1.3 encryption and HSM key storage verified.</div>
            </section>
            <section class="bg-slate-50 p-3 rounded border border-slate-200 text-xs">
              <h2 class="font-bold text-slate-900 uppercase tracking-wider mb-1">16. Data & IP Compliance</h2>
              <div><strong>Govt Data Ownership:</strong> 100% Certified</div>
              <div class="text-slate-600 mt-1">Data retention protocol: 60-day air-gapped window. Cryptographic data wipe certificate issued post-pilot. Zero third-party data transmission.</div>
            </section>
          </div>

          <!-- 17. Risk Assessment & 18. Budget Utilization -->
          <div class="grid grid-cols-2 gap-4 text-xs">
            <section class="bg-slate-50 p-3 rounded border border-slate-200">
              <h2 class="font-bold text-slate-900 uppercase tracking-wider mb-1">17. Risk Assessment Summary</h2>
              <div><strong>Total Risks Tracked:</strong> ${pilot.risks.length}</div>
              <div><strong>Critical Unresolved Risks:</strong> 0</div>
              <div class="text-slate-600 mt-1">All identified operational and technical risks successfully mitigated during field phases.</div>
            </section>
            <section class="bg-slate-50 p-3 rounded border border-slate-200">
              <h2 class="font-bold text-slate-900 uppercase tracking-wider mb-1">18. Budget Utilization Breakdown</h2>
              <div><strong>Sanctioned Budget:</strong> ${totalAllocatedFormatted}</div>
              <div><strong>Actual Disbursement:</strong> ${totalSpentFormatted} (92.0%)</div>
              <div class="text-emerald-700 font-semibold mt-1">Treasury Savings: ${unspentFormatted}</div>
            </section>
          </div>

          <!-- 19. Issues and Resolutions -->
          <section>
            <h2 class="text-base font-bold text-slate-900 border-b border-slate-200 pb-1 mb-2">19. Live Issues & Operational Resolutions</h2>
            <div class="text-xs space-y-1 text-slate-700">
              ${pilot.issues.map(i => `
                <div class="p-2 bg-slate-50 rounded border border-slate-200">
                  <strong>[${i.id}] (${i.category} - ${i.severity}):</strong> ${i.description}
                  <div class="text-slate-500 mt-0.5"><span class="font-semibold text-emerald-700">Resolution:</span> ${i.resolution}</div>
                </div>
              `).join('')}
            </div>
          </section>

          <!-- 20. Final Outcome & 21. Recommendation -->
          <section class="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <div class="flex items-center justify-between mb-2">
              <h2 class="text-base font-bold text-emerald-950">20. Final Evaluated Outcome: ${pilot.outcome}</h2>
              <span class="px-3 py-1 bg-emerald-700 text-white font-bold rounded text-xs">RECOMMENDATION: ${pilot.committeeDecision}</span>
            </div>
            <div class="text-xs text-emerald-900 space-y-1">
              <div><strong>21. Scale-Up Justification:</strong> ${pilot.committeeReason}</div>
              <div class="mt-1"><strong>Action Pathway:</strong> ${pilot.committeeRecommendation}</div>
            </div>
          </section>

          <!-- 22. Approval Signatures -->
          <section class="pt-4 border-t-2 border-slate-300">
            <h2 class="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">22. Institutional Signatures & Verification Stamp</h2>
            <div class="grid grid-cols-3 gap-6 text-center text-xs">
              <div class="border-t border-slate-400 pt-2">
                <div class="font-bold text-slate-900">${pilot.pilotOwner}</div>
                <div class="text-slate-500">Government Pilot Coordinator</div>
                <div class="text-[10px] text-slate-400 mt-1">Digitally Signed • 2026-07-27</div>
              </div>
              <div class="border-t border-slate-400 pt-2">
                <div class="font-bold text-slate-900">${pilot.startupLead}</div>
                <div class="text-slate-500">Startup Technical Lead</div>
                <div class="text-[10px] text-slate-400 mt-1">Digitally Signed • 2026-07-27</div>
              </div>
              <div class="border-t border-slate-400 pt-2">
                <div class="font-bold text-slate-900">Dr. H. N. Roy (IAS)</div>
                <div class="text-slate-500">Evaluation Committee Chairperson</div>
                <div class="text-[10px] text-slate-400 mt-1">Digitally Signed • 2026-07-27</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    `;
  },

  // 2. Generate Pilot Agreement (Section 5, 7, 8)
  generatePilotAgreement(pilot) {
    return `
      <div class="print-page bg-white p-8 max-w-4xl mx-auto shadow-sm border border-slate-200 rounded-lg text-slate-800 font-sans">
        <div class="text-center border-b-2 border-slate-900 pb-4 mb-6">
          <div class="text-xs uppercase tracking-widest text-slate-500 font-bold">Government of India • Ministry of Finance / DPIIT</div>
          <h1 class="text-xl font-bold text-slate-900 mt-1">BILATERAL GOVERNMENT INNOVATION PILOT AGREEMENT</h1>
          <div class="text-xs text-slate-600 mt-1">Document No: <strong>AGR-${pilot.id}</strong> • Under GFR Innovation Procurement Norms</div>
        </div>

        <div class="space-y-5 text-xs text-slate-700 leading-relaxed">
          <p>
            This Pilot Agreement (the <strong>"Agreement"</strong>) is entered into on <strong>${pilot.startDate}</strong> by and between:
          </p>
          
          <div class="bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
            <div><strong>1. GOVERNMENT DEPARTMENT:</strong> ${pilot.department} (Represented by ${pilot.pilotOwner}, hereinafter the "Department")</div>
            <div><strong>AND</strong></div>
            <div><strong>2. SELECTED STARTUP:</strong> ${pilot.startup} (Represented by ${pilot.startupLead}, hereinafter the "Startup")</div>
          </div>

          <div>
            <h3 class="font-bold text-slate-900 uppercase text-xs mb-1">1. PILOT OBJECTIVE & DURATION</h3>
            <p>${pilot.objective}</p>
            <p class="mt-1">The trial shall commence on <strong>${pilot.startDate}</strong> and conclude on <strong>${pilot.endDate}</strong> (${pilot.durationWeeks} Weeks) across designated testing locations: <em>${pilot.location}</em>.</p>
          </div>

          <div>
            <h3 class="font-bold text-slate-900 uppercase text-xs mb-1">2. PILOT BUDGET & PAYMENT SCHEDULE</h3>
            <p>The total sanctioned pilot grant is <strong>${this.formatINR(pilot.budgetAllocated)}</strong>, payable on verified milestone completion:</p>
            <ul class="list-disc list-inside mt-1 space-y-0.5">
              ${pilot.paymentMilestones.map(m => `
                <li><strong>${m.title}:</strong> ${m.percentage}% (${this.formatINR(m.amount)})</li>
              `).join('')}
            </ul>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="bg-slate-50 p-3 rounded border border-slate-200">
              <h4 class="font-bold text-slate-900 mb-1">3. RESPONSIBILITIES OF GOVERNMENT:</h4>
              <ul class="list-disc list-inside space-y-1 text-[11px]">
                <li>Provide agreed access to designated bridge infrastructure.</li>
                <li>Provide approved GIS and asset data schemas.</li>
                <li>Nominate pilot coordinator & user testing engineers.</li>
                <li>Provide prompt feedback and review milestone dossiers.</li>
                <li>Release approved milestone payments within 15 working days.</li>
              </ul>
            </div>
            <div class="bg-slate-50 p-3 rounded border border-slate-200">
              <h4 class="font-bold text-slate-900 mb-1">4. RESPONSIBILITIES OF STARTUP:</h4>
              <ul class="list-disc list-inside space-y-1 text-[11px]">
                <li>Deploy proposed AI inspection and drone telemetry system.</li>
                <li>Provide on-ground technical support and user training.</li>
                <li>Strictly enforce 14-point cybersecurity checklist standards.</li>
                <li>Protect all government data from leakage or external clouding.</li>
                <li>Delete/return government data within ${pilot.dataRules.retentionPeriod}.</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 class="font-bold text-slate-900 uppercase text-xs mb-1">5. INTELLECTUAL PROPERTY & DATA GOVERNANCE</h3>
            <ul class="list-disc list-inside space-y-1">
              <li><strong>Pre-existing IP:</strong> Startup retains ownership of its core proprietary algorithms. Government retains ownership of historical maps, CAD blueprints, and departmental assets.</li>
              <li><strong>Data Ownership:</strong> Government retains exclusive 100% ownership over all telemetry, inspection logs, and raw imagery captured during the pilot.</li>
              <li><strong>Data Retention & Wipe:</strong> Startup shall cryptographically sanitize all stored trial datasets within ${pilot.dataRules.retentionPeriod}.</li>
            </ul>
          </div>

          <div class="pt-6 mt-4 border-t border-slate-300 grid grid-cols-2 gap-8 text-center">
            <div>
              <div class="font-bold text-slate-900">${pilot.pilotOwner}</div>
              <div class="text-slate-500">For & on behalf of Government Department</div>
              <div class="text-[10px] text-emerald-700 font-semibold mt-1">✓ DIGITALLY SIGNED & VERIFIED</div>
            </div>
            <div>
              <div class="font-bold text-slate-900">${pilot.startupLead}</div>
              <div class="text-slate-500">For & on behalf of Startup Entity</div>
              <div class="text-[10px] text-emerald-700 font-semibold mt-1">✓ DIGITALLY SIGNED & VERIFIED</div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // 3. Generate Scale-Up Recommendation Brief (Section 21)
  generateScaleUpBrief(pilot) {
    return `
      <div class="print-page bg-white p-8 max-w-4xl mx-auto shadow-sm border border-slate-200 rounded-lg text-slate-800 font-sans">
        <div class="border-b-2 border-emerald-700 pb-3 mb-6 flex justify-between items-center">
          <div>
            <span class="text-xs uppercase tracking-widest text-emerald-800 font-bold">Innovation Committee Decision</span>
            <h1 class="text-2xl font-bold text-slate-900">SCALE-UP & STRATEGIC PROCUREMENT RECOMMENDATION</h1>
          </div>
          <span class="px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold rounded text-sm">RECOMMENDED: SCALE</span>
        </div>

        <div class="space-y-5 text-sm">
          <div class="bg-emerald-50 p-4 rounded-lg border border-emerald-200 text-emerald-950">
            <h3 class="font-bold text-base mb-1">Executive Decision Brief</h3>
            <p class="text-xs leading-relaxed">
              Based on empirical evidence from <strong>${pilot.id}</strong>, the evaluated AI infrastructure inspection platform demonstrated a <strong>42% reduction in bridge inspection cycle time</strong> with <strong>91% accuracy</strong>, zero security vulnerabilities, and high user adoption. The committee strongly recommends immediate statewide scaling under GFR Rule 194.
            </p>
          </div>

          <div class="grid grid-cols-2 gap-4 text-xs">
            <div class="bg-slate-50 p-3 rounded border border-slate-200 space-y-2">
              <h4 class="font-bold text-slate-900 uppercase">Trial Performance Benchmarks</h4>
              <div><strong>Target Achievement:</strong> <span class="font-bold text-emerald-700">${pilot.scaleUp.targetAchievementPercent}%</span> of target KPI criteria</div>
              <div><strong>Inspection Time:</strong> Reduced from 10.0 hrs to 5.8 hrs per deck</div>
              <div><strong>Inspection Accuracy:</strong> 91.0% (surpassing 90.0% target)</div>
              <div><strong>Cost Reduction:</strong> 36% lower cost per span inspection</div>
            </div>

            <div class="bg-slate-50 p-3 rounded border border-slate-200 space-y-2">
              <h4 class="font-bold text-slate-900 uppercase">Scaling Projections & ROI</h4>
              <div><strong>Estimated Scale-Up Budget:</strong> <span class="font-bold text-slate-900">${this.formatINR(pilot.scaleUp.estimatedScaleCost)}</span></div>
              <div><strong>Target Rollout Scope:</strong> ${pilot.scaleUp.scaleScope}</div>
              <div><strong>Projected Annual Benefit:</strong> <span class="text-emerald-700 font-semibold">${pilot.scaleUp.expectedAnnualBenefit}</span></div>
              <div><strong>Scalability Assessment:</strong> <span class="font-bold text-emerald-700">${pilot.scaleUp.scalabilityRating}</span></div>
            </div>
          </div>

          <div class="text-xs space-y-2">
            <h4 class="font-bold text-slate-900 uppercase">Procurement Pathway & Next Steps</h4>
            <p class="text-slate-700">
              <strong>Statutory Route:</strong> ${pilot.scaleUp.procurementRoute}.
            </p>
            <p class="text-slate-700">
              1. Issue Letter of Intent (LOI) to <em>${pilot.startup}</em> for multi-division rollout.<br>
              2. Finalize Master Service Agreement (MSA) incorporating pilot baseline SLA targets.<br>
              3. Establish centralized Drone Telemetry Operations Center (DTOC) at NHAI Headquarters.
            </p>
          </div>

          <div class="pt-6 border-t border-slate-300 flex justify-between items-center text-xs">
            <div>
              <strong>Sanctioning Authority:</strong> Central Procurement Board<br>
              <strong>Date of Resolution:</strong> 2026-07-27
            </div>
            <div class="text-right">
              <span class="px-3 py-1 bg-slate-900 text-white rounded font-bold text-xs">SEALED & RATIFIED</span>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // 4. Generate 14-Point Cybersecurity Certificate (Section 9)
  generateCyberCertificate(pilot) {
    return `
      <div class="print-page bg-white p-8 max-w-4xl mx-auto shadow-sm border border-slate-200 rounded-lg text-slate-800 font-sans">
        <div class="border-b-2 border-slate-900 pb-3 mb-6 flex justify-between items-center">
          <div>
            <div class="text-xs uppercase tracking-widest text-slate-500 font-bold">CERT-In Empaneled Assessment • Gov Innovation Framework</div>
            <h1 class="text-2xl font-bold text-slate-900">CYBERSECURITY COMPLIANCE AUDIT REPORT</h1>
          </div>
          <div class="text-right">
            <span class="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded text-sm border border-emerald-300">STATUS: ${pilot.securityStatus}</span>
          </div>
        </div>

        <div class="text-xs space-y-4">
          <p class="text-slate-700">
            This certifies that the solution <strong>${pilot.solution}</strong> proposed by <strong>${pilot.startup}</strong> has undergone exhaustive 14-point cybersecurity checklist evaluation prior to live testing.
          </p>

          <table class="report-table w-full text-xs">
            <thead class="bg-slate-100 font-semibold text-slate-700">
              <tr>
                <th class="p-2 text-left">Check ID</th>
                <th class="p-2 text-left">Checklist Item</th>
                <th class="p-2 text-left">Severity</th>
                <th class="p-2 text-left">Compliance Notes</th>
                <th class="p-2 text-left">Verdict</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              ${pilot.cyberChecklist.map(c => `
                <tr>
                  <td class="p-2 font-mono font-bold">${c.id}</td>
                  <td class="p-2 font-medium">${c.title}</td>
                  <td class="p-2"><span class="px-1.5 py-0.5 rounded text-[10px] font-bold ${c.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'}">${c.severity}</span></td>
                  <td class="p-2 text-slate-600">${c.notes}</td>
                  <td class="p-2"><span class="text-emerald-700 font-bold">✓ PASS</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="p-3 bg-emerald-50 rounded border border-emerald-200 text-emerald-900 text-xs">
            <strong>Gating Verdict:</strong> Zero critical vulnerabilities present. The solution fully satisfies government data security, role segregation, encryption in transit/rest, and audit retention mandates. Authorized for live government network deployment.
          </div>
        </div>
      </div>
    `;
  }
};

window.ReportEngine = ReportEngine;

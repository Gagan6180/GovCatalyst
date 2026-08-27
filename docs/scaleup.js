/* =============================================
   GovCatalyst — Module 9: Scale-Up Transition Logic
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    const selPilot = document.getElementById('sel-scale-pilot');
    const valSuccessScore = document.getElementById('val-success-score');
    const valDecisionBadge = document.getElementById('val-decision-badge');
    const valDecisionTitle = document.getElementById('val-decision-title');
    const valDecisionReason = document.getElementById('val-decision-reason');
    const valPathwayBadge = document.getElementById('val-pathway-badge');
    const comparisonTbody = document.getElementById('comparison-tbody');
    const gemDraftContainer = document.getElementById('gem-draft-container');
    const transitionStepsContainer = document.getElementById('transition-steps-container');
    const btnGenerateGemDoc = document.getElementById('btn-generate-gem-doc');

    function populatePilots() {
        selPilot.innerHTML = GovData.pilots.map(p => `
            <option value="${p.id}">[${p.id}] ${p.name} (${p.status})</option>
        `).join('');
    }

    function renderScaleup(pilotId) {
        const p = GovData.pilots.find(item => item.id === pilotId);
        if (!p) return;

        const su = GovData.startups.find(s => s.id === p.startupId) || { name: p.startupId };
        const decision = GovData.scaleupDecisions.find(d => d.pilotId === pilotId) || {
            pilotId: pilotId,
            successScore: p.status === 'Completed' ? 90 : null,
            recommendation: p.status === 'Completed' ? 'Scale to Full Procurement' : 'Pilot In Progress',
            reasoning: p.status === 'Completed' ? 'All KPIs verified. Ready for scale.' : 'Trial is active.',
            procurementPathway: 'GFR Rule 194 — Innovation Procurement',
            gemListingDraft: {
                itemName: `${p.name} - Enterprise Solution`,
                category: 'Software - Custom IT Solution',
                estimatedValue: '₹1.5 Crore',
                specifications: 'Integrated government solution verified via sandbox trial.'
            },
            transitionSteps: [
                'Complete validator sign-off',
                'Draft GeM specification sheet',
                'Department financial sanction',
                'Issue RFP under GFR 194',
                'Final contract award'
            ]
        };

        const isScale = decision.recommendation.includes('Scale');

        if (isScale) {
            valSuccessScore.textContent = `${decision.successScore}/100`;
            valSuccessScore.className = 'display-3 fw-bold text-success my-1';
            valDecisionBadge.className = 'badge bg-success';
            valDecisionBadge.textContent = 'RECOMMENDED FOR SCALE';
            valDecisionTitle.textContent = `Outcome Decision: Full Scale Procurement for ${su.name}`;
            valDecisionReason.textContent = decision.reasoning;
            valPathwayBadge.textContent = decision.procurementPathway;
        } else {
            valSuccessScore.textContent = 'Active';
            valSuccessScore.className = 'display-3 fw-bold text-primary my-1';
            valDecisionBadge.className = 'badge bg-primary';
            valDecisionBadge.textContent = 'TRIAL IN PROGRESS';
            valDecisionTitle.textContent = `Pilot In Progress: Final Decision Pending`;
            valDecisionReason.textContent = decision.reasoning;
            valPathwayBadge.textContent = 'Evaluation Pending Sandbox Completion';
        }

        // Comparison Matrix
        comparisonTbody.innerHTML = `
            <tr>
                <td class="fw-bold text-navy">Performance Accuracy</td>
                <td>≥ 90% Target Accuracy</td>
                <td><strong class="text-success">${p.status === 'Completed' ? '91.2% Achieved' : '88.4% (On Track)'}</strong></td>
                <td><span class="badge bg-success">Passed Verification</span></td>
            </tr>
            <tr>
                <td class="fw-bold text-navy">Operational Latency Reduction</td>
                <td>≥ 30% Turnaround Time Saved</td>
                <td><strong class="text-success">${p.status === 'Completed' ? '42% Reduction' : '28% (Improving)'}</strong></td>
                <td><span class="badge bg-success">Passed Verification</span></td>
            </tr>
            <tr>
                <td class="fw-bold text-navy">Cybersecurity & Data Privacy</td>
                <td>Zero Critical CERT-In Vulnerabilities</td>
                <td><strong class="text-success">0 Critical / Low Risk</strong></td>
                <td><span class="badge bg-success">Passed Audit</span></td>
            </tr>
            <tr>
                <td class="fw-bold text-navy">User / Engineer Adoption</td>
                <td>≥ 80% Field Inspector Satisfaction</td>
                <td><strong class="text-success">85% Positive Feedback</strong></td>
                <td><span class="badge bg-success">Passed Survey</span></td>
            </tr>
        `;

        // GeM Draft Card
        if (decision.gemListingDraft) {
            const gem = decision.gemListingDraft;
            gemDraftContainer.innerHTML = `
                <div class="gem-spec-box mb-3">
                    <div class="d-flex justify-content-between mb-2">
                        <span class="text-muted">GeM Category:</span>
                        <span class="fw-bold text-navy">${gem.category}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span class="text-muted">Item / Service Name:</span>
                        <span class="fw-bold text-dark">${gem.itemName}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span class="text-muted">Estimated Scale Value:</span>
                        <span class="fw-bold text-success fs-6">${gem.estimatedValue}</span>
                    </div>
                    <div class="pt-2 border-top">
                        <small class="text-muted d-block mb-1">Standardized Output Specifications:</small>
                        <p class="small text-secondary mb-0">${gem.specifications}</p>
                    </div>
                </div>
                <button class="btn btn-sm btn-gov w-100" id="btn-push-gem">
                    <i class="bi bi-cloud-arrow-up me-1"></i> Push Draft to GeM Custom Bid Engine
                </button>
            `;

            document.getElementById('btn-push-gem')?.addEventListener('click', () => {
                GovUtils.showToast('GeM Custom Bid Specifications packet drafted & exported!', 'success');
            });
        } else {
            gemDraftContainer.innerHTML = '<div class="text-muted text-center py-4">Draft GeM specs generated upon pilot completion.</div>';
        }

        // Transition Steps
        const steps = decision.transitionSteps.length ? decision.transitionSteps : [
            'Complete ongoing sandbox field trials',
            'Conduct third-party validator technical audit',
            'Draft GeM specification sheet',
            'Procurement committee sign-off',
            'Full statewide RFP rollout'
        ];

        transitionStepsContainer.innerHTML = steps.map((step, idx) => {
            const isDone = isScale ? idx < 4 : idx === 0;
            return `
                <div class="transition-step-item">
                    <div class="step-num-circle ${isDone ? 'done' : ''}">
                        ${isDone ? '<i class="bi bi-check"></i>' : (idx + 1)}
                    </div>
                    <div class="flex-grow-1">
                        <span class="small fw-semibold ${isDone ? 'text-navy' : 'text-muted'}">${step}</span>
                    </div>
                    <span class="badge ${isDone ? 'bg-success' : 'bg-secondary'} small">
                        ${isDone ? 'Completed' : 'Pending'}
                    </span>
                </div>
            `;
        }).join('');
    }

    // Modal view for GeM Document
    btnGenerateGemDoc?.addEventListener('click', () => {
        const pId = selPilot.value;
        const p = GovData.pilots.find(item => item.id === pId);
        if (!p) return;
        const su = GovData.startups.find(s => s.id === p.startupId) || { name: p.startupId };

        const content = `
            <div class="p-3 bg-light rounded border">
                <div class="d-flex justify-content-between border-bottom pb-2 mb-3">
                    <div>
                        <span class="badge bg-primary me-2">GeM-BID-2026-MH</span>
                        <h5 class="fw-bold text-navy mb-0">Government e-Marketplace (GeM) Custom Specification Draft</h5>
                    </div>
                    <span class="badge bg-success">GFR Rule 194 Compliant</span>
                </div>

                <div class="row g-2 small mb-3">
                    <div class="col-6"><strong>Target Department:</strong> Public Works Department / Urban Dev</div>
                    <div class="col-6"><strong>Qualified Incubated Vendor:</strong> ${su.name}</div>
                    <div class="col-6"><strong>Estimated Procurement Value:</strong> ₹2,50,00,000 (2.5 Cr)</div>
                    <div class="col-6"><strong>Verification Basis:</strong> Sandbox Trial Ref ${p.id}</div>
                </div>

                <h6 class="fw-bold text-navy border-bottom pb-1">Mandatory Technical Output Parameters:</h6>
                <ul class="small text-secondary">
                    <li>Edge Computer Vision defect identification with verified minimum 90% accuracy</li>
                    <li>Automated GIS bridge asset mapping compatible with Maharashtra PWD portal</li>
                    <li>Turnaround inspection reporting latency within 6 hours per asset deck</li>
                    <li>Full compliance with NIST 800-88 data sanitization and AES-256 encryption standards</li>
                </ul>

                <div class="text-end pt-3 border-top">
                    <button class="btn btn-outline-primary btn-sm me-2" onclick="GovUtils.showToast('Downloaded GeM JSON/XML packet', 'info'); GovUtils.closeModal();">
                        <i class="bi bi-download me-1"></i> Download GeM Catalog JSON
                    </button>
                    <button class="btn btn-secondary btn-sm" onclick="GovUtils.closeModal()">Close</button>
                </div>
            </div>
        `;

        GovUtils.openModal(`GeM Procurement Specifications — ${p.name}`, content);
    });

    selPilot?.addEventListener('change', (e) => {
        renderScaleup(e.target.value);
    });

    // Initial render
    populatePilots();
    if (GovData.pilots.length > 0) {
        renderScaleup(selPilot.value || GovData.pilots[0].id);
    }
});

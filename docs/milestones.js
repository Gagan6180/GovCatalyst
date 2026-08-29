/* =============================================
   GovCatalyst — Module 6: Milestone Contracting Logic
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    const selPilot = document.getElementById('sel-pilot');
    const partnerName = document.getElementById('contract-partner-name');
    const visualPipeline = document.getElementById('visual-pipeline');
    const cardsContainer = document.getElementById('milestones-cards-container');
    const clausesAccordion = document.getElementById('clauses-accordion');
    const btnViewAgreement = document.getElementById('btn-view-agreement');

    // Parse URL param if directed from Pilot Design
    const urlParams = new URLSearchParams(window.location.search);
    const prePilotId = urlParams.get('pilotId');

    // Populate Pilot selector
    function populatePilots() {
        selPilot.innerHTML = GovData.pilots.map(p => `
            <option value="${p.id}" ${p.id === prePilotId ? 'selected' : ''}>[${p.id}] ${p.name} (${p.status})</option>
        `).join('');
    }

    // Render visual horizontal pipeline
    function renderPipeline(pilotMilestones) {
        if (!pilotMilestones.length) {
            visualPipeline.innerHTML = '<span class="text-muted small">No milestones defined for this pilot.</span>';
            return;
        }

        visualPipeline.innerHTML = pilotMilestones.map((m, idx) => {
            const isCompleted = m.status === 'Completed';
            const isInProgress = m.status === 'In Progress';
            const nodeClass = isCompleted ? 'completed' : (isInProgress ? 'in-progress' : 'pending-node');
            const icon = isCompleted ? '✅' : (isInProgress ? '⏳' : '⚪');

            const isLast = idx === pilotMilestones.length - 1;
            const lineClass = isCompleted ? 'done' : '';

            return `
                <div class="pipeline-node ${nodeClass}">
                    <div>${icon}</div>
                    <div class="fw-bold text-truncate">${m.name}</div>
                    <small style="font-size: 10px;">${m.status}</small>
                </div>
                ${!isLast ? `<div class="pipeline-line ${lineClass}"></div>` : ''}
            `;
        }).join('');
    }

    // Render Milestone Cards
    function renderMilestoneCards(pilotId) {
        const p = GovData.pilots.find(item => item.id === pilotId);
        if (!p) return;

        const su = GovData.startups.find(s => s.id === p.startupId) || { name: p.startupId };
        partnerName.textContent = `${su.name} (Startup ID: ${p.startupId})`;

        const pMilestones = GovData.milestones.filter(m => m.pilotId === pilotId);
        renderPipeline(pMilestones);

        if (!pMilestones.length) {
            cardsContainer.innerHTML = '<div class="col-12 text-muted text-center py-4">No milestones tracked for this sandbox.</div>';
            return;
        }

        cardsContainer.innerHTML = pMilestones.map((m, index) => {
            const stateClass = m.status === 'Completed' ? 'state-completed' : (m.status === 'In Progress' ? 'state-inprogress' : 'state-pending');
            const badgeClass = m.status === 'Completed' ? 'state-badge-completed' : (m.status === 'In Progress' ? 'state-badge-inprogress' : 'state-badge-pending');

            let nextActionBtn = '';
            if (m.status === 'Pending') {
                nextActionBtn = `<button class="btn btn-sm btn-outline-primary btn-advance" data-id="${m.id}" data-next="In Progress"><i class="bi bi-play-circle me-1"></i> Start Execution</button>`;
            } else if (m.status === 'In Progress') {
                nextActionBtn = `<button class="btn btn-sm btn-outline-success btn-advance" data-id="${m.id}" data-next="Completed"><i class="bi bi-check-circle me-1"></i> Complete & Verify</button>`;
            } else {
                nextActionBtn = `<span class="text-success small fw-bold"><i class="bi bi-patch-check-fill me-1"></i> Verified & Paid</span>`;
            }

            return `
                <div class="col-md-6">
                    <div class="gov-card milestone-card ${stateClass} h-100 mb-0">
                        <div class="gov-card-body">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <span class="badge bg-secondary font-monospace">${m.id}</span>
                                    <span class="badge ${badgeClass} ms-1">${m.status}</span>
                                </div>
                                <span class="fw-bold text-navy">${GovUtils.formatCurrency(m.paymentAmount)}</span>
                            </div>

                            <h5 class="fw-bold text-navy mb-1">${m.name}</h5>
                            <p class="small text-secondary mb-3">${m.description}</p>

                            <div class="row g-2 small border-top pt-2 text-muted mb-3">
                                <div class="col-6"><strong>Due Date:</strong> ${GovUtils.formatDate(m.dueDate)}</div>
                                <div class="col-6"><strong>Completed:</strong> ${GovUtils.formatDate(m.completedDate)}</div>
                            </div>

                            <div class="d-flex justify-content-between align-items-center pt-2 border-top">
                                <small class="text-muted">Payment: <strong>${m.paymentLinked ? 'Linked (Escrow)' : 'None'}</strong></small>
                                <div>${nextActionBtn}</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Bind advance buttons
        document.querySelectorAll('.btn-advance').forEach(btn => {
            btn?.addEventListener('click', () => {
                const mId = btn.dataset.id;
                const nextState = btn.dataset.next;
                advanceMilestoneState(mId, nextState);
            });
        });
    }

    function advanceMilestoneState(mId, nextState) {
        const m = GovData.milestones.find(item => item.id === mId);
        if (!m) return;

        m.status = nextState;
        if (nextState === 'Completed') {
            m.completedDate = new Date().toISOString().split('T')[0];

            // If milestone is payment linked, check if payment entry exists or update it to Released
            const pay = GovData.payments.find(p => p.milestoneId === mId);
            if (pay) {
                pay.status = 'Released';
                pay.approvalDate = new Date().toISOString().split('T')[0];
                pay.releaseDate = new Date().toISOString().split('T')[0];
                pay.escrowHeld = false;
            }
        }

        GovData.auditTrail.unshift({
            id: GovData.auditTrail.length + 1,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            user: 'Shri Rajesh Verma',
            role: 'Dept Admin',
            action: 'Milestone Advanced',
            module: 'Milestones',
            detail: `Advanced milestone ${m.id} (${m.name}) status to ${nextState}`
        });

        renderMilestoneCards(selPilot.value);
        GovUtils.showToast(`Milestone ${m.id} updated to ${nextState}!`, 'success');
    }

    // Render Legal Clauses Accordion
    function renderClauses() {
        clausesAccordion.innerHTML = GovData.agreementClauses.map((cl, idx) => `
            <div class="accordion-item">
                <h2 class="accordion-header" id="heading-${idx}">
                    <button class="accordion-button ${idx > 0 ? 'collapsed' : ''}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${idx}">
                        <i class="bi bi-shield-check text-primary me-2"></i> Clause ${idx + 1}: ${cl.category}
                    </button>
                </h2>
                <div id="collapse-${idx}" class="accordion-collapse collapse ${idx === 0 ? 'show' : ''}">
                    <div class="accordion-body small text-secondary">
                        ${cl.text}
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Generate Agreement Document Modal
    btnViewAgreement?.addEventListener('click', () => {
        const pId = selPilot.value;
        const p = GovData.pilots.find(item => item.id === pId);
        if (!p) return;
        const su = GovData.startups.find(s => s.id === p.startupId) || { name: p.startupId, founders: 'Startup Founders' };

        const content = `
            <div class="agreement-print-container border p-4 bg-white">
                <div class="text-center pb-3 border-bottom mb-4">
                    <div class="fw-bold" style="font-size: 16px;">GOVERNMENT OF MAHARASHTRA</div>
                    <div class="text-muted small">Maharashtra State Innovation Society &bull; GFR Rule 194 Innovation Framework</div>
                    <h5 class="fw-bold text-navy mt-2">BILATERAL INNOVATION PILOT & SANDBOX TRIAL AGREEMENT</h5>
                    <small class="font-monospace text-muted">Contract Ref: GC-AGR-2026-${p.id}</small>
                </div>

                <p class="small">This Agreement is executed between the <strong>Department (${p.challengeId})</strong> of the Government of Maharashtra (hereinafter "Government") and <strong>${su.name}</strong> (hereinafter "Innovator").</p>

                <h6 class="fw-bold text-navy mt-3 border-bottom pb-1">1. Scope of Trial Sandbox</h6>
                <p class="small">The Innovator is authorized to deploy the <strong>${p.name}</strong> in the designated test zone at <strong>${p.location}</strong> for a duration of <strong>${p.duration}</strong> commencing on ${GovUtils.formatDate(p.startDate)}.</p>

                <h6 class="fw-bold text-navy mt-3 border-bottom pb-1">2. Core Legal Covenants</h6>
                <ol class="small text-secondary ps-3">
                    ${GovData.agreementClauses.map(cl => `<li class="mb-2"><strong>${cl.category}:</strong> ${cl.text}</li>`).join('')}
                </ol>

                <h6 class="fw-bold text-navy mt-3 border-bottom pb-1">3. Milestone Schedule & Payment Tranches</h6>
                <table class="table table-sm table-bordered small mt-2">
                    <thead class="table-light">
                        <tr><th>Milestone</th><th>Deliverable Description</th><th>Due Date</th><th>Tranche Amount</th></tr>
                    </thead>
                    <tbody>
                        ${GovData.milestones.filter(m => m.pilotId === p.id).map(m => `
                            <tr>
                                <td>${m.id}: ${m.name}</td>
                                <td>${m.description}</td>
                                <td>${GovUtils.formatDate(m.dueDate)}</td>
                                <td class="fw-bold">${GovUtils.formatCurrency(m.paymentAmount)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div class="row pt-4 mt-4 border-top text-center small">
                    <div class="col-6">
                        <div class="mb-4">_______________________________</div>
                        <strong>Authorized Department Officer</strong><br>
                        Government of Maharashtra
                    </div>
                    <div class="col-6">
                        <div class="mb-4">_______________________________</div>
                        <strong>Authorized Signatory</strong><br>
                        ${su.name}
                    </div>
                </div>

                <div class="text-end mt-4 pt-3 border-top no-print">
                    <button class="btn btn-outline-dark btn-sm me-2" onclick="window.print()"><i class="bi bi-printer me-1"></i> Print / Save PDF</button>
                    <button class="btn btn-secondary btn-sm" onclick="GovUtils.closeModal()">Close</button>
                </div>
            </div>
        `;

        GovUtils.openModal(`Legal Agreement — ${p.name}`, content);
    });

    selPilot?.addEventListener('change', (e) => {
        renderMilestoneCards(e.target.value);
    });

    // Initialize
    populatePilots();
    renderClauses();
    if (GovData.pilots.length > 0) {
        renderMilestoneCards(selPilot.value || GovData.pilots[0].id);
    }
});

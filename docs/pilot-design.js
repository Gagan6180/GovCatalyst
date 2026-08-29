/* =============================================
   GovCatalyst — Module 5: Pilot Design Logic
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    const cardPilotForm = document.getElementById('card-pilot-form');
    const btnTogglePilotForm = document.getElementById('btn-toggle-pilot-form');
    const btnClosePilotForm = document.getElementById('btn-close-pilot-form');
    const btnCancelPilotForm = document.getElementById('btn-cancel-pilot-form');
    const formPilotDesign = document.getElementById('form-pilot-design');

    const inpPilotChallenge = document.getElementById('inp-pilot-challenge');
    const inpPilotStartup = document.getElementById('inp-pilot-startup');
    const inpPilotRisk = document.getElementById('inp-pilot-risk');
    const safeguardsContainer = document.getElementById('safeguards-container');
    const pilotsTbody = document.getElementById('pilots-tbody');
    const pilotsCount = document.getElementById('pilots-count');

    // Parse URL params if directed from Evaluation
    const urlParams = new URLSearchParams(window.location.search);
    const preStartupId = urlParams.get('startupId');
    const preChallengeId = urlParams.get('challengeId');

    const currentUser = (window.GovApi && GovApi.getCurrentUser()) || (window.GovPageAuth && GovPageAuth.getUser()) || null;
    const normRole = currentUser && currentUser.role ? currentUser.role.toLowerCase().replace(/[\s-]/g, '_') : '';

    // Only dept_admin and super_admin can charter new pilots
    if (currentUser && normRole !== 'dept_admin' && normRole !== 'super_admin') {
        if (btnTogglePilotForm) btnTogglePilotForm.style.display = 'none';
    }

    function toggleForm(show) {
        if (currentUser && normRole !== 'dept_admin' && normRole !== 'super_admin') {
            GovUtils.showToast('Access Denied: Only Department Admins can charter pilot sandboxes.', 'error');
            return;
        }
        cardPilotForm.style.display = show ? 'block' : 'none';
        if (show) cardPilotForm.scrollIntoView({ behavior: 'smooth' });
    }

    btnTogglePilotForm?.addEventListener('click', () => toggleForm(cardPilotForm.style.display === 'none'));
    btnClosePilotForm?.addEventListener('click', () => toggleForm(false));
    btnCancelPilotForm?.addEventListener('click', () => toggleForm(false));

    // Populate dropdowns
    function populateDropdowns() {
        inpPilotChallenge.innerHTML = GovData.challenges.map(c => `
            <option value="${c.id}" ${c.id === preChallengeId ? 'selected' : ''}>[${c.id}] ${c.title}</option>
        `).join('');

        inpPilotStartup.innerHTML = GovData.startups.map(s => `
            <option value="${s.id}" ${s.id === preStartupId ? 'selected' : ''}>[${s.id}] ${s.name} (${s.sector})</option>
        `).join('');

        if (preStartupId || preChallengeId) {
            toggleForm(true);
        }
    }

    // Auto-suggest safeguards based on risk tier
    function updateSafeguards() {
        const risk = inpPilotRisk.value;
        let safeguards = [];

        if (risk === 'Low') {
            safeguards = [
                'Weekly performance reviews',
                'Read-only sandbox database copy',
                'Standard HTTPS/TLS encryption',
                'Basic milestone telemetric tracking'
            ];
        } else if (risk === 'Medium') {
            safeguards = [
                'Dedicated isolated VPC environment',
                'No citizen personal PII access',
                'Weekly cybersecurity & penetration scans',
                'Human-in-the-loop validation of AI detections',
                'Air-gapped telemetry logging'
            ];
        } else {
            safeguards = [
                'Physical security officer oversight during field runs',
                'Real-time fail-safe termination protocol',
                'Daily CERT-In compliance audit logs',
                'Full synthetic mock dataset restriction',
                'Zero direct integration with production govt databases',
                'Compulsory insurance & third-party indemnity'
            ];
        }

        safeguardsContainer.innerHTML = safeguards.map(sg => `
            <span class="safeguard-tag"><i class="bi bi-shield-check"></i> ${sg}</span>
        `).join('');
    }

    inpPilotRisk?.addEventListener('change', updateSafeguards);

    // Form submit
    formPilotDesign?.addEventListener('submit', (e) => {
        e.preventDefault();
        const chId = inpPilotChallenge.value;
        const suId = inpPilotStartup.value;
        const risk = inpPilotRisk.value;
        const duration = document.getElementById('inp-pilot-duration').value;
        const name = document.getElementById('inp-pilot-name').value.trim();
        const location = document.getElementById('inp-pilot-location').value.trim();
        const dataScope = document.getElementById('inp-pilot-datascope').value.split(',').map(s => s.trim()).filter(Boolean);
        const threshold = document.getElementById('inp-pilot-threshold').value.trim();

        const newPilot = {
            id: `PLT-00${GovData.pilots.length + 1}`,
            challengeId: chId,
            startupId: suId,
            name: name,
            duration: duration,
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 8*7*24*60*60*1000).toISOString().split('T')[0],
            location: location,
            riskLevel: risk,
            status: 'Active',
            kpiTargets: [
                { name: 'Turnaround Latency Reduction', baseline: '10 hrs', target: '6 hrs' },
                { name: 'Core Processing Accuracy', baseline: '80%', target: '90%' }
            ],
            dataScope: dataScope.length ? dataScope : ['Anonymized test dataset', 'Operational logs'],
            safeguards: Array.from(safeguardsContainer.querySelectorAll('.safeguard-tag')).map(el => el.textContent.trim()),
            successThresholds: threshold || '≥40% improvement without critical incidents'
        };

        GovData.pilots.unshift(newPilot);

        // Auto-create initial milestones for this pilot
        GovData.milestones.unshift(
            { id: `MS-00${GovData.milestones.length + 1}`, pilotId: newPilot.id, name: 'Setup & Agreement', description: 'Configure sandbox, sign indemnity clauses', status: 'In Progress', dueDate: '2026-09-15', completedDate: null, paymentLinked: true, paymentAmount: 100000 },
            { id: `MS-00${GovData.milestones.length + 2}`, pilotId: newPilot.id, name: 'Trial Deployment', description: 'Deploy solution in pilot zone', status: 'Pending', dueDate: '2026-10-01', completedDate: null, paymentLinked: true, paymentAmount: 150000 },
            { id: `MS-00${GovData.milestones.length + 3}`, pilotId: newPilot.id, name: 'Final M&E Report', description: 'Committee evaluation & verification', status: 'Pending', dueDate: '2026-10-25', completedDate: null, paymentLinked: true, paymentAmount: 100000 }
        );

        GovData.auditTrail.unshift({
            id: GovData.auditTrail.length + 1,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            user: 'Shri Rajesh Verma',
            role: 'Dept Admin',
            action: 'Pilot Created',
            module: 'Pilot Design',
            detail: `Commissioned sandbox trial ${newPilot.id} (${newPilot.name}) with ${suId}`
        });

        formPilotDesign.reset();
        toggleForm(false);
        renderPilotsTable();
        GovUtils.showToast(`Sandbox Pilot ${newPilot.id} created & provisioned successfully!`, 'success');
    });

    // Render Pilots Table
    function renderPilotsTable() {
        pilotsCount.textContent = `${GovData.pilots.length} Sandboxes Provisioned`;

        pilotsTbody.innerHTML = GovData.pilots.map(p => {
            const su = GovData.startups.find(s => s.id === p.startupId) || { name: p.startupId };
            const riskClass = p.riskLevel === 'Low' ? 'risk-pill-low' : (p.riskLevel === 'Medium' ? 'risk-pill-medium' : 'risk-pill-high');

            return `
                <tr>
                    <td><span class="badge bg-secondary font-monospace">${p.id}</span></td>
                    <td>
                        <span class="fw-bold text-navy">${p.name}</span>
                        <small class="text-muted d-block"><i class="bi bi-geo-alt"></i> ${p.location}</small>
                    </td>
                    <td>
                        <span class="fw-semibold">${su.name}</span>
                        <small class="text-muted font-monospace d-block">${p.startupId}</small>
                    </td>
                    <td><span class="badge ${riskClass}">${p.riskLevel} Risk</span></td>
                    <td><small class="fw-medium">${p.duration}</small></td>
                    <td><span class="badge-gov ${GovUtils.getBadgeClass(p.status)}">${p.status}</span></td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-primary btn-view-charter me-1" data-id="${p.id}" title="View Pilot Blueprint">
                            <i class="bi bi-file-text"></i> Blueprint
                        </button>
                        <a href="milestones.html?pilotId=${p.id}" class="btn btn-sm btn-gov" title="Track Milestones">
                            <i class="bi bi-arrow-right-circle"></i>
                        </a>
                    </td>
                </tr>
            `;
        }).join('');

        document.querySelectorAll('.btn-view-charter').forEach(btn => {
            btn?.addEventListener('click', () => viewPilotBlueprint(btn.dataset.id));
        });
    }

    function viewPilotBlueprint(id) {
        const p = GovData.pilots.find(item => item.id === id);
        if (!p) return;
        const su = GovData.startups.find(s => s.id === p.startupId) || { name: p.startupId };
        const ch = GovData.challenges.find(c => c.id === p.challengeId) || { title: p.challengeId };

        const content = `
            <div class="space-y-3">
                <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                    <div>
                        <span class="badge bg-primary me-1">${p.id}</span>
                        <span class="badge bg-secondary">${p.riskLevel} Risk Tier</span>
                        <h5 class="fw-bold text-navy mt-1 mb-0">${p.name}</h5>
                    </div>
                    <span class="badge-gov ${GovUtils.getBadgeClass(p.status)}">${p.status}</span>
                </div>

                <div class="row g-2 small mb-3">
                    <div class="col-6"><strong>Partner Entity:</strong> ${su.name} (${p.startupId})</div>
                    <div class="col-6"><strong>Linked Need:</strong> ${ch.title}</div>
                    <div class="col-6"><strong>Trial Window:</strong> ${p.duration} (${GovUtils.formatDate(p.startDate)} to ${GovUtils.formatDate(p.endDate)})</div>
                    <div class="col-6"><strong>Testing Field Zone:</strong> ${p.location}</div>
                </div>

                <div class="mb-3">
                    <label class="fw-bold text-dark small text-uppercase">Target Key Performance Indicators (KPIs):</label>
                    <ul class="small text-secondary mb-0">
                        ${p.kpiTargets.map(k => `<li><strong>${k.name}:</strong> Baseline: ${k.baseline} → Target: <span class="text-success fw-bold">${k.target}</span></li>`).join('')}
                    </ul>
                </div>

                <div class="mb-3">
                    <label class="fw-bold text-dark small text-uppercase">Approved Government Data & Asset Scope:</label>
                    <div class="p-2 bg-light rounded border small text-muted">
                        ${p.dataScope.map(ds => `<span class="badge bg-light text-dark border me-1 mb-1">${ds}</span>`).join('')}
                    </div>
                </div>

                <div class="mb-3">
                    <label class="fw-bold text-dark small text-uppercase">Mandatory Sandbox Safeguards:</label>
                    <div class="d-flex flex-wrap gap-1">
                        ${p.safeguards.map(sg => `<span class="safeguard-tag" style="font-size: 11px;"><i class="bi bi-shield-check"></i> ${sg}</span>`).join('')}
                    </div>
                </div>

                <div class="p-3 bg-primary bg-opacity-10 border border-primary border-opacity-25 rounded small">
                    <strong>Success & Transition Threshold:</strong> ${p.successThresholds}
                </div>

                <div class="mt-4 pt-3 border-top text-end">
                    <a href="milestones.html?pilotId=${p.id}" class="btn btn-primary btn-sm me-2">
                        <i class="bi bi-list-task me-1"></i> View Milestone Contract
                    </a>
                    <button class="btn btn-secondary btn-sm" onclick="GovUtils.closeModal()">Close</button>
                </div>
            </div>
        `;

        GovUtils.openModal(`Sandbox Pilot Charter — ${p.id}`, content);
    }

    // Initial render
    populateDropdowns();
    updateSafeguards();
    renderPilotsTable();
});

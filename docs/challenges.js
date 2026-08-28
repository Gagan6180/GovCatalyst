/* =============================================
   GovCatalyst — Module 1: Challenge Builder Logic
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('challenges-tbody');
    const cardForm = document.getElementById('card-form');
    const btnToggle = document.getElementById('btn-toggle-builder');
    const btnClose = document.getElementById('btn-close-form');
    const btnCancel = document.getElementById('btn-cancel-form');
    const selTemplate = document.getElementById('sel-template');
    const btnAiRewrite = document.getElementById('btn-ai-rewrite');
    const formChallenge = document.getElementById('form-challenge');
    const searchInput = document.getElementById('search-challenge');
    const filterStatus = document.getElementById('filter-status');

    // Toggle Form visibility
    function toggleForm(show) {
        cardForm.style.display = show ? 'block' : 'none';
        if (show) {
            cardForm.scrollIntoView({ behavior: 'smooth' });
        }
    }

    btnToggle?.addEventListener('click', () => toggleForm(cardForm.style.display === 'none'));
    btnClose?.addEventListener('click', () => toggleForm(false));
    btnCancel?.addEventListener('click', () => toggleForm(false));

    // Template selection auto-fill
    selTemplate?.addEventListener('change', (e) => {
        const tId = e.target.value;
        const template = GovData.challengeTemplates.find(t => t.id === tId);
        if (template) {
            const desc = document.getElementById('inp-desc');
            if (!desc.value.trim()) {
                desc.value = template.template;
            }
            GovUtils.showToast(`Applied ${template.name} template structure.`, 'info');
        }
    });

    // AI Rewrite Simulation
    btnAiRewrite?.addEventListener('click', () => {
        const title = document.getElementById('inp-title').value.trim();
        const desc = document.getElementById('inp-desc').value.trim();
        const dept = document.getElementById('inp-dept').value || 'Department';
        const cat = document.getElementById('inp-cat').value;

        if (!desc) {
            GovUtils.showToast('Please enter a problem description first to rewrite.', 'warning');
            return;
        }

        btnAiRewrite.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span> Formulating Measurable Outcomes...';
        btnAiRewrite.disabled = true;

        setTimeout(() => {
            let measurableOutcome = '';
            if (cat === 'AI/ML' || desc.toLowerCase().includes('inspect') || desc.toLowerCase().includes('detect')) {
                measurableOutcome = `[OUTCOME-BASED OBJECTIVE] Deploy a non-invasive ${cat} solution capable of achieving ≥ 40% reduction in operational turnaround time compared to current departmental baseline, maintaining ≥ 90% accuracy in automated defect/pattern recognition across a controlled pilot sample of 50-100 instances over 8 weeks, integrated with ${dept} reporting workflows.`;
            } else if (cat === 'IoT' || desc.toLowerCase().includes('water') || desc.toLowerCase().includes('sensor')) {
                measurableOutcome = `[OUTCOME-BASED OBJECTIVE] Implement real-time automated telemetry and sensor monitoring across the pilot jurisdiction to achieve ≥ 85% event detection rate with incident response time reduced to under 4 hours, verified through automated KPI telemetry over a 12-week sandbox trial.`;
            } else {
                measurableOutcome = `[OUTCOME-BASED OBJECTIVE] Deliver a citizen-centric digital workflow automating manual interventions, reducing end-to-end processing latency by ≥ 50% with zero physical visits required, ensuring 99.9% uptime and compliance with Maharashtra digital governance standards.`;
            }

            document.getElementById('inp-outcome').value = measurableOutcome;
            btnAiRewrite.innerHTML = '<i class="bi bi-robot me-1"></i> AI Rewrite → Convert to Measurable Outcome Statement';
            btnAiRewrite.disabled = false;
            GovUtils.showToast('Problem rewritten into GFR Rule 194 compliant outcome statement!', 'success');
        }, 600);
    });

    // Form submission
    formChallenge?.addEventListener('submit', (e) => {
        e.preventDefault();
        const newChallenge = {
            id: `CH-00${GovData.challenges.length + 1}`,
            title: document.getElementById('inp-title').value.trim(),
            department: document.getElementById('inp-dept').value,
            category: document.getElementById('inp-cat').value,
            description: document.getElementById('inp-desc').value.trim(),
            outcomeStatement: document.getElementById('inp-outcome').value.trim(),
            status: 'Draft',
            createdDate: new Date().toISOString().split('T')[0],
            templateUsed: document.getElementById('sel-template').value || 'Custom'
        };

        GovData.challenges.unshift(newChallenge);
        
        // Log in audit trail
        GovData.auditTrail.unshift({
            id: GovData.auditTrail.length + 1,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            user: 'Shri Rajesh Verma',
            role: 'Dept Admin',
            action: 'Challenge Created',
            module: 'Challenges',
            detail: `Created new challenge draft ${newChallenge.id}: ${newChallenge.title}`
        });

        formChallenge.reset();
        toggleForm(false);
        renderTable();
        updateStats();
        GovUtils.showToast(`Challenge ${newChallenge.id} created successfully as Draft!`, 'success');
    });

    // Render Table
    function renderTable() {
        const search = searchInput.value.toLowerCase();
        const status = filterStatus.value;

        const filtered = GovData.challenges.filter(c => {
            const matchesSearch = c.title.toLowerCase().includes(search) || 
                                  c.department.toLowerCase().includes(search) ||
                                  c.id.toLowerCase().includes(search);
            const matchesStatus = !status || c.status === status;
            return matchesSearch && matchesStatus;
        });

        if (filtered.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">No challenge statements found matching criteria.</td></tr>`;
            return;
        }

        tableBody.innerHTML = filtered.map(c => `
            <tr>
                <td><span class="badge bg-secondary font-monospace">${c.id}</span></td>
                <td>
                    <div class="fw-semibold text-navy">${c.title}</div>
                    <small class="text-muted text-truncate d-block" style="max-width: 320px;">${c.outcomeStatement || c.description}</small>
                </td>
                <td><small class="fw-medium">${c.department}</small></td>
                <td><span class="badge bg-light text-dark border">${c.category}</span></td>
                <td><span class="badge-gov ${GovUtils.getBadgeClass(c.status)}">${c.status}</span></td>
                <td><small class="text-muted">${GovUtils.formatDate(c.createdDate)}</small></td>
                <td class="text-end">
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary btn-view" data-id="${c.id}" title="View Details">
                            <i class="bi bi-eye"></i> View
                        </button>
                        ${c.status === 'Draft' ? `
                            <button class="btn btn-outline-success btn-publish" data-id="${c.id}" title="Publish to Startups">
                                <i class="bi bi-send"></i> Publish
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `).join('');

        // Bind Action buttons
        document.querySelectorAll('.btn-view').forEach(btn => {
            btn?.addEventListener('click', () => viewChallengeDetails(btn.dataset.id));
        });

        document.querySelectorAll('.btn-publish').forEach(btn => {
            btn?.addEventListener('click', () => publishChallenge(btn.dataset.id));
        });
    }

    function viewChallengeDetails(id) {
        const c = GovData.challenges.find(ch => ch.id === id);
        if (!c) return;

        const content = `
            <div class="space-y-3">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <span class="badge bg-primary me-2">${c.id}</span>
                        <span class="badge bg-secondary">${c.category}</span>
                    </div>
                    <span class="badge-gov ${GovUtils.getBadgeClass(c.status)}">${c.status}</span>
                </div>
                <h5 class="fw-bold text-navy mb-1">${c.title}</h5>
                <p class="text-muted mb-3"><i class="bi bi-building me-1"></i> ${c.department}</p>
                
                <div class="mb-3">
                    <label class="fw-bold text-dark small text-uppercase">Problem Context / Pain Point:</label>
                    <div class="p-3 bg-light rounded border text-secondary small">${c.description}</div>
                </div>

                <div class="mb-3">
                    <label class="fw-bold text-navy small text-uppercase"><i class="bi bi-bullseye me-1"></i> Outcome-Based Target Statement (GFR 194):</label>
                    <div class="p-3 bg-primary bg-opacity-10 border border-primary border-opacity-25 rounded text-dark small font-monospace">${c.outcomeStatement}</div>
                </div>

                <div class="row g-2 pt-2 border-top text-muted small">
                    <div class="col-6"><strong>Created On:</strong> ${GovUtils.formatDate(c.createdDate)}</div>
                    <div class="col-6"><strong>Template Reference:</strong> ${c.templateUsed || 'Custom Form'}</div>
                </div>

                <div class="mt-4 pt-3 border-top text-end">
                    ${c.status === 'Draft' ? `
                        <button class="btn btn-success btn-sm me-2" onclick="document.querySelector('.btn-publish[data-id=\\'${c.id}\\']')?.click(); GovUtils.closeModal();">
                            <i class="bi bi-send me-1"></i> Publish Statement
                        </button>
                    ` : ''}
                    <button class="btn btn-secondary btn-sm" onclick="GovUtils.closeModal()">Close</button>
                </div>
            </div>
        `;

        GovUtils.openModal(`Challenge Specification — ${c.id}`, content);
    }

    function publishChallenge(id) {
        const c = GovData.challenges.find(ch => ch.id === id);
        if (c) {
            c.status = 'Published';
            GovData.auditTrail.unshift({
                id: GovData.auditTrail.length + 1,
                timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                user: 'Shri Rajesh Verma',
                role: 'Dept Admin',
                action: 'Challenge Published',
                module: 'Challenges',
                detail: `Published challenge ${c.id} to open innovation portal.`
            });
            renderTable();
            updateStats();
            GovUtils.showToast(`Challenge ${c.id} is now PUBLISHED and open for startup discovery!`, 'success');
        }
    }

    function updateStats() {
        document.getElementById('cnt-total').textContent = GovData.challenges.length;
        document.getElementById('cnt-published').textContent = GovData.challenges.filter(c => c.status === 'Published').length;
        document.getElementById('cnt-matched').textContent = GovData.challenges.filter(c => c.status === 'Matched').length;
        document.getElementById('cnt-draft').textContent = GovData.challenges.filter(c => c.status === 'Draft').length;
    }

    searchInput?.addEventListener('input', renderTable);
    filterStatus?.addEventListener('change', renderTable);

    // Initial render
    renderTable();
    updateStats();
});

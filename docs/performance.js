/* =============================================
   GovCatalyst — Module 7: Performance M&E Logic
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    const selPilot = document.getElementById('sel-perf-pilot');
    const healthScore = document.getElementById('val-health-score');
    const healthLabel = document.getElementById('val-health-label');
    const metaGrid = document.getElementById('pilot-meta-grid');
    const kpiCardsGrid = document.getElementById('kpi-cards-grid');
    const readingsTbody = document.getElementById('readings-tbody');

    // Populate Pilot selector
    function populatePilots() {
        selPilot.innerHTML = GovData.pilots.map(p => `
            <option value="${p.id}">[${p.id}] ${p.name}</option>
        `).join('');
    }

    function renderDashboard(pilotId) {
        const p = GovData.pilots.find(item => item.id === pilotId);
        if (!p) return;

        const su = GovData.startups.find(s => s.id === p.startupId) || { name: p.startupId };
        const kpis = GovData.kpiReadings.filter(k => k.pilotId === pilotId);

        // Render meta parameters
        metaGrid.innerHTML = `
            <div class="col-sm-6">
                <small class="text-muted d-block">Commissioned Innovator</small>
                <span class="fw-bold text-navy">${su.name} (${p.startupId})</span>
            </div>
            <div class="col-sm-6">
                <small class="text-muted d-block">Sandbox Field Location</small>
                <span class="fw-bold">${p.location}</span>
            </div>
            <div class="col-sm-6">
                <small class="text-muted d-block">Trial Window</small>
                <span class="fw-semibold">${p.duration} (${GovUtils.formatDate(p.startDate)} - ${GovUtils.formatDate(p.endDate)})</span>
            </div>
            <div class="col-sm-6">
                <small class="text-muted d-block">Risk Classification</small>
                <span class="badge ${p.riskLevel === 'Low' ? 'bg-success' : (p.riskLevel === 'Medium' ? 'bg-warning text-dark' : 'bg-danger')}">${p.riskLevel} Tier Risk</span>
            </div>
        `;

        // Calculate Overall Health Index
        const achievedCount = kpis.filter(k => k.status === 'Achieved').length;
        const onTrackCount = kpis.filter(k => k.status === 'On Track').length;
        const total = kpis.length || 1;
        const healthPercent = Math.round(((achievedCount + (onTrackCount * 0.7)) / total) * 100);

        healthScore.textContent = `${healthPercent}%`;
        if (healthPercent >= 90) {
            healthScore.className = 'display-4 fw-bold text-success';
            healthLabel.className = 'badge bg-success mx-auto p-2';
            healthLabel.textContent = 'EXCELLENT & TARGET ACHIEVED';
        } else if (healthPercent >= 70) {
            healthScore.className = 'display-4 fw-bold text-primary';
            healthLabel.className = 'badge bg-primary mx-auto p-2';
            healthLabel.textContent = 'ON TRACK & PROGRESSING';
        } else {
            healthScore.className = 'display-4 fw-bold text-warning';
            healthLabel.className = 'badge bg-warning text-dark mx-auto p-2';
            healthLabel.textContent = 'ATTENTION REQUIRED / AT RISK';
        }

        // Render KPI Cards
        if (kpis.length === 0) {
            kpiCardsGrid.innerHTML = '<div class="col-12 text-muted text-center py-4">No KPI telemetric sensors mapped to this sandbox.</div>';
        } else {
            kpiCardsGrid.innerHTML = kpis.map(k => {
                let improvement = 0;
                if (k.direction === 'lower') {
                    improvement = ((k.baseline - k.current) / k.baseline) * 100;
                } else {
                    improvement = ((k.current - k.baseline) / k.baseline) * 100;
                }
                const impPercent = Math.round(improvement * 10) / 10;
                const statusBadge = k.status === 'Achieved' ? 'bg-success' : (k.status === 'On Track' ? 'bg-primary' : 'bg-warning text-dark');

                // Compute progress towards target
                let progress = 0;
                if (k.direction === 'lower') {
                    progress = Math.min(Math.max(((k.baseline - k.current) / (k.baseline - k.target)) * 100, 10), 100);
                } else {
                    progress = Math.min(Math.max(((k.current - k.baseline) / (k.target - k.baseline)) * 100, 10), 100);
                }

                return `
                    <div class="col-md-4">
                        <div class="gov-card h-100 mb-0">
                            <div class="gov-card-body">
                                <div class="d-flex justify-content-between align-items-start mb-2">
                                    <h6 class="fw-bold text-navy mb-0">${k.name}</h6>
                                    <span class="badge ${statusBadge}">${k.status}</span>
                                </div>

                                <div class="display-6 fw-bold text-navy my-2">
                                    ${k.current} <small class="fs-6 text-muted font-monospace">${k.unit}</small>
                                </div>

                                <div class="row g-2 mb-3">
                                    <div class="col-6">
                                        <div class="kpi-stat-box">
                                            <small class="text-muted d-block">Baseline</small>
                                            <span class="fw-bold">${k.baseline} ${k.unit}</span>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="kpi-stat-box">
                                            <small class="text-muted d-block">Target Goal</small>
                                            <span class="fw-bold text-success">${k.target} ${k.unit}</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="progress mb-2" style="height: 8px;">
                                    <div class="progress-bar ${k.status === 'Achieved' ? 'bg-success' : 'bg-primary'}" role="progressbar" style="width: ${progress}%;"></div>
                                </div>

                                <div class="d-flex justify-content-between align-items-center small text-muted">
                                    <span>Improvement: <strong class="text-success">${impPercent > 0 ? '+' : ''}${impPercent}%</strong></span>
                                    <span>${k.direction === 'lower' ? '↓ Lower is Better' : '↑ Higher is Better'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // Render Telemetry Table
        readingsTbody.innerHTML = kpis.map(k => {
            const maxVal = Math.max(...k.readings.map(r => r.value), k.baseline, k.target);
            const sparklines = k.readings.map(r => {
                const height = Math.round((r.value / maxVal) * 24) + 4;
                return `<div class="trend-bar" style="height: ${height}px;" title="Week ${r.week}: ${r.value} ${k.unit}"></div>`;
            }).join('');

            let imp = 0;
            if (k.direction === 'lower') imp = ((k.baseline - k.current) / k.baseline) * 100;
            else imp = ((k.current - k.baseline) / k.baseline) * 100;

            return `
                <tr>
                    <td class="fw-bold text-navy">${k.name}</td>
                    <td><span class="badge bg-light text-dark border">${k.baseline} ${k.unit}</span></td>
                    <td><span class="badge bg-light text-success border border-success">${k.target} ${k.unit}</span></td>
                    <td><strong class="text-primary">${k.current} ${k.unit}</strong></td>
                    <td><span class="text-success fw-bold">${Math.round(imp * 10) / 10}%</span></td>
                    <td><div class="trend-sparkline">${sparklines}</div></td>
                    <td class="text-center"><span class="badge-gov ${GovUtils.getBadgeClass(k.status)}">${k.status}</span></td>
                </tr>
            `;
        }).join('');
    }

    selPilot?.addEventListener('change', (e) => {
        renderDashboard(e.target.value);
    });

    // Initialize
    populatePilots();
    if (GovData.pilots.length > 0) {
        renderDashboard(selPilot.value || GovData.pilots[0].id);
    }
});

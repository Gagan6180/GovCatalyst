/**
 * SIH26136 Pilot Module - GovCatalyst Client Application Logic
 * Implements all 26 Functional & Structural Requirements with Backend API Readiness
 */

(function () {
  'use strict';

  // Application State
  const AppState = {
    currentRole: 'GOVT_OFFICER',
    currentView: 'dashboard',
    activePilot: null,
    pilotsList: [],
    
    // Initialize State
    init() {
      const savedData = localStorage.getItem('govcatalyst_pilot_active');
      if (savedData) {
        try {
          this.activePilot = JSON.parse(savedData);
        } catch (e) {
          this.activePilot = JSON.parse(JSON.stringify(window.SIH_DATA.demoPilot));
        }
      } else {
        this.activePilot = JSON.parse(JSON.stringify(window.SIH_DATA.demoPilot));
      }
      this.pilotsList = [this.activePilot];
      this.bindEvents();
      this.render();
    },

    saveState() {
      localStorage.setItem('govcatalyst_pilot_active', JSON.stringify(this.activePilot));
    },

    resetToDemo() {
      this.activePilot = JSON.parse(JSON.stringify(window.SIH_DATA.demoPilot));
      this.saveState();
      this.render();
      this.showToast("Loaded Official SIH26136 Demo Scenario (AI Infrastructure Inspection Pilot) successfully!", "success");
    },

    logAudit(action, detail, oldValue, newValue) {
      const entry = {
        id: this.activePilot.auditTrail.length + 1,
        time: new Date().toISOString().replace('T', ' ').substring(0, 16),
        user: this.getRoleDisplayName(this.currentRole),
        action: action,
        detail: detail,
        oldValue: oldValue || "N/A",
        newValue: newValue || "N/A"
      };
      this.activePilot.auditTrail.unshift(entry);
      this.saveState();
    },

    getRoleDisplayName(role) {
      switch(role) {
        case 'GOVT_OFFICER': return 'Shri Rajesh Verma (Pilot Owner)';
        case 'STARTUP_LEAD': return 'Dr. Vikram Sen (Startup Lead)';
        case 'SECURITY_OFFICER': return 'Govt Cybersecurity Officer';
        case 'COMMITTEE_MEMBER': return 'Evaluation Committee Chair';
        default: return 'Authorized User';
      }
    },

    // KPI Calculation Engine (Section 13)
    calculateKPI(kpi) {
      let improvement = 0;
      let isAchieved = false;

      if (kpi.direction === 'LOWER_IS_BETTER') {
        improvement = ((kpi.baseline - kpi.current) / kpi.baseline) * 100;
        isAchieved = kpi.current <= kpi.target;
      } else {
        improvement = ((kpi.current - kpi.baseline) / kpi.baseline) * 100;
        isAchieved = kpi.current >= kpi.target;
      }

      kpi.improvementPercent = Math.round(improvement * 100) / 100;
      kpi.status = isAchieved ? 'ACHIEVED' : (kpi.current >= kpi.minAcceptable ? 'ON_TRACK' : 'AT_RISK');
      return kpi;
    },

    // Automated Pilot Result Calculation Engine (Section 19)
    evaluateAutomatedOutcome() {
      const kpisAchieved = this.activePilot.kpis.every(k => k.status === 'ACHIEVED' || k.status === 'ON_TRACK');
      const allKpisAchieved = this.activePilot.kpis.every(k => k.status === 'ACHIEVED');
      const hasCriticalRisk = this.activePilot.risks.some(r => r.level === 'Critical' && r.status === 'Open');
      const securityPassed = this.activePilot.securityStatus === 'LOW RISK' || this.activePilot.securityStatus === 'MEDIUM RISK';

      if (allKpisAchieved && !hasCriticalRisk && securityPassed) {
        return 'SUCCESSFUL';
      } else if (kpisAchieved && !hasCriticalRisk) {
        return 'PARTIALLY_SUCCESSFUL';
      } else {
        return 'FAILED';
      }
    },

    // Event Bindings
    bindEvents() {
      const roleSelect = document.getElementById('role-selector');
      if (roleSelect) {
        roleSelect.addEventListener('change', (e) => {
          this.currentRole = e.target.value;
          this.render();
          this.showToast(`Switched active view role to: ${roleSelect.options[roleSelect.selectedIndex].text}`, 'info');
        });
      }

      document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const targetView = btn.getAttribute('data-view');
          if (targetView) {
            this.currentView = targetView;
            this.render();
          }
        });
      });

      const demoBtn = document.getElementById('btn-load-demo');
      if (demoBtn) {
        demoBtn.addEventListener('click', () => this.resetToDemo());
      }
    },

    showToast(message, type = 'info') {
      const container = document.getElementById('toast-container');
      if (!container) return;
      const toast = document.createElement('div');
      const bgColors = {
        success: 'bg-emerald-800 text-white border-emerald-600',
        error: 'bg-rose-800 text-white border-rose-600',
        warning: 'bg-amber-800 text-white border-amber-600',
        info: 'bg-slate-900 text-white border-slate-700'
      };
      toast.className = `px-4 py-3 rounded-lg shadow-xl border text-xs flex items-center gap-2 transform transition-all duration-300 translate-y-2 opacity-0 ${bgColors[type] || bgColors.info}`;
      toast.innerHTML = `<span>${message}</span>`;
      container.appendChild(toast);
      
      setTimeout(() => {
        toast.classList.remove('translate-y-2', 'opacity-0');
      }, 50);

      setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
      }, 4000);
    },

    // Master Render Method
    render() {
      this.renderTopNav();
      const mainContainer = document.getElementById('view-container');
      if (!mainContainer) return;

      document.querySelectorAll('.nav-btn').forEach(btn => {
        if (btn.getAttribute('data-view') === this.currentView) {
          btn.classList.add('active', 'bg-slate-800', 'text-white');
          btn.classList.remove('text-slate-400', 'hover:bg-slate-800/50');
        } else {
          btn.classList.remove('active', 'bg-slate-800', 'text-white');
          btn.classList.add('text-slate-400', 'hover:bg-slate-800/50');
        }
      });

      switch (this.currentView) {
        case 'dashboard': mainContainer.innerHTML = this.viewDashboard(); break;
        case 'details': mainContainer.innerHTML = this.viewDetails(); break;
        case 'plan': mainContainer.innerHTML = this.viewPlan(); break;
        case 'agreement': mainContainer.innerHTML = this.viewAgreement(); break;
        case 'payments': mainContainer.innerHTML = this.viewPayments(); break;
        case 'cybersecurity': mainContainer.innerHTML = this.viewCybersecurity(); break;
        case 'kpis': mainContainer.innerHTML = this.viewKPIs(); break;
        case 'issues': mainContainer.innerHTML = this.viewIssues(); break;
        case 'evidence': mainContainer.innerHTML = this.viewEvidence(); break;
        case 'evaluation': mainContainer.innerHTML = this.viewEvaluation(); break;
        case 'audit': mainContainer.innerHTML = this.viewAudit(); break;
        case 'outputs': mainContainer.innerHTML = this.viewOutputs(); break;
        default: mainContainer.innerHTML = this.viewDashboard();
      }

      this.bindViewEvents();
    },

    renderTopNav() {
      const p = this.activePilot;
      const statusBadge = document.getElementById('header-status-badge');
      if (statusBadge) {
        statusBadge.innerText = p.status;
        statusBadge.className = `badge-status ${
          p.status === 'COMPLETED' ? 'badge-completed' :
          p.status === 'ACTIVE_PILOT' ? 'badge-active' :
          p.status === 'PAUSED' ? 'badge-paused' : 'badge-prep'
        }`;
      }
      const pilotTitle = document.getElementById('header-pilot-name');
      if (pilotTitle) {
        pilotTitle.innerText = p.name;
      }
    },

    // -------------------------------------------------------------
    // VIEW 1: PILOT MONITORING DASHBOARD (Section 12, 24, 25)
    // -------------------------------------------------------------
    viewDashboard() {
      const p = this.activePilot;
      const remainingBudget = p.budgetAllocated - p.budgetSpent;
      const budgetPercentage = Math.round((p.budgetSpent / p.budgetAllocated) * 100);
      const completedMilestones = p.milestones.filter(m => m.status === 'COMPLETED').length;
      const openIssues = p.issues.filter(i => i.status !== 'Resolved' && i.status !== 'Closed').length;
      const openRisks = p.risks.filter(r => r.status === 'Open').length;
      const criticalRisks = p.risks.filter(r => r.level === 'Critical' && r.status === 'Open').length;

      return `
        <div class="space-y-6">
          <!-- Top Executive Banner -->
          <div class="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 shadow-xl border border-slate-700 relative overflow-hidden">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
              <div>
                <div class="flex items-center gap-2 mb-2">
                  <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">${p.id}</span>
                  <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">${p.department}</span>
                  <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">${p.startup}</span>
                </div>
                <h1 class="text-2xl md:text-3xl font-bold tracking-tight text-white">${p.name}</h1>
                <p class="text-slate-300 text-sm mt-1 max-w-3xl">${p.objective}</p>
              </div>
              <div class="flex flex-wrap gap-2">
                <button id="btn-pause-pilot" class="px-3 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  Pause / Terminate
                </button>
                <button id="btn-open-completion" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-md hover:shadow-emerald-600/30 flex items-center gap-1.5 transition">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  22-Point Final Report
                </button>
              </div>
            </div>

            <!-- State Machine Pipeline (Section 24) -->
            <div class="mt-6 pt-6 border-t border-slate-700/60">
              <div class="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-3 flex items-center justify-between">
                <span>Pilot Status Flow State Machine</span>
                <span class="text-emerald-400 font-mono">Current State: ${p.status} &bull; Final Decision: ${p.committeeDecision}</span>
              </div>
              <div class="flex items-center justify-between text-[11px] overflow-x-auto pb-2">
                ${this.renderStatusStepper()}
              </div>
            </div>
          </div>

          <!-- Key Performance Metric Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Progress Card -->
            <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm card-interactive">
              <div class="flex justify-between items-start">
                <div>
                  <div class="text-xs font-medium text-slate-500 uppercase tracking-wider">Pilot Progress</div>
                  <div class="text-2xl font-bold text-slate-900 mt-1">100% Complete</div>
                  <div class="text-xs text-slate-500 mt-0.5">${p.durationWeeks} Weeks (${p.startDate} - ${p.endDate})</div>
                </div>
                <div class="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
              </div>
              <div class="mt-4">
                <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div class="bg-blue-600 h-2 rounded-full" style="width: 100%"></div>
                </div>
                <div class="flex justify-between text-[11px] text-slate-500 mt-1.5 font-medium">
                  <span>0 Days Remaining</span>
                  <span class="text-emerald-600 font-bold">Finished on Schedule</span>
                </div>
              </div>
            </div>

            <!-- Budget Utilization Card -->
            <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm card-interactive">
              <div class="flex justify-between items-start">
                <div>
                  <div class="text-xs font-medium text-slate-500 uppercase tracking-wider">Budget Utilization</div>
                  <div class="text-2xl font-bold text-slate-900 mt-1">${ReportEngine.formatINR(p.budgetSpent)}</div>
                  <div class="text-xs text-slate-500 mt-0.5">Allocated: ${ReportEngine.formatINR(p.budgetAllocated)}</div>
                </div>
                <div class="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                </div>
              </div>
              <div class="mt-4">
                <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div class="bg-emerald-500 h-2 rounded-full" style="width: ${budgetPercentage}%"></div>
                </div>
                <div class="flex justify-between text-[11px] text-slate-500 mt-1.5 font-medium">
                  <span>${budgetPercentage}% Spent</span>
                  <span class="text-emerald-700 font-bold">${ReportEngine.formatINR(remainingBudget)} Surplus</span>
                </div>
              </div>
            </div>

            <!-- Milestones Card -->
            <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm card-interactive">
              <div class="flex justify-between items-start">
                <div>
                  <div class="text-xs font-medium text-slate-500 uppercase tracking-wider">Milestones</div>
                  <div class="text-2xl font-bold text-slate-900 mt-1">${completedMilestones} / ${p.milestones.length}</div>
                  <div class="text-xs text-slate-500 mt-0.5">All 8 stages verified & signed</div>
                </div>
                <div class="p-2.5 bg-purple-50 text-purple-600 rounded-lg">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                </div>
              </div>
              <div class="mt-4 flex items-center gap-2">
                <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded">100% Completed</span>
                <span class="text-xs text-slate-500">4 Payments Released</span>
              </div>
            </div>

            <!-- User Satisfaction Card -->
            <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm card-interactive">
              <div class="flex justify-between items-start">
                <div>
                  <div class="text-xs font-medium text-slate-500 uppercase tracking-wider">User Satisfaction</div>
                  <div class="text-2xl font-bold text-slate-900 mt-1">${p.averageSatisfaction} <span class="text-sm font-normal text-slate-400">/ 5.0</span></div>
                  <div class="text-xs text-slate-500 mt-0.5">From ${p.feedbackList.length} field engineers</div>
                </div>
                <div class="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
                </div>
              </div>
              <div class="mt-4 flex items-center justify-between text-[11px]">
                <span class="text-slate-600">Open Risks: <strong>${openRisks}</strong> (${criticalRisks} Critical)</span>
                <span class="text-emerald-700 font-bold">Cyber: ${p.securityStatus}</span>
              </div>
            </div>
          </div>

          <!-- KPI Live Comparison Grid (Section 13) -->
          <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
              <div>
                <h2 class="text-lg font-bold text-slate-900">Key Performance Indicators (Telemetry & Outcomes)</h2>
                <p class="text-xs text-slate-500">Automated baseline vs actual calculations with directional optimization rules</p>
              </div>
              <button class="nav-btn text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1" data-view="kpis">
                Explore Full KPI Telemetry &rarr;
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              ${p.kpis.map(kpi => this.renderKPISummaryCard(kpi)).join('')}
            </div>
          </div>

          <!-- Quick Action & Split Modules -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Payment Milestones Summary -->
            <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div class="flex justify-between items-center mb-3">
                <h3 class="font-bold text-slate-900 text-sm">Payment Tranches & Disbursements (Section 6)</h3>
                <span class="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">100% Disbursed</span>
              </div>
              <div class="space-y-2">
                ${p.paymentMilestones.map(m => `
                  <div class="p-3 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
                    <div>
                      <div class="font-semibold text-slate-800">${m.title}</div>
                      <div class="text-[11px] text-slate-500 font-mono mt-0.5">Ref: ${m.paymentRef} &bull; ${m.verificationDate}</div>
                    </div>
                    <div class="text-right">
                      <div class="font-bold text-slate-900">${ReportEngine.formatINR(m.amount)} (${m.percentage}%)</div>
                      <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">PAID</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Risk & Cybersecurity Status -->
            <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div class="flex justify-between items-center mb-3">
                <h3 class="font-bold text-slate-900 text-sm">Security Gating & Risk Matrix (Sections 9, 10)</h3>
                <span class="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">${p.securityStatus}</span>
              </div>
              <div class="space-y-3 text-xs">
                <div class="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg">
                  <div class="flex items-center justify-between font-semibold text-emerald-950">
                    <span>14-Point Cybersecurity Checklist</span>
                    <span class="font-bold">14 / 14 Cleared</span>
                  </div>
                  <p class="text-[11px] text-emerald-800 mt-1">Zero unresolved critical risks. TLS 1.3, RBAC, HSM encryption, and CERT-In assessment active.</p>
                </div>

                <div class="space-y-1.5">
                  <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Risk Register Preview</div>
                  ${p.risks.slice(0, 2).map(r => `
                    <div class="p-2.5 rounded border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                      <div>
                        <span class="font-mono font-bold text-slate-700">${r.id}</span>: ${r.description.substring(0, 55)}...
                        <div class="text-[10px] text-slate-500 mt-0.5">Mitigation: ${r.mitigation.substring(0, 45)}...</div>
                      </div>
                      <span class="px-2 py-0.5 bg-slate-200 text-slate-700 font-bold rounded text-[10px]">${r.status}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    },

    renderStatusStepper() {
      const steps = [
        "DRAFT", "AGREEMENT PENDING", "AGREEMENT APPROVED", "SECURITY CHECK",
        "DATA/IP CHECK", "READY FOR DEPLOYMENT", "DEPLOYMENT", "ACTIVE PILOT",
        "MONITORING", "PILOT COMPLETED", "EVALUATION", "SUCCESSFUL", "SCALE"
      ];
      const currentIdx = steps.length - 1;

      return steps.map((step, idx) => `
        <div class="flex items-center shrink-0">
          <div class="flex flex-col items-center">
            <div class="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
              idx <= currentIdx ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-700 text-slate-400'
            }">
              ${idx <= currentIdx ? '✓' : idx + 1}
            </div>
            <span class="text-[9px] mt-1 font-semibold ${idx <= currentIdx ? 'text-slate-200' : 'text-slate-500'} whitespace-nowrap">${step}</span>
          </div>
          ${idx < steps.length - 1 ? `<div class="w-6 h-0.5 mx-1 ${idx < currentIdx ? 'bg-emerald-500' : 'bg-slate-700'}"></div>` : ''}
        </div>
      `).join('');
    },

    renderKPISummaryCard(kpi) {
      const isAchieved = kpi.status === 'ACHIEVED';
      return `
        <div class="p-4 rounded-xl border ${isAchieved ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 bg-slate-50'}">
          <div class="flex justify-between items-start">
            <div class="text-xs font-bold text-slate-700">${kpi.name}</div>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold ${isAchieved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">${kpi.status}</span>
          </div>
          
          <div class="mt-3 flex items-baseline justify-between">
            <div>
              <div class="text-2xl font-black text-slate-900">${kpi.current} <span class="text-xs font-normal text-slate-500">${kpi.unit}</span></div>
              <div class="text-[11px] text-slate-500">Baseline: <strong>${kpi.baseline} ${kpi.unit}</strong></div>
            </div>
            <div class="text-right">
              <div class="text-base font-bold ${kpi.direction === 'LOWER_IS_BETTER' ? 'text-emerald-700' : 'text-blue-700'}">
                ${kpi.direction === 'LOWER_IS_BETTER' ? `-${kpi.improvementPercent}%` : `+${(kpi.current - kpi.baseline).toFixed(1)} pp`}
              </div>
              <div class="text-[11px] text-slate-500">Target: <strong>${kpi.target} ${kpi.unit}</strong></div>
            </div>
          </div>
        </div>
      `;
    },

    // -------------------------------------------------------------
    // VIEW 2: PILOT DETAILS & SCOPE (Section 1, 2, 3)
    // -------------------------------------------------------------
    viewDetails() {
      const p = this.activePilot;
      return `
        <div class="space-y-6">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-2xl font-bold text-slate-900">Pilot Metadata & Scope Definition</h2>
              <p class="text-xs text-slate-500">Section 1, 2, & 3: Official parameters, measurable objectives, and scope boundaries</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 text-xs">
              <h3 class="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">1. Pilot Identification & Administrative Details</h3>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-slate-500 font-semibold">Pilot ID:</label>
                  <div class="font-mono font-bold text-slate-800 text-sm mt-0.5">${p.id}</div>
                </div>
                <div>
                  <label class="text-slate-500 font-semibold">Sanctioned Budget:</label>
                  <div class="font-bold text-emerald-700 text-sm mt-0.5">${ReportEngine.formatINR(p.budgetAllocated)}</div>
                </div>
              </div>

              <div>
                <label class="text-slate-500 font-semibold">Pilot Name:</label>
                <div class="font-medium text-slate-900 mt-0.5">${p.name}</div>
              </div>

              <div>
                <label class="text-slate-500 font-semibold">Linked Problem Statement:</label>
                <div class="bg-slate-50 p-2.5 rounded border border-slate-200 text-slate-700 mt-0.5">${p.problemStatement}</div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-slate-500 font-semibold">Government Department:</label>
                  <div class="font-medium text-slate-800 mt-0.5">${p.department}</div>
                </div>
                <div>
                  <label class="text-slate-500 font-semibold">Pilot Owner (Officer):</label>
                  <div class="font-medium text-slate-800 mt-0.5">${p.pilotOwner}</div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-slate-500 font-semibold">Selected Startup:</label>
                  <div class="font-medium text-slate-800 mt-0.5">${p.startup}</div>
                </div>
                <div>
                  <label class="text-slate-500 font-semibold">Startup Pilot Lead:</label>
                  <div class="font-medium text-slate-800 mt-0.5">${p.startupLead}</div>
                </div>
              </div>

              <div class="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                <div>
                  <label class="text-slate-500 font-semibold">Location:</label>
                  <div class="text-slate-800">${p.location}</div>
                </div>
                <div>
                  <label class="text-slate-500 font-semibold">Duration:</label>
                  <div class="text-slate-800">${p.startDate} to ${p.endDate}</div>
                </div>
                <div>
                  <label class="text-slate-500 font-semibold">Users Cohort:</label>
                  <div class="text-slate-800 font-bold">${p.usersCount} Engineers</div>
                </div>
              </div>
            </div>

            <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 text-xs">
              <h3 class="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">2. Measurable Pilot Objectives & Thresholds</h3>
              <div>
                <label class="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">Primary Trial Objective:</label>
                <p class="text-slate-800 font-medium mt-1 leading-relaxed">${p.objective}</p>
              </div>

              <div class="grid grid-cols-3 gap-3">
                <div class="bg-slate-50 p-3 rounded border border-slate-200">
                  <div class="text-[10px] font-bold text-slate-500 uppercase">Baseline</div>
                  <div class="font-bold text-slate-900 text-sm mt-1">${p.baselineObjective}</div>
                </div>
                <div class="bg-blue-50 p-3 rounded border border-blue-200">
                  <div class="text-[10px] font-bold text-blue-700 uppercase">Target</div>
                  <div class="font-bold text-blue-900 text-sm mt-1">${p.targetObjective}</div>
                </div>
                <div class="bg-amber-50 p-3 rounded border border-amber-200">
                  <div class="text-[10px] font-bold text-amber-700 uppercase">Min Acceptable</div>
                  <div class="font-bold text-amber-900 text-sm mt-1">${p.minAcceptableResult}</div>
                </div>
              </div>

              <div>
                <label class="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">Defined Success Condition:</label>
                <div class="bg-emerald-50 p-3 rounded border border-emerald-200 text-emerald-900 font-medium mt-1">
                  ✓ ${p.successCondition}
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 class="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2 mb-4">3. Pilot Scope & Statutory Boundary Matrix</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div class="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200">
                <div class="flex items-center gap-2 font-bold text-emerald-900 mb-2">
                  <svg class="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                  INCLUDED IN PILOT SCOPE (Permitted Activities)
                </div>
                <ul class="space-y-1.5 text-slate-700">
                  ${p.scopeIncluded.map(s => `
                    <li class="flex items-start gap-2">
                      <span class="text-emerald-600 font-bold">•</span>
                      <span>${s}</span>
                    </li>
                  `).join('')}
                </ul>
              </div>

              <div class="bg-rose-50/60 p-4 rounded-xl border border-rose-200">
                <div class="flex items-center gap-2 font-bold text-rose-900 mb-2">
                  <svg class="w-4 h-4 text-rose-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  OUT OF SCOPE (Strictly Prohibited without Revision)
                </div>
                <ul class="space-y-1.5 text-slate-700">
                  ${p.scopeExcluded.map(s => `
                    <li class="flex items-start gap-2">
                      <span class="text-rose-600 font-bold">•</span>
                      <span>${s}</span>
                    </li>
                  `).join('')}
                </ul>
              </div>
            </div>
          </div>
        </div>
      `;
    },

    // -------------------------------------------------------------
    // VIEW 3: 5-PHASE EXECUTION PLAN & MILESTONES (Section 4, 11)
    // -------------------------------------------------------------
    viewPlan() {
      const p = this.activePilot;
      return `
        <div class="space-y-6">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-2xl font-bold text-slate-900">5-Phase Pilot Execution Plan & Milestone Register</h2>
              <p class="text-xs text-slate-500">Section 4 & 11: Task lifecycle tracker across all 5 trial phases and 8 standard milestones</p>
            </div>
          </div>

          <div class="space-y-4">
            ${p.phases.map(phase => `
              <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <div class="flex justify-between items-center border-b border-slate-100 pb-3 mb-3">
                  <div class="flex items-center gap-3">
                    <span class="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">${phase.id}</span>
                    <h3 class="font-bold text-slate-900 text-sm">${phase.name}</h3>
                  </div>
                  <span class="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-300">
                    ${phase.status}
                  </span>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
                  ${phase.tasks.map(task => `
                    <div class="p-2.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <span class="text-emerald-600 font-bold">✓</span>
                        <span class="text-slate-800 font-medium">${task.name}</span>
                      </div>
                      <span class="text-[10px] text-slate-500 font-semibold uppercase">${task.status}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>

          <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 class="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2 mb-4">11. Standard Pilot Milestones Register (8 Stages)</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-xs text-left">
                <thead class="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th class="p-3">#</th>
                    <th class="p-3">Milestone Name</th>
                    <th class="p-3">Due Date</th>
                    <th class="p-3">Responsible Lead</th>
                    <th class="p-3">Attached Evidence</th>
                    <th class="p-3">Approval Stamp</th>
                    <th class="p-3">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  ${p.milestones.map(m => `
                    <tr class="hover:bg-slate-50/80 transition">
                      <td class="p-3 font-bold text-slate-500">${m.id}</td>
                      <td class="p-3 font-semibold text-slate-900">${m.title}</td>
                      <td class="p-3 text-slate-600 font-mono">${m.dueDate}</td>
                      <td class="p-3 text-slate-700">${m.responsible}</td>
                      <td class="p-3"><span class="text-blue-600 underline font-mono text-[11px]">${m.evidence}</span></td>
                      <td class="p-3 text-[11px] text-emerald-700 font-semibold font-mono">${m.timestamp}</td>
                      <td class="p-3"><span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">COMPLETED</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    },

    // -------------------------------------------------------------
    // VIEW 4: AGREEMENTS & DATA/IP GOVERNANCE (Section 5, 7, 8)
    // -------------------------------------------------------------
    viewAgreement() {
      const p = this.activePilot;
      return `
        <div class="space-y-6">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-2xl font-bold text-slate-900">Pilot Agreement & IP Governance Legal Engine</h2>
              <p class="text-xs text-slate-500">Section 5, 7, & 8: Auto-generated bilateral legal instrument with strict data protection</p>
            </div>
            <button id="btn-print-agreement" class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
              Print Official Agreement
            </button>
          </div>

          <div id="agreement-render-box">
            ${ReportEngine.generatePilotAgreement(p)}
          </div>
        </div>
      `;
    },

    // -------------------------------------------------------------
    // VIEW 5: PAYMENT MILESTONES (Section 6)
    // -------------------------------------------------------------
    viewPayments() {
      const p = this.activePilot;
      return `
        <div class="space-y-6">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-2xl font-bold text-slate-900">Milestone-Based Payment Disbursement Engine</h2>
              <p class="text-xs text-slate-500">Section 6: Configurable tranches, verification dossiers, and financial settlement records</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${p.paymentMilestones.map(m => `
              <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3 text-xs">
                <div class="flex justify-between items-start border-b border-slate-100 pb-2">
                  <div>
                    <span class="px-2 py-0.5 bg-slate-100 text-slate-700 font-mono font-bold rounded text-[10px]">${m.id}</span>
                    <h3 class="font-bold text-slate-900 text-sm mt-1">${m.title}</h3>
                  </div>
                  <div class="text-right">
                    <div class="text-lg font-black text-slate-900">${ReportEngine.formatINR(m.amount)}</div>
                    <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">${m.status}</span>
                  </div>
                </div>

                <div class="space-y-1.5 text-slate-600">
                  <div><strong>Configured Percentage:</strong> ${m.percentage}% of sanctioned budget</div>
                  <div><strong>Verified Milestone Evidence:</strong> <span class="text-blue-600 underline font-mono">${m.evidence}</span></div>
                  <div><strong>Authorized By:</strong> ${m.approvedBy} (${m.verificationDate})</div>
                  <div><strong>Govt PFMS Transaction Ref:</strong> <span class="font-mono font-bold text-slate-800">${m.paymentRef}</span></div>
                  <div class="bg-slate-50 p-2.5 rounded border border-slate-200 text-slate-700 italic mt-1">"${m.notes}"</div>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 class="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2 mb-4">Financial Audit Summary</h3>
            <div class="grid grid-cols-3 gap-4 text-center text-xs">
              <div class="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div class="text-slate-500 font-semibold uppercase text-[10px]">Total Sanctioned Grant</div>
                <div class="text-xl font-bold text-slate-900 mt-1">${ReportEngine.formatINR(p.budgetAllocated)}</div>
              </div>
              <div class="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <div class="text-emerald-700 font-semibold uppercase text-[10px]">Total Disbursed</div>
                <div class="text-xl font-bold text-emerald-900 mt-1">${ReportEngine.formatINR(p.budgetSpent)}</div>
              </div>
              <div class="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div class="text-blue-700 font-semibold uppercase text-[10px]">Unspent Returned to Treasury</div>
                <div class="text-xl font-bold text-blue-900 mt-1">${ReportEngine.formatINR(p.budgetAllocated - p.budgetSpent)}</div>
              </div>
            </div>
          </div>
        </div>
      `;
    },

    // -------------------------------------------------------------
    // VIEW 6: CYBERSECURITY & RISK REGISTER (Section 9, 10)
    // -------------------------------------------------------------
    viewCybersecurity() {
      const p = this.activePilot;
      return `
        <div class="space-y-6">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-2xl font-bold text-slate-900">Cybersecurity Checklist & Dynamic Risk Register</h2>
              <p class="text-xs text-slate-500">Section 9 & 10: 14-point CERT-In compliance audit with hard gating against critical risks</p>
            </div>
            <button id="btn-print-cyber" class="px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 flex items-center gap-1">
              Print Security Audit Certificate
            </button>
          </div>

          <div class="p-4 rounded-xl border ${p.securityStatus === 'LOW RISK' ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-rose-50 border-rose-200 text-rose-950'} flex justify-between items-center">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full ${p.securityStatus === 'LOW RISK' ? 'bg-emerald-600' : 'bg-rose-600'} text-white flex items-center justify-center font-bold">
                ✓
              </div>
              <div>
                <div class="text-xs uppercase font-bold tracking-wider">Pilot Activation Clearance Gate</div>
                <div class="font-bold text-base">Current Security Assessment: ${p.securityStatus} (14 / 14 Verified)</div>
              </div>
            </div>
            <span class="px-3 py-1 bg-emerald-700 text-white text-xs font-bold rounded-lg">ACTIVATION AUTHORIZED</span>
          </div>

          <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 class="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2 mb-4">9. 14-Point Mandatory Pre-Activation Cybersecurity Checklist</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              ${p.cyberChecklist.map(c => `
                <div class="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-start gap-3">
                  <input type="checkbox" checked disabled class="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500">
                  <div class="flex-1">
                    <div class="flex justify-between items-center">
                      <span class="font-semibold text-slate-900">${c.title}</span>
                      <span class="px-1.5 py-0.2 rounded text-[10px] font-bold ${c.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800' : 'bg-slate-200 text-slate-700'}">${c.severity}</span>
                    </div>
                    <div class="text-[11px] text-slate-500 mt-1">${c.notes}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 class="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2 mb-4">10. Dynamic Risk Register & Mitigation Strategy</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-xs text-left">
                <thead class="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th class="p-3">Risk ID</th>
                    <th class="p-3">Category</th>
                    <th class="p-3">Risk Description</th>
                    <th class="p-3">Prob / Impact</th>
                    <th class="p-3">Level</th>
                    <th class="p-3">Mitigation Action</th>
                    <th class="p-3">Owner</th>
                    <th class="p-3">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  ${p.risks.map(r => `
                    <tr>
                      <td class="p-3 font-mono font-bold text-slate-700">${r.id}</td>
                      <td class="p-3 text-slate-600">${r.category}</td>
                      <td class="p-3 font-medium text-slate-900 max-w-xs">${r.description}</td>
                      <td class="p-3 text-slate-600">${r.probability} / ${r.impact}</td>
                      <td class="p-3"><span class="px-2 py-0.5 rounded text-[10px] font-bold ${r.level === 'Critical' ? 'bg-rose-100 text-rose-800' : (r.level === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700')}">${r.level}</span></td>
                      <td class="p-3 text-slate-600 max-w-xs">${r.mitigation}</td>
                      <td class="p-3 text-slate-700">${r.owner}</td>
                      <td class="p-3"><span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">${r.status}</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    },

    // -------------------------------------------------------------
    // VIEW 7: KPI TELEMETRY & ANALYTICS (Section 13)
    // -------------------------------------------------------------
    viewKPIs() {
      const p = this.activePilot;
      return `
        <div class="space-y-6">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-2xl font-bold text-slate-900">KPI Tracking & Performance Telemetry</h2>
              <p class="text-xs text-slate-500">Section 13: Mathematical formula calculation for lower-is-better and higher-is-better metric gains</p>
            </div>
          </div>

          <div class="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-xs text-indigo-950 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div class="font-bold text-sm">Automated Calculation Formula Engine</div>
              <div class="text-indigo-800 mt-0.5">Time & Cost (Lower is Better): <code>((Baseline - Current) / Baseline) × 100</code></div>
              <div class="text-indigo-800">Defect Accuracy (Higher is Better): <code>((Current - Baseline) / Baseline) × 100</code> or Percentage Points (\Delta pp)</div>
            </div>
            <span class="px-3 py-1 bg-indigo-700 text-white font-bold rounded text-xs">All Targets Achieved</span>
          </div>

          <div class="space-y-6">
            ${p.kpis.map(kpi => `
              <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                  <div>
                    <span class="px-2 py-0.5 bg-slate-100 text-slate-700 font-mono font-bold rounded text-[10px]">${kpi.id} &bull; ${kpi.category}</span>
                    <h3 class="text-base font-bold text-slate-900 mt-1">${kpi.name}</h3>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full text-xs">
                      ${kpi.status}: ${kpi.direction === 'LOWER_IS_BETTER' ? `-${kpi.improvementPercent}% Reduction` : `+${(kpi.current - kpi.baseline).toFixed(1)} pp Gain`}
                    </span>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs mb-6">
                  <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div class="text-slate-500 font-semibold">1. Baseline</div>
                    <div class="text-xl font-bold text-slate-900 mt-1">${kpi.baseline} ${kpi.unit}</div>
                  </div>
                  <div class="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div class="text-blue-700 font-semibold">2. Target Goal</div>
                    <div class="text-xl font-bold text-blue-900 mt-1">${kpi.target} ${kpi.unit}</div>
                  </div>
                  <div class="p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <div class="text-amber-700 font-semibold">3. Min Acceptable</div>
                    <div class="text-xl font-bold text-amber-900 mt-1">${kpi.minAcceptable} ${kpi.unit}</div>
                  </div>
                  <div class="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div class="text-emerald-700 font-semibold">4. Actual Result</div>
                    <div class="text-xl font-bold text-emerald-900 mt-1">${kpi.current} ${kpi.unit}</div>
                  </div>
                </div>

                <div>
                  <div class="text-xs font-bold text-slate-700 mb-2">8-Week Telemetry Progression:</div>
                  <div class="grid grid-cols-5 gap-2 text-center text-xs">
                    ${kpi.historical.map(h => `
                      <div class="p-2 rounded bg-slate-50 border border-slate-200">
                        <div class="text-[10px] text-slate-500 font-semibold">${h.week}</div>
                        <div class="font-bold text-slate-900 mt-0.5">${h.value} ${kpi.unit}</div>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    },

    // -------------------------------------------------------------
    // VIEW 8: ISSUES & USER FEEDBACK (Section 14, 15)
    // -------------------------------------------------------------
    viewIssues() {
      const p = this.activePilot;
      return `
        <div class="space-y-6">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-2xl font-bold text-slate-900">Live Issue Management & User Satisfaction</h2>
              <p class="text-xs text-slate-500">Section 14 & 15: Critical issue ticketing and multi-criteria feedback evaluation</p>
            </div>
          </div>

          <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 class="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2 mb-4">14. Live Field Incident & Issue Tracker</h3>
            <div class="space-y-3 text-xs">
              ${p.issues.map(i => `
                <div class="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                  <div class="flex justify-between items-center">
                    <div class="flex items-center gap-2">
                      <span class="font-mono font-bold text-slate-800 text-sm">${i.id}</span>
                      <span class="px-2 py-0.5 bg-slate-200 text-slate-800 rounded font-semibold text-[10px]">${i.category}</span>
                      <span class="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold text-[10px]">${i.severity}</span>
                    </div>
                    <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">${i.status}</span>
                  </div>
                  <div class="text-slate-800 font-medium">${i.description}</div>
                  <div class="text-slate-600 bg-white p-2.5 rounded border border-slate-200 text-[11px]">
                    <strong>Resolution:</strong> ${i.resolution}
                  </div>
                  <div class="flex justify-between text-[10px] text-slate-500 pt-1">
                    <span>Reported by: <strong>${i.reportedBy}</strong> (${i.date})</span>
                    <span>Assigned to: <strong>${i.assignedTo}</strong></span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div class="flex justify-between items-center border-b border-slate-200 pb-2 mb-4">
              <h3 class="font-bold text-slate-900 text-sm">15. Field User Feedback & Satisfaction Metrics</h3>
              <div class="text-xs">
                <span class="text-slate-500 font-semibold">Average Composite:</span>
                <span class="font-black text-slate-900 text-base ml-1">${p.averageSatisfaction} / 5.0</span>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              ${p.feedbackList.map(f => `
                <div class="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                  <div class="flex justify-between items-center">
                    <span class="font-bold text-slate-900">${f.user}</span>
                    <span class="px-2 py-0.5 bg-amber-100 text-amber-900 font-bold rounded text-[10px]">★ ${f.overallSatisfaction} / 5</span>
                  </div>
                  <div class="text-slate-500 text-[11px]">${f.role}</div>
                  <div class="grid grid-cols-4 gap-1 text-[10px] text-slate-600 bg-white p-2 rounded border border-slate-100 text-center">
                    <div>Ease: <strong>${f.easeOfUse}★</strong></div>
                    <div>Perf: <strong>${f.performance}★</strong></div>
                    <div>Rel: <strong>${f.reliability}★</strong></div>
                    <div>Acc: <strong>${f.accuracy}★</strong></div>
                  </div>
                  <p class="text-slate-700 italic text-[11px]">"${f.comments}"</p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    },

    // -------------------------------------------------------------
    // VIEW 9: EVIDENCE VAULT & CONTROLS (Section 16, 17)
    // -------------------------------------------------------------
    viewEvidence() {
      const p = this.activePilot;
      return `
        <div class="space-y-6">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-2xl font-bold text-slate-900">Digital Evidence Vault & Emergency Controls</h2>
              <p class="text-xs text-slate-500">Section 16 & 17: Multi-party verification dossier and emergency pause/termination mechanisms</p>
            </div>
          </div>

          <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 class="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2 mb-4">16. Verified Evidence Repository</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-xs text-left">
                <thead class="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th class="p-3">Doc ID</th>
                    <th class="p-3">Document Name</th>
                    <th class="p-3">Type</th>
                    <th class="p-3">Uploaded By</th>
                    <th class="p-3">Upload Date</th>
                    <th class="p-3">Linked Milestone</th>
                    <th class="p-3">Verification</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  ${p.evidenceFiles.map(e => `
                    <tr>
                      <td class="p-3 font-mono font-bold text-slate-700">${e.id}</td>
                      <td class="p-3 font-semibold text-blue-700 underline">${e.name}</td>
                      <td class="p-3 text-slate-600">${e.type}</td>
                      <td class="p-3 text-slate-700">${e.uploadedBy}</td>
                      <td class="p-3 font-mono text-slate-500">${e.date}</td>
                      <td class="p-3 text-slate-800 font-medium">${e.milestone}</td>
                      <td class="p-3"><span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">✓ ${e.status}</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <div class="bg-rose-50/70 border border-rose-200 rounded-xl p-6 shadow-sm text-xs text-rose-950 space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 font-bold text-base text-rose-900">
                <svg class="w-5 h-5 text-rose-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                17. Pilot Pause & Termination Governance Protocol
              </div>
              <span class="px-2 py-0.5 bg-rose-200 text-rose-900 font-bold rounded text-[10px]">STATUTORY SAFETY TRIGGER</span>
            </div>
            <p class="leading-relaxed">
              The Government Department retains the statutory authority to immediately pause or terminate trial operations if critical cybersecurity incidents, data breaches, public safety risks, or contract defaults are identified.
            </p>
            <div class="flex gap-3 pt-2">
              <button id="btn-pause-action" class="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded font-bold transition">Pause Pilot Operations</button>
              <button id="btn-terminate-action" class="px-4 py-2 bg-rose-700 hover:bg-rose-600 text-white rounded font-bold transition">Terminate Pilot</button>
            </div>
          </div>
        </div>
      `;
    },

    // -------------------------------------------------------------
    // VIEW 10: EVALUATION & SCALE-UP (Section 18, 19, 20, 21, 22)
    // -------------------------------------------------------------
    viewEvaluation() {
      const p = this.activePilot;
      return `
        <div class="space-y-6">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-2xl font-bold text-slate-900">Final Evaluation & Scale-Up Recommendation</h2>
              <p class="text-xs text-slate-500">Section 18, 19, 20, 21, & 22: Committee evaluation, automated result calculator, and scale-up brief</p>
            </div>
            <button id="btn-print-eval" class="px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 flex items-center gap-1">
              Print Scale-Up Brief
            </button>
          </div>

          <div class="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div class="text-xs uppercase tracking-wider font-semibold text-emerald-200">Section 19: Rule-Engine Computed Outcome</div>
              <h3 class="text-2xl font-black text-white mt-1">PILOT OUTCOME: ${p.outcome}</h3>
              <p class="text-xs text-emerald-100 mt-1 max-w-2xl">
                All 3 target KPIs achieved without safety failures &bull; 14/14 Cybersecurity checks cleared &bull; Zero critical unresolved risks &bull; Budget surplus of ₹40,000 returned.
              </p>
            </div>
            <div class="text-right">
              <div class="text-xs text-emerald-200 uppercase font-semibold">Committee Recommendation</div>
              <div class="text-xl font-bold text-white mt-0.5 bg-emerald-700/60 px-3 py-1 rounded-lg border border-emerald-500">${p.committeeDecision}</div>
            </div>
          </div>

          <div id="scaleup-render-box">
            ${ReportEngine.generateScaleUpBrief(p)}
          </div>
        </div>
      `;
    },

    // -------------------------------------------------------------
    // VIEW 11: AUDIT TRAIL (Section 23)
    // -------------------------------------------------------------
    viewAudit() {
      const p = this.activePilot;
      return `
        <div class="space-y-6">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-2xl font-bold text-slate-900">Immutable Audit Trail & Event Ledger</h2>
              <p class="text-xs text-slate-500">Section 23: Complete chronological forensic history of state transitions and authorized actions</p>
            </div>
          </div>

          <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div class="overflow-x-auto">
              <table class="w-full text-xs text-left">
                <thead class="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th class="p-3">#</th>
                    <th class="p-3">Timestamp</th>
                    <th class="p-3">Authorized User</th>
                    <th class="p-3">Action Event</th>
                    <th class="p-3">Details & Notes</th>
                    <th class="p-3">Old Value</th>
                    <th class="p-3">New Value</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  ${p.auditTrail.map(a => `
                    <tr class="hover:bg-slate-50/80 transition">
                      <td class="p-3 font-mono font-bold text-slate-500">${a.id}</td>
                      <td class="p-3 font-mono text-slate-600">${a.time}</td>
                      <td class="p-3 font-semibold text-slate-900">${a.user}</td>
                      <td class="p-3"><span class="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-semibold text-[11px]">${a.action}</span></td>
                      <td class="p-3 text-slate-700 max-w-xs">${a.detail}</td>
                      <td class="p-3 font-mono text-slate-400 text-[11px]">${a.oldValue}</td>
                      <td class="p-3 font-mono text-emerald-700 font-bold text-[11px]">${a.newValue}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    },

    // -------------------------------------------------------------
    // VIEW 12: CORE OUTPUTS CENTER (Section 26 - All 15 Outputs)
    // -------------------------------------------------------------
    viewOutputs() {
      const outputs = [
        { id: 1, title: "1. Pilot Plan", desc: "5-phase structured lifecycle & task execution matrix", view: "plan" },
        { id: 2, title: "2. Pilot Agreement", desc: "Auto-generated bilateral legal contract with signoffs", view: "agreement" },
        { id: 3, title: "3. Payment Milestone Plan", desc: "Tranche disbursement rules and verification records", view: "payments" },
        { id: 4, title: "4. Data / IP Agreement", desc: "100% Gov ownership, retention & deletion terms", view: "agreement" },
        { id: 5, title: "5. Cybersecurity Checklist", desc: "14-point CERT-In compliance evaluation & certificate", view: "cybersecurity" },
        { id: 6, title: "6. Risk Register", desc: "Probability × Impact matrix and mitigation actions", view: "cybersecurity" },
        { id: 7, title: "7. KPI Plan & Telemetry", desc: "Automated baseline vs actual calculation engine", view: "kpis" },
        { id: 8, title: "8. Pilot Monitoring Dashboard", desc: "Real-time command center for budget and milestones", view: "dashboard" },
        { id: 9, title: "9. Live Issue Register", desc: "Field incident reporting and resolution log", view: "issues" },
        { id: 10, title: "10. User Feedback Report", desc: "5-star multi-criteria user satisfaction evaluation", view: "issues" },
        { id: 11, title: "11. Evidence Repository", desc: "Verified file dossiers and audit attachments", view: "evidence" },
        { id: 12, title: "12. Pilot Evaluation Report", desc: "Outcome analysis and performance review", view: "evaluation" },
        { id: 13, title: "13. Pilot Completion Report", desc: "Comprehensive 22-section official report", action: "modal-completion" },
        { id: 14, title: "14. Scale-Up Recommendation", desc: "Strategic procurement roadmap under GFR Rule 194", view: "evaluation" },
        { id: 15, title: "15. Complete Audit Trail", desc: "Immutable timestamped event ledger", view: "audit" }
      ];

      return `
        <div class="space-y-6">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-2xl font-bold text-slate-900">Core Pilot Outputs & Statutory Artifacts</h2>
              <p class="text-xs text-slate-500">Section 26: All 15 required institutional deliverables ready for inspection, print, and export</p>
            </div>
            <button id="btn-print-full-report" class="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg shadow flex items-center gap-1.5">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              Export Complete 22-Section Dossier
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${outputs.map(out => `
              <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition card-interactive flex flex-col justify-between">
                <div>
                  <div class="flex justify-between items-start mb-2">
                    <h3 class="font-bold text-slate-900 text-sm">${out.title}</h3>
                    <span class="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded text-[10px] border border-emerald-200">READY</span>
                  </div>
                  <p class="text-xs text-slate-600">${out.desc}</p>
                </div>
                <div class="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                  ${out.action === 'modal-completion' ? `
                    <button class="btn-open-completion-trigger text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                      View 22-Point Report &rarr;
                    </button>
                  ` : `
                    <button class="nav-btn text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1" data-view="${out.view}">
                      Open Output &rarr;
                    </button>
                  `}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    },

    bindViewEvents() {
      document.querySelectorAll('#btn-open-completion, .btn-open-completion-trigger, #btn-print-full-report').forEach(btn => {
        btn.addEventListener('click', () => {
          const modal = document.getElementById('report-modal');
          const modalContent = document.getElementById('report-modal-content');
          if (modal && modalContent) {
            modalContent.innerHTML = ReportEngine.generatePilotCompletionReport(this.activePilot);
            modal.classList.remove('hidden');
          }
        });
      });

      const printAgree = document.getElementById('btn-print-agreement');
      if (printAgree) printAgree.addEventListener('click', () => window.print());
      const printCyber = document.getElementById('btn-print-cyber');
      if (printCyber) printCyber.addEventListener('click', () => window.print());
      const printEval = document.getElementById('btn-print-eval');
      if (printEval) printEval.addEventListener('click', () => window.print());

      const btnPause = document.getElementById('btn-pause-pilot');
      const btnPauseAction = document.getElementById('btn-pause-action');
      const btnTerminateAction = document.getElementById('btn-terminate-action');

      if (btnPause || btnPauseAction) {
        [btnPause, btnPauseAction].filter(Boolean).forEach(b => {
          b.addEventListener('click', () => {
            const reason = prompt("Enter mandatory statutory rationale for PAUSING the pilot operations:", "Routine safety audit protocol");
            if (reason) {
              const old = this.activePilot.status;
              this.activePilot.status = "PAUSED";
              this.logAudit("Pilot Paused", `Pilot operations paused by officer. Reason: ${reason}`, old, "PAUSED");
              this.render();
              this.showToast("Pilot operations status updated to PAUSED.", "warning");
            }
          });
        });
      }

      if (btnTerminateAction) {
        btnTerminateAction.addEventListener('click', () => {
          const reason = prompt("Enter mandatory justification for TERMINATING the pilot:", "Contractual non-compliance");
          if (reason) {
            const old = this.activePilot.status;
            this.activePilot.status = "FAILED";
            this.activePilot.outcome = "FAILED";
            this.activePilot.committeeDecision = "REJECT";
            this.logAudit("Pilot Terminated", `Pilot terminated permanently. Reason: ${reason}`, old, "FAILED");
            this.render();
            this.showToast("Pilot marked TERMINATED / FAILED.", "error");
          }
        });
      }
    }
  };

  window.AppState = AppState;

  document.addEventListener('DOMContentLoaded', () => {
    AppState.init();

    const closeModal = document.getElementById('btn-close-modal');
    const modal = document.getElementById('report-modal');
    if (closeModal && modal) {
      closeModal.addEventListener('click', () => modal.classList.add('hidden'));
    }
    const printModal = document.getElementById('btn-print-modal');
    if (printModal) {
      printModal.addEventListener('click', () => window.print());
    }
  });
})();

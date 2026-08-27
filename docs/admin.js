/* =============================================
   GovCatalyst — Module 10: Admin & Governance Logic
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    const cardAddUser = document.getElementById('card-add-user');
    const btnToggleAddUser = document.getElementById('btn-toggle-add-user');
    const btnCloseAddUser = document.getElementById('btn-close-add-user');
    const btnCancelAddUser = document.getElementById('btn-cancel-add-user');
    const formAddUser = document.getElementById('form-add-user');

    const auditTbody = document.getElementById('audit-tbody');
    const signoffsTbody = document.getElementById('signoffs-tbody');
    const usersTbody = document.getElementById('users-tbody');
    const rbacCardsGrid = document.getElementById('rbac-cards-grid');

    const auditCount = document.getElementById('audit-count');
    const signoffsCount = document.getElementById('signoffs-count');
    const usersCount = document.getElementById('users-count');

    const searchAudit = document.getElementById('search-audit');
    const filterAuditModule = document.getElementById('filter-audit-module');

    // Tabs switching
    document.querySelectorAll('#admin-tabs .nav-link').forEach(btn => {
        btn?.addEventListener('click', () => {
            document.querySelectorAll('#admin-tabs .nav-link').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const tabId = btn.dataset.tab;
            document.querySelectorAll('.tab-content-pane').forEach(p => p.style.display = 'none');
            const target = document.getElementById(tabId);
            if (target) target.style.display = 'block';
        });
    });

    function toggleAddUser(show) {
        cardAddUser.style.display = show ? 'block' : 'none';
        if (show) cardAddUser.scrollIntoView({ behavior: 'smooth' });
    }

    btnToggleAddUser?.addEventListener('click', () => toggleAddUser(cardAddUser.style.display === 'none'));
    btnCloseAddUser?.addEventListener('click', () => toggleAddUser(false));
    btnCancelAddUser?.addEventListener('click', () => toggleAddUser(false));

    function getRoleBadgeClass(role) {
        switch(role) {
            case 'Super Admin': return 'role-badge-superadmin';
            case 'Dept Admin': return 'role-badge-deptadmin';
            case 'Evaluator': return 'role-badge-evaluator';
            case 'Startup': return 'role-badge-startup';
            case 'Validator': return 'role-badge-validator';
            default: return 'bg-secondary';
        }
    }

    // Render Audit Trail
    function renderAuditTrail() {
        const search = searchAudit.value.toLowerCase();
        const mod = filterAuditModule.value;

        const filtered = GovData.auditTrail.filter(log => {
            const matchSearch = log.user.toLowerCase().includes(search) ||
                                log.action.toLowerCase().includes(search) ||
                                log.detail.toLowerCase().includes(search);
            const matchMod = !mod || log.module === mod;
            return matchSearch && matchMod;
        });

        auditCount.textContent = filtered.length;

        if (filtered.length === 0) {
            auditTbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">No audit logs found matching criteria.</td></tr>`;
            return;
        }

        auditTbody.innerHTML = filtered.map(log => `
            <tr>
                <td><small class="text-muted font-monospace">${log.id}</small></td>
                <td><small class="font-monospace text-navy">${log.timestamp}</small></td>
                <td><span class="fw-semibold text-dark">${log.user}</span></td>
                <td><span class="badge ${getRoleBadgeClass(log.role)} font-monospace" style="font-size: 11px;">${log.role}</span></td>
                <td><strong class="text-navy">${log.action}</strong></td>
                <td><span class="badge bg-light text-dark border">${log.module}</span></td>
                <td><small class="text-secondary">${log.detail}</small></td>
            </tr>
        `).join('');
    }

    // Render Validator Sign-Offs
    function renderSignoffs() {
        signoffsCount.textContent = GovData.validatorSignoffs.length;

        signoffsTbody.innerHTML = GovData.validatorSignoffs.map(so => {
            const isSigned = so.status === 'Signed Off';
            const actionBtn = isSigned 
                ? '<span class="text-success small fw-bold"><i class="bi bi-shield-fill-check me-1"></i> Sealed & Audited</span>'
                : `<button class="btn btn-sm btn-success btn-execute-signoff" data-id="${so.id}"><i class="bi bi-pen-fill me-1"></i> Authorize & Sign Off</button>`;

            return `
                <tr>
                    <td><span class="badge bg-secondary font-monospace">${so.id}</span></td>
                    <td><strong class="text-navy">${so.pilotId}</strong></td>
                    <td>
                        <span class="fw-medium">${so.validatorName}</span>
                        <small class="text-muted d-block font-monospace">${so.validatorId}</small>
                    </td>
                    <td><span class="badge bg-light text-dark border">${so.module}</span></td>
                    <td>
                        <span class="badge-gov ${GovUtils.getBadgeClass(so.status)}">${so.status}</span>
                    </td>
                    <td><small class="text-muted">${GovUtils.formatDate(so.signoffDate)}</small></td>
                    <td><small class="text-secondary">${so.comments || 'Pending audit review'}</small></td>
                    <td class="text-end">${actionBtn}</td>
                </tr>
            `;
        }).join('');

        document.querySelectorAll('.btn-execute-signoff').forEach(btn => {
            btn?.addEventListener('click', () => {
                const soId = btn.dataset.id;
                executeSignoff(soId);
            });
        });
    }

    function executeSignoff(soId) {
        const so = GovData.validatorSignoffs.find(s => s.id === soId);
        if (!so) return;

        so.status = 'Signed Off';
        so.signoffDate = new Date().toISOString().replace('T', ' ').substring(0, 16);
        so.comments = 'Independent validator audit completed. Compliance certified under GFR Rule 194.';

        GovData.auditTrail.unshift({
            id: GovData.auditTrail.length + 1,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            user: so.validatorName,
            role: 'Validator',
            action: 'Sign-off Approved',
            module: 'Admin',
            detail: `Independent validator verification certified for ${so.id} on ${so.pilotId} (${so.module})`
        });

        renderSignoffs();
        renderAuditTrail();
        GovUtils.showToast(`Audit Sign-Off ${so.id} successfully recorded!`, 'success');
    }

    // Render Users
    function renderUsers() {
        usersCount.textContent = GovData.users.length;

        usersTbody.innerHTML = GovData.users.map(u => `
            <tr>
                <td><span class="badge bg-secondary font-monospace">${u.id}</span></td>
                <td><span class="fw-bold text-navy">${u.name}</span></td>
                <td><span class="badge ${getRoleBadgeClass(u.role)}">${u.role}</span></td>
                <td><small class="font-monospace text-primary">${u.email}</small></td>
                <td><small>${u.department}</small></td>
                <td><small class="text-muted">${u.lastLogin}</small></td>
                <td class="text-center"><span class="badge bg-success">${u.status}</span></td>
            </tr>
        `).join('');
    }

    // Render RBAC Matrix
    function renderRbac() {
        rbacCardsGrid.innerHTML = GovData.roleDefinitions.map(r => `
            <div class="col-md-6 col-lg-4">
                <div class="gov-card h-100 mb-0">
                    <div class="gov-card-body">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h6 class="fw-bold text-navy mb-0">${r.role}</h6>
                            <span class="badge ${getRoleBadgeClass(r.role)}">${r.role}</span>
                        </div>
                        <p class="small text-secondary mb-3">${r.description}</p>
                        
                        <div class="mb-2">
                            <small class="fw-bold text-dark d-block mb-1">Permitted Privileges:</small>
                            <div>${r.permissions.map(p => `<span class="permission-pill">${p}</span>`).join('')}</div>
                        </div>

                        <div class="pt-2 border-top text-muted small">
                            Registration: <strong>${r.registerable ? '✅ Open' : '🔒 Pre-Seeded Single Account'}</strong>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Add User Form submit
    formAddUser?.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('inp-u-name').value.trim();
        const email = document.getElementById('inp-u-email').value.trim();
        const role = document.getElementById('inp-u-role').value;
        const dept = document.getElementById('inp-u-dept').value.trim();

        const newUser = {
            id: `USR-00${GovData.users.length + 1}`,
            name: name,
            role: role,
            email: email,
            department: dept,
            lastLogin: 'Just now',
            status: 'Active'
        };

        GovData.users.unshift(newUser);

        GovData.auditTrail.unshift({
            id: GovData.auditTrail.length + 1,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            user: 'Shri Anil Kumar (Super Admin)',
            role: 'Super Admin',
            action: 'User Provisioned',
            module: 'Admin',
            detail: `Provisioned new ${role} account for ${name} (${email})`
        });

        formAddUser.reset();
        toggleAddUser(false);
        renderUsers();
        renderAuditTrail();
        GovUtils.showToast(`User ${name} provisioned as ${role}!`, 'success');
    });

    searchAudit?.addEventListener('input', renderAuditTrail);
    filterAuditModule?.addEventListener('change', renderAuditTrail);

    // Initial render
    renderAuditTrail();
    renderSignoffs();
    renderUsers();
    renderRbac();
});

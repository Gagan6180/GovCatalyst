/**
 * SIH26136 Pilot Module - Audit Service
 * GovCatalyst Government Innovation Procurement
 */

class AuditService {
  constructor() {
    this.inMemoryLogs = [];
  }

  /**
   * Log state mutation or critical authorized action
   */
  async logAction({ pilotId, user, action, detail, oldValue = 'N/A', newValue = 'N/A' }) {
    const entry = {
      id: this.inMemoryLogs.length + 1,
      pilotId: pilotId || 'SYSTEM',
      time: new Date().toISOString().replace('T', ' ').substring(0, 16),
      user: user || 'Authorized Officer',
      action: action,
      detail: detail,
      oldValue: String(oldValue),
      newValue: String(newValue)
    };

    this.inMemoryLogs.unshift(entry);
    console.log(`[AUDIT] [${entry.time}] [${entry.user}] Action: ${entry.action} | Old: ${entry.oldValue} -> New: ${entry.newValue}`);
    return entry;
  }

  /**
   * Retrieve audit history for a given pilot
   */
  async getPilotLogs(pilotId) {
    if (!pilotId) return this.inMemoryLogs;
    return this.inMemoryLogs.filter(l => l.pilotId === pilotId);
  }
}

module.exports = new AuditService();

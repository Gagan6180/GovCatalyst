/**
 * Generic Status Transition Validator & State Machine Engine
 * GovCatalyst Government Innovation Procurement
 */

const PILOT_LIFECYCLE_GRAPH = {
  DRAFT: ['AGREEMENT_PENDING', 'TERMINATED'],
  AGREEMENT_PENDING: ['AGREEMENT_APPROVED', 'REJECTED', 'DRAFT'],
  AGREEMENT_APPROVED: ['SECURITY_CHECK', 'PAUSED'],
  SECURITY_CHECK: ['DATA_IP_CHECK', 'REJECTED', 'PAUSED'],
  DATA_IP_CHECK: ['READY_FOR_DEPLOYMENT', 'PAUSED'],
  READY_FOR_DEPLOYMENT: ['DEPLOYMENT', 'PAUSED'],
  DEPLOYMENT: ['ACTIVE_PILOT', 'PAUSED', 'FAILED'],
  ACTIVE_PILOT: ['MONITORING', 'PAUSED', 'TERMINATED'],
  MONITORING: ['PILOT_COMPLETED', 'PAUSED', 'TERMINATED'],
  PILOT_COMPLETED: ['EVALUATION', 'PAUSED'],
  EVALUATION: ['COMPLETED', 'FAILED'],
  PAUSED: ['DRAFT', 'ACTIVE_PILOT', 'DEPLOYMENT', 'MONITORING', 'TERMINATED'],
  COMPLETED: ['SCALE', 'EXTEND', 'MODIFY', 'RE_PILOT', 'REJECT'],
  FAILED: ['RE_PILOT', 'REJECT'],
  TERMINATED: []
};

/**
 * Validates if transition from current to target status is permitted
 */
function isValidTransition(currentState, targetState) {
  if (!PILOT_LIFECYCLE_GRAPH[currentState]) {
    return false;
  }
  return PILOT_LIFECYCLE_GRAPH[currentState].includes(targetState);
}

/**
 * Returns list of allowed next states
 */
function getNextStates(currentState) {
  return PILOT_LIFECYCLE_GRAPH[currentState] || [];
}

module.exports = {
  PILOT_LIFECYCLE_GRAPH,
  isValidTransition,
  getNextStates
};

/**
 * Sequelize Models Registry & Associations Index
 * GovCatalyst Government Innovation Procurement
 */

const { Sequelize } = require('sequelize');
const dbConfig = require('../config/db');

const sequelize = dbConfig.sequelize;

// Initialize Canonical Pilot Models
const Pilot = require('./pilot.model')(sequelize);
const Milestone = require('./milestone.model')(sequelize);
const PilotKpi = require('./pilotKpi.model')(sequelize);
const PilotRisk = require('./pilotRisk.model')(sequelize);
const PilotIssue = require('./pilotIssue.model')(sequelize);
const PilotFeedback = require('./pilotFeedback.model')(sequelize);
const PilotEvidence = require('./pilotEvidence.model')(sequelize);
const PilotEvaluation = require('./pilotEvaluation.model')(sequelize);

// Define Associations
Pilot.hasMany(Milestone, { foreignKey: 'pilotId', as: 'milestones', onDelete: 'CASCADE' });
Milestone.belongsTo(Pilot, { foreignKey: 'pilotId', as: 'pilot' });

Pilot.hasMany(PilotKpi, { foreignKey: 'pilotId', as: 'kpis', onDelete: 'CASCADE' });
PilotKpi.belongsTo(Pilot, { foreignKey: 'pilotId', as: 'pilot' });

Pilot.hasMany(PilotRisk, { foreignKey: 'pilotId', as: 'risks', onDelete: 'CASCADE' });
PilotRisk.belongsTo(Pilot, { foreignKey: 'pilotId', as: 'pilot' });

Pilot.hasMany(PilotIssue, { foreignKey: 'pilotId', as: 'issues', onDelete: 'CASCADE' });
PilotIssue.belongsTo(Pilot, { foreignKey: 'pilotId', as: 'pilot' });

Pilot.hasMany(PilotFeedback, { foreignKey: 'pilotId', as: 'feedbacks', onDelete: 'CASCADE' });
PilotFeedback.belongsTo(Pilot, { foreignKey: 'pilotId', as: 'pilot' });

Pilot.hasMany(PilotEvidence, { foreignKey: 'pilotId', as: 'evidences', onDelete: 'CASCADE' });
PilotEvidence.belongsTo(Pilot, { foreignKey: 'pilotId', as: 'pilot' });

Pilot.hasOne(PilotEvaluation, { foreignKey: 'pilotId', as: 'evaluation', onDelete: 'CASCADE' });
PilotEvaluation.belongsTo(Pilot, { foreignKey: 'pilotId', as: 'pilot' });

module.exports = {
  sequelize,
  Sequelize,
  Pilot,
  Milestone,
  PilotKpi,
  PilotRisk,
  PilotIssue,
  PilotFeedback,
  PilotEvidence,
  PilotEvaluation
};

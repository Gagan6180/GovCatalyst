/**
 * SIH26136 Pilot Module - Pilot Evaluation Model (Canonical)
 * GovCatalyst Government Innovation Procurement
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PilotEvaluation = sequelize.define('PilotEvaluation', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    pilotId: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    evaluatedOutcome: {
      type: DataTypes.ENUM('SUCCESSFUL', 'PARTIALLY_SUCCESSFUL', 'FAILED'),
      allowNull: false
    },
    recommendation: {
      type: DataTypes.ENUM('SCALE', 'EXTEND', 'MODIFY', 'RE_PILOT', 'REJECT'),
      allowNull: false
    },
    justificationReason: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    actionPathway: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    targetAchievementPercent: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 100.00
    },
    estimatedScaleCost: {
      type: DataTypes.DECIMAL(14, 2),
      defaultValue: 0.00
    },
    expectedAnnualBenefit: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    scalabilityRating: {
      type: DataTypes.ENUM('Low', 'Medium', 'High'),
      defaultValue: 'High'
    },
    procurementRoute: {
      type: DataTypes.STRING(255),
      defaultValue: 'GFR Rule 194 / Innovation Procurement Framework'
    },
    scaleScope: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    evaluatedBy: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    evaluatedDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    tableName: 'pilot_evaluations',
    timestamps: true
  });

  return PilotEvaluation;
};

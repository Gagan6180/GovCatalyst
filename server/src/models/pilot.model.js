/**
 * SIH26136 Pilot Module - Pilot Model (Canonical)
 * GovCatalyst Government Innovation Procurement
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Pilot = sequelize.define('Pilot', {
    id: {
      type: DataTypes.STRING(64),
      primaryKey: true,
      defaultValue: () => `PILOT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    problemStatementId: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    problemStatementText: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    department: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    startup: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    startupLead: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    solution: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    objective: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    baselineObjective: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    targetObjective: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    minAcceptableResult: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    successCondition: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    durationWeeks: {
      type: DataTypes.INTEGER,
      defaultValue: 8
    },
    usersCount: {
      type: DataTypes.INTEGER,
      defaultValue: 10
    },
    scopeIncluded: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    scopeExcluded: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    budgetAllocated: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    budgetSpent: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.00
    },
    pilotOwner: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(64),
      defaultValue: 'DRAFT'
    },
    outcome: {
      type: DataTypes.STRING(64),
      defaultValue: 'PENDING'
    },
    committeeDecision: {
      type: DataTypes.STRING(64),
      defaultValue: 'PENDING'
    },
    committeeReason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    committeeRecommendation: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    securityStatus: {
      type: DataTypes.STRING(64),
      defaultValue: 'LOW RISK'
    },
    cyberChecklist: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    dataRules: {
      type: DataTypes.JSON,
      defaultValue: {}
    },
    ipRules: {
      type: DataTypes.JSON,
      defaultValue: {}
    }
  }, {
    tableName: 'pilots',
    timestamps: true
  });

  return Pilot;
};

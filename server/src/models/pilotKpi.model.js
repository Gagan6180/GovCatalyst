/**
 * SIH26136 Pilot Module - Pilot KPI Model (Canonical)
 * GovCatalyst Government Innovation Procurement
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PilotKpi = sequelize.define('PilotKpi', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    pilotId: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    kpiCode: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    category: {
      type: DataTypes.STRING(64),
      defaultValue: 'Efficiency'
    },
    direction: {
      type: DataTypes.ENUM('LOWER_IS_BETTER', 'HIGHER_IS_BETTER'),
      defaultValue: 'LOWER_IS_BETTER'
    },
    unit: {
      type: DataTypes.STRING(32),
      defaultValue: ''
    },
    baseline: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    target: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    minAcceptable: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    current: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    improvementPercent: {
      type: DataTypes.DECIMAL(6, 2),
      defaultValue: 0.00
    },
    status: {
      type: DataTypes.STRING(32),
      defaultValue: 'PENDING'
    },
    historicalTelemetry: {
      type: DataTypes.JSON,
      defaultValue: []
    }
  }, {
    tableName: 'pilot_kpis',
    timestamps: true
  });

  return PilotKpi;
};

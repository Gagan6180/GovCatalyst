/**
 * SIH26136 Pilot Module - Pilot Risk Model (Canonical)
 * GovCatalyst Government Innovation Procurement
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PilotRisk = sequelize.define('PilotRisk', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    pilotId: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    riskCode: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    category: {
      type: DataTypes.ENUM('Technical', 'Security', 'Financial', 'Operational', 'Legal', 'Data', 'Safety'),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    probability: {
      type: DataTypes.ENUM('Low', 'Medium', 'High'),
      defaultValue: 'Low'
    },
    impact: {
      type: DataTypes.ENUM('Low', 'Medium', 'High'),
      defaultValue: 'Low'
    },
    level: {
      type: DataTypes.ENUM('Low', 'Medium', 'High', 'Critical'),
      defaultValue: 'Low'
    },
    mitigation: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    owner: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('Open', 'Mitigated', 'Accepted', 'Closed'),
      defaultValue: 'Open'
    }
  }, {
    tableName: 'pilot_risks',
    timestamps: true
  });

  return PilotRisk;
};

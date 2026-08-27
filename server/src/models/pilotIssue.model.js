/**
 * SIH26136 Pilot Module - Pilot Issue Model (Canonical)
 * GovCatalyst Government Innovation Procurement
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PilotIssue = sequelize.define('PilotIssue', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    pilotId: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    issueCode: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    reportedBy: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    category: {
      type: DataTypes.ENUM('Technical', 'Security', 'Operational', 'Data', 'User Experience'),
      defaultValue: 'Technical'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    severity: {
      type: DataTypes.ENUM('Low', 'Medium', 'High', 'Critical'),
      defaultValue: 'Low'
    },
    assignedTo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    resolution: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('Open', 'In Progress', 'Resolved', 'Closed'),
      defaultValue: 'Open'
    }
  }, {
    tableName: 'pilot_issues',
    timestamps: true
  });

  return PilotIssue;
};

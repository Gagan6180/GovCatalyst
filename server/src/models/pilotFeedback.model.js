/**
 * SIH26136 Pilot Module - Pilot Feedback Model (Canonical)
 * GovCatalyst Government Innovation Procurement
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PilotFeedback = sequelize.define('PilotFeedback', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    pilotId: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    userName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    userRole: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    easeOfUse: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 }
    },
    performance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 }
    },
    reliability: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 }
    },
    accuracy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 }
    },
    overallSatisfaction: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
      validate: { min: 1.0, max: 5.0 }
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'pilot_feedbacks',
    timestamps: true
  });

  return PilotFeedback;
};

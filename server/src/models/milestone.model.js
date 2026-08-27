/**
 * SIH26136 Pilot Module - Milestone Model (Canonical)
 * GovCatalyst Government Innovation Procurement
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Milestone = sequelize.define('Milestone', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    pilotId: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    milestoneNumber: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    category: {
      type: DataTypes.ENUM('EXECUTION', 'PAYMENT'),
      defaultValue: 'EXECUTION'
    },
    percentage: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.00
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.00
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    responsiblePerson: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(32),
      defaultValue: 'PENDING'
    },
    evidence: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    approvedBy: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    verificationDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    paymentRef: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'milestones',
    timestamps: true
  });

  return Milestone;
};

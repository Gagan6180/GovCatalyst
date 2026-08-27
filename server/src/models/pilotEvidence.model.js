/**
 * SIH26136 Pilot Module - Pilot Evidence Model (Canonical)
 * GovCatalyst Government Innovation Procurement
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PilotEvidence = sequelize.define('PilotEvidence', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    pilotId: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    evidenceCode: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    documentType: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    fileUrl: {
      type: DataTypes.STRING(512),
      allowNull: true
    },
    uploadedBy: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    uploadDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    relatedMilestone: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    verificationStatus: {
      type: DataTypes.ENUM('Pending', 'Verified', 'Rejected'),
      defaultValue: 'Verified'
    }
  }, {
    tableName: 'pilot_evidences',
    timestamps: true
  });

  return PilotEvidence;
};

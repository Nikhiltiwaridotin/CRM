'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TrackingHistory extends Model {
    static associate(models) {
      TrackingHistory.belongsTo(models.Order, { foreignKey: 'trackingId', targetKey: 'trackingId' });
    }
  }
  TrackingHistory.init({
    trackingId: DataTypes.STRING,
    status: DataTypes.STRING,
    location: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'TrackingHistory',
  });
  return TrackingHistory;
};

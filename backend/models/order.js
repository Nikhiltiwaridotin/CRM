'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.Customer, { foreignKey: 'customerId' });
      Order.hasMany(models.OrderItem, { foreignKey: 'orderId' });
      Order.hasMany(models.TrackingHistory, { foreignKey: 'trackingId', sourceKey: 'trackingId' });
    }
  }
  Order.init({
    customerId: DataTypes.INTEGER,
    totalAmount: DataTypes.DECIMAL,
    status: {
      type: DataTypes.STRING,
      defaultValue: 'Pending'
    },
    trackingId: {
      type: DataTypes.STRING,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};

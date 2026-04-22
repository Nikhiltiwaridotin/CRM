'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    static associate(models) {
      Customer.hasMany(models.Order, { foreignKey: 'customerId' });
    }
  }
  Customer.init({
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    phone: DataTypes.STRING,
    address: DataTypes.TEXT,
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'customer'
    }
  }, {
    sequelize,
    modelName: 'Customer',
  });
  return Customer;
};

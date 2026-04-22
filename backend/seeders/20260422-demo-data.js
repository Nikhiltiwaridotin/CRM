'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create Admin User
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await queryInterface.bulkInsert('Customers', [{
      name: 'System Admin',
      email: 'admin@solar.com',
      password: hashedPassword,
      role: 'admin',
      phone: '1234567890',
      address: 'Admin Office',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    // Note: If your Customer model doesn't have a 'role' column yet, you might need a migration.
    // Assuming for now we just use this email to log in as admin in our logic.

    // Create Products
    await queryInterface.bulkInsert('Products', [
      {
        name: 'Monocrystalline Solar Panel 400W',
        description: 'High-efficiency monocrystalline silicon solar cells.',
        price: 299.99,
        stock_quantity: 50,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Polycrystalline Solar Panel 350W',
        description: 'Cost-effective solar solution for residential use.',
        price: 249.50,
        stock_quantity: 100,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Hybrid Inverter 5kW',
        description: 'Manage solar power and battery storage efficiently.',
        price: 899.00,
        stock_quantity: 15,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Products', null, {});
    await queryInterface.bulkDelete('Customers', null, {});
  }
};

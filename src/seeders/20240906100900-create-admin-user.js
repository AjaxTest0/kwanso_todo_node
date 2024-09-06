'use strict';

const bcrypt = require('bcrypt'); // To hash the password

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const passwordHash = await bcrypt.hash('adminpassword', 10);
    return queryInterface.bulkInsert('users', [
      {
        email: 'admin@admin.com',
        password: passwordHash,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', { email: 'admin@admin.com' }, {});
  },
};

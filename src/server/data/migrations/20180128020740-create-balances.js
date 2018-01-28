'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('balances', {
      id: {
        unique: true,
        primaryKey: true,
        type: Sequelize.UUID,
        validate: { isUUID: 4 },
        defaultValue: Sequelize.UUIDV4,
      },
      asset: {
          allowNull: false,
          type: Sequelize.STRING,
      },
      free: {
          allowNull: false,
          type: Sequelize.STRING,
      },
      locked: {
          allowNull: false,
          type: Sequelize.STRING,
      },
      isTest: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('balances');
  }
};
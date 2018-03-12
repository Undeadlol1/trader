'use strict';
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('candles', {
      id: {
        unique: true,
        primaryKey: true,
        type: Sequelize.UUID,
        validate: { isUUID: 4 },
        defaultValue: Sequelize.UUIDV4,
      },
      openTime: Sequelize.STRING,
      closeTime: Sequelize.STRING,
      open: Sequelize.STRING,
      high: Sequelize.STRING,
      low: Sequelize.STRING,
      close: Sequelize.STRING,
      volume: Sequelize.STRING,
      quoteAssetVolume: Sequelize.STRING,
      baseAssetVolume: Sequelize.STRING,
      trades: Sequelize.STRING,
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
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('candles');
  }
};
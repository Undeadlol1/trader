var reverse = require('lodash/reverse')
'use strict';
module.exports = function(sequelize, DataTypes) {
  var Prices = sequelize.define('Prices', {
    id: {
      unique: true,
      primaryKey: true,
      type: DataTypes.UUID,
      validate: { isUUID: 4 },
      defaultValue: DataTypes.UUIDV4,
    },
    symbol: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    price: {
        allowNull: false,
        type: DataTypes.STRING,
    },
  }, {
    classMethods: {
      tableName: 'prices',
      freezeTableName: true,
      getLatestPrice: function(symbol) {
          return Prices.findOne({
            raw: true,
            where: {symbol: symbol},
            order: [['createdAt', 'DESC']],
        })
      },
      twoNewest: function(symbol) {
        return Prices.findAll({
          limit: 2,
          raw: true,
          where: {symbol},
          order: [['createdAt', 'DESC']],
        })
        .then(prices => {
          return reverse(prices)
        })
      }
    }
  });
  return Prices;
};
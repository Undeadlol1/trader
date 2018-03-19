'use strict';
module.exports = function (sequelize, DataTypes) {
  var Candles = sequelize.define('Candles', {
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
    interval: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    // fetcher response format as shown here
    // https://www.npmjs.com/package/binance-api-node#candles
    openTime: DataTypes.STRING,
    closeTime: DataTypes.STRING,
    open: DataTypes.STRING,
    high: DataTypes.STRING,
    low: DataTypes.STRING,
    close: DataTypes.STRING,
    volume: DataTypes.STRING,
    quoteAssetVolume: DataTypes.STRING,
    baseAssetVolume: DataTypes.STRING,
    trades: DataTypes.STRING,
  }, {
      defaultScope: {
        order: [['closeTime', 'DESC']],
      },
      classMethods: {
        tableName: 'candles',
        freezeTableName: true,
      }
    });
  return Candles;
};
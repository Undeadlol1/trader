'use strict';
module.exports = function(sequelize, DataTypes) {
  var Balances = sequelize.define('Balances', {
    id: {
      unique: true,
      primaryKey: true,
      type: DataTypes.UUID,
      validate: { isUUID: 4 },
      defaultValue: DataTypes.UUIDV4,
    },
    asset: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    free: {
        type: DataTypes.STRING,
    },
    locked: {
        type: DataTypes.STRING,
    },
    isTest: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    }
  }, {
    classMethods: {
      tableName: 'balances',
      freezeTableName: true,
      getLatest: function(asset) {
          return Balances.findOne({
            raw: true,
            where: {asset: asset},
            order: [['createdAt', 'DESC']],
        })
      }
    }
  });
  return Balances;
};
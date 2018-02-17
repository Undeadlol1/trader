'use strict';
module.exports = function(sequelize, DataTypes) {
  var Tasks = sequelize.define('Tasks', {
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
    buyAt: {
      type: DataTypes.STRING,
    },
    sellAt: {
      type: DataTypes.STRING,
    },
    toSpend: {
      type: DataTypes.STRING,
    },
    isBought: {
      type: DataTypes.STRING,
    },
    isSold: {
      type: DataTypes.STRING,
    },
    payload: {
      type: DataTypes.STRING,
    },
    profit: {
      type: DataTypes.STRING,
    },
    isDone: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    isTest: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    strategy: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    UserId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
  }, {
    classMethods: {
      tableName: 'tasks',
      freezeTableName: true,
      associate: function(models) {
        Tasks.belongsTo(models.User, {
          foreignKey: {allowNull: false}
        });
      },
    }
  });
  return Tasks;
};
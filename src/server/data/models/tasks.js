'use strict';
module.exports = function(sequelize, DataTypes) {
  var Logs = require('./index').Logs
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
      type: DataTypes.BOOLEAN,
    },
    isSold: {
      type: DataTypes.BOOLEAN,
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
    },
    instanceMethods: {
      addMessage(payload) {
        return Logs.create({
          TaskId: this.id,
          message: payload,
          UserId: this.UserId,
        })
        .catch(error => {
          console.error('error occured before adding message')
          console.error(error)
          throw error
        })
      },
      getLatestLog() {
        return Logs.getLatest(this.id)
      }
    }
  });
  return Tasks;
};
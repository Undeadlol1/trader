'use strict';
var extend = require('lodash/assignIn')
module.exports = function(sequelize, DataTypes) {
  var Logs = sequelize.define('Logs', {
    id: {
      unique: true,
      primaryKey: true,
      type: DataTypes.UUID,
      validate: { isUUID: 4 },
      defaultValue: DataTypes.UUIDV4,
    },
    isTest: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    isError: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    message: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    TaskId: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    UserId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
  }, {
    classMethods: {
      tableName: 'logs',
      freezeTableName: true,
      associate: function(models) {
        Logs.belongsTo(models.User, {
          foreignKey: {allowNull: false}
        });
        Logs.belongsTo(models.Tasks, {
          foreignKey: {allowNull: false}
        });
      },
      getLatest: function(TaskId, options) {
        // using "extend" to avoid using '...options' because in
        // old versions of node es6 is not fully supported
        return Logs.findOne(
          extend(
            options,
            {
              where: {TaskId},
                order: [['createdAt', 'DESC']],
            }
          )
        )
    },
    }
  });
  return Logs;
};
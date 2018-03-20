'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'tasks',
      'isBacktest',
      {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      }
    )
    .then(() => queryInterface.addColumn('tasks', 'endTime', Sequelize.DATE))
    .then(() => queryInterface.addColumn('tasks', 'startTime', Sequelize.DATE))
    .then(() => queryInterface.addColumn('tasks', 'interval', Sequelize.STRING))
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface
      .removeColumn('tasks', 'isBacktest')
      .then(() => queryInterface.removeColumn('tasks', 'endTime'))
      .then(() => queryInterface.removeColumn('tasks', 'startTime'))
      .then(() => queryInterface.removeColumn('tasks', 'interval', Sequelize.STRING))
  }
};

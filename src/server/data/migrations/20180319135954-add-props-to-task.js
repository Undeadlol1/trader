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
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface
      .removeColumn('tasks', 'isBacktest')
      .then(() => queryInterface.removeColumn('tasks', 'endTime'))
      .then(() => queryInterface.removeColumn('tasks', 'startTime'))
  }
};

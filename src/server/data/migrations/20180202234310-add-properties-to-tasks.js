'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'tasks',
      'symbol',
      { allowNull: false, type: Sequelize.STRING, }
    )
    .then(() => {
      return queryInterface
        .addColumn(
          'tasks',
          'isTest',
          {
            allowNull: false,
            defaultValue: false,
            type: Sequelize.BOOLEAN,
          }
        )
    })
    .then(() => queryInterface.addColumn('tasks', 'buyAt', Sequelize.STRING))
    .then(() => queryInterface.addColumn('tasks', 'sellAt', Sequelize.STRING))
    .then(() => queryInterface.addColumn('tasks', 'toSpend', Sequelize.STRING))
    .then(() => queryInterface.addColumn('tasks', 'isBought', Sequelize.STRING))
    .then(() => queryInterface.addColumn('tasks', 'isSold', Sequelize.STRING))
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface
      .removeColumn('tasks', 'symbol')
      .then(() => queryInterface.removeColumn('tasks', 'buyAt'))
      .then(() => queryInterface.removeColumn('tasks', 'sellAt'))
      .then(() => queryInterface.removeColumn('tasks', 'isTest'))
      .then(() => queryInterface.removeColumn('tasks', 'toSpend'))
      .then(() => queryInterface.removeColumn('tasks', 'isBought'))
      .then(() => queryInterface.removeColumn('tasks', 'isSold'))
  }
};

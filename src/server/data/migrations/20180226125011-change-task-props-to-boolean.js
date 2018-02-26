'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
   return queryInterface
    .changeColumn(
        'tasks',
        'isBought',
        {
          type: Sequelize.BOOLEAN
        }
      )
      .then(() => {
        return queryInterface.changeColumn(
          'tasks',
          'isSold',
          {
            type: Sequelize.BOOLEAN
          }
        )
      })
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
   return queryInterface
   .changeColumn(
       'tasks',
       'isBought',
       {
         type: Sequelize.STRING
       }
     )
     .then(() => {
       return queryInterface.changeColumn(
         'tasks',
         'isSold',
         {
           type: Sequelize.STRING
         }
       )
     })
  }
};

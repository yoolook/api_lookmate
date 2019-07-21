'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('appearances', {
      appearance_id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      caption: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      img_url: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      userid: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        primaryKey: true
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
   return queryInterface.dropTable('appearances');
  }
};

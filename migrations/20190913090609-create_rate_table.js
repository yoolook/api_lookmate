'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('rates', {
      rate_id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      appearance_id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        references: {
          model: "appearances",
          key: "appearance_id"
      }
      },
      rate: {
        type: Sequelize.INTEGER(2),
        allowNull: true
      },
      userid: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        references: {
          model: "users",
          key: 'user_id'
      }
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('rates');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};

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
      picture: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      caption: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      location: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      allowComment:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      visible:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      user_id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        references: {
          model: "users",
          key: 'user_id'
      }
      },
      createdAt: {
        field: 'created_at',
        type: Sequelize.DATE,
        allowNull: false,
        //defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        field: 'updated_at',
        type: Sequelize.DATE,
        allowNull: false,
       // defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
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

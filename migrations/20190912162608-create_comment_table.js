'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('comments', {
      comment_id: {
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
      comment: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      location: {
        type: Sequelize.STRING(100),
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
    return queryInterface.dropTable('comments');
  }
};

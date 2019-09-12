'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable('users', {
      user_id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      nick_name: {
        type: Sequelize.STRING(25),
        allowNull: true,
        unique: true
      },
      email: {
        type: Sequelize.STRING(50),
        allowNull: true,
        unique: true
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      phone: {
        type: Sequelize.BIGINT,
        allowNull: true,
        unique: true
      },
      otp: {
        type: Sequelize.INTEGER(8),
        allowNull: true
      },
      verified: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      birth_year_range: {
        type: Sequelize.INTEGER(8),
        allowNull: true
      },
      lastProfilePicId: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      gender: {
        type: Sequelize.CHAR(1),
        allowNull: true
      },
      first_time_user: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.dropTable('users');
  }
};

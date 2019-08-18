const Sequelize = require("sequelize");
//const Joi = require('joi');
//const jwt = require('jsonwebtoken');
//var authKeys = require('../../config/auth');


const Appearance = sequelize.define("appearance", {
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
  userid: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    primaryKey: true
  },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE
});

module.exports = Appearance;
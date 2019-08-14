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
},{
    timestamps: false
});

module.exports = Appearance;
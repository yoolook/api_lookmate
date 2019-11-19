 const Sequelize = require("sequelize");
const jwt = require('jsonwebtoken');
var authKeys = require('../../config/auth'); 
//var db = require('./db')
//const Appearance = require('../models/Appearance')
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("users", {
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    nick_name: {
      type: DataTypes.STRING(25),
      allowNull: true,
      unique: true
    },
    email: {
      type: DataTypes.STRING(25),
      allowNull: true,
      unique: true
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    phone: {
      type: DataTypes.BIGINT,
      allowNull: true,
      unique: true
    },
    otp: {
      type: DataTypes.INTEGER(8),
      allowNull: true
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    birth_year_range: {
      type: DataTypes.INTEGER(8),
      allowNull: true
    },
    lastProfilePicId: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    gender: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    first_time_user: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  });

  User.generateAuthToken = function (user_info) {
    //const accesstoken = jwt.sign({ id: this.nick_name }, SECRET_KEY); //get the private key from the config file -> environment variable
    const expiresIn = 24 * 60 * 60;
    console.log("\nGenerated Token For: " + JSON.stringify(user_info));
    const accessToken = jwt.sign({ user_info }, authKeys.secret_codes.jwt_secret_key, {
      expiresIn: expiresIn
    });
    return accessToken;
  }
  return User;
}




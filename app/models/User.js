const Sequelize = require("sequelize");
const jwt = require('jsonwebtoken');
var authKeys = require('../../config/auth');
const logger = require("../../logger");
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
    registration_id: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: true
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
    bio: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue:"I am on lookmate now."
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
    logger.debug("Token Generated For :" + user_info.email , { service: "User" });
    const accessToken = jwt.sign({ user_info }, authKeys.secret_codes.jwt_secret_key, {
      expiresIn: expiresIn
    });
    return accessToken;
  }
  return User;
}




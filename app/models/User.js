const Sequelize = require("sequelize");
const Joi = require('joi');
const jwt = require('jsonwebtoken');
var authKeys = require('../../config/auth');

const User = sequelize.define("users", {
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
    type: Sequelize.STRING(25),
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
    type: Sequelize.INTEGER(5),
    allowNull: true
  },
  gender: {
    type: Sequelize.CHAR(1),
    allowNull: true
  },
  first_time_user:{
    type: Sequelize.BOOLEAN,
    allowNull: false
  }
});


User.generateAuthToken = function (user_info) {
  //const accesstoken = jwt.sign({ id: this.nick_name }, SECRET_KEY); //get the private key from the config file -> environment variable
  const expiresIn = 24 * 60 * 60;
  console.log("\nGenerated Token For: " + JSON.stringify(user_info));
  const accessToken = jwt.sign({ user_info}, authKeys.secret_codes.jwt_secret_key, {
    expiresIn: expiresIn
  });
  return accessToken;
}

module.exports = User;


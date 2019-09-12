const Sequelize = require("sequelize");
const User = require("../models/User");


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
    allowNull: false
  },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE
});

//Associations
Appearance.belongsTo(User)

module.exports = Appearance;
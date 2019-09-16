const Sequelize = require("sequelize");
const User = require("../models/User");


const Appearance = sequelize.define("appearances", {
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
  userid: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    references: {
      model: User,
      key: 'user_id'
  }
  },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE
});

//Associations
//Appearance.belongsTo(User)

module.exports = Appearance;
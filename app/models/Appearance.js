const User = require("../models/User");

module.exports = (sequelize, DataTypes) => {
const Appearance = sequelize.define("appearances", {
  appearance_id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  picture: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  caption: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  location: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  allowComment:{
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  visible:{
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  userid: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
 /*    references: {
      model: User,
      key: 'user_id'
  } */
  },
  createdAt: {
    type: DataTypes.TIME,
    allowNull: false,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
  },
  updatedAt: {
    type: DataTypes.TIME,
    allowNull: false,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
  }
});
 return Appearance;
}
//Associations
//Appearance.belongsTo(User)

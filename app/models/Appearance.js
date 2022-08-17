var db = require('../../Initialize/init-database');
const User = require("../models/User");
/* 
tocopy:
appearance_id,picture,caption, location, allowComment, visible, userid, createdAt, updatedAt
*/
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
  anonymity: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
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
  public:{
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  user_id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    references: {
      model: db.user,
      key: 'user_id'
  }
  },
  createdAt: {
    field: 'created_at',
    type: DataTypes.DATE,
    allowNull: false
  },
  updatedAt: {
    field: 'updated_at',
    type: DataTypes.DATE,
    allowNull: false
  }
});
 return Appearance;
}
//Associations
//Appearance.belongsTo(User)

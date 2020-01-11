//const Sequelize = require("sequelize");
const User = require("./User");

module.exports = (sequelize, DataTypes) => {
  const Stalk = sequelize.define("stalk", {
    stalk_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: User,
        key: 'user_id'
      }
    },
    stalk_user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: User,
        key: 'user_id'
      }
    },
    blocked: {
      type: DataTypes.STRING(100),
      allowNull: true
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
  return Stalk;
}

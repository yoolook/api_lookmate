const Sequelize = require("sequelize");
const User = require("./User");


const Stalk = sequelize.define("stalk", {
  stalk_id: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    references: {
      model: User,
      key: 'user_id'
    }
  },
  stalk_user_id: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    references: {
      model: User,
      key: 'user_id'
    }
  },
  blocked: {
    type: Sequelize.STRING(100),
    allowNull: true
  },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE
});

//Associations
//Appearance.belongsTo(User)

module.exports = Stalk;
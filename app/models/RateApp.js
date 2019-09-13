const Sequelize = require("sequelize");
const User = require("../models/User");
const Appearance = require('../models/Appearance')

const Rate = sequelize.define("rate", {
    rate_id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    appearance_id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        references: {
            model: Appearance,
            key: 'appearance_id'
        }
    },
    rate: {
        type: Sequelize.INTEGER(2),
        allowNull: true
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
Rate.belongsTo(User);
Rate.belongsTo(Appearance);

module.exports = Rate;
const Sequelize = require("sequelize");
const User = require("../models/User");

const Settings = sequelize.define("settings", {
    setting_id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    userid: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        references: {
            model: User,
            key: 'user_id'
        }
    },
    profileVisibleTo: {
        type: Sequelize.INTEGER(2),
        allowNull: false,
        defaultValue: 1
    },
    strictlyAnonymous: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    notificationScreen: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    notification_sms: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
});



//Associations
Settings.belongsTo(User);

module.exports = Settings;
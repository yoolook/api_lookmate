//const Sequelize = require("sequelize");
const User = require("../models/User");
module.exports = (sequelize, DataTypes) => {
    const Settings = sequelize.define("settings", {
        setting_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        userid: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            references: {
                model: User,
                key: 'user_id'
            }
        },
        profileVisibleTo: {
            type: DataTypes.INTEGER(2),
            allowNull: false,
            defaultValue: 1
        },
        strictlyAnonymous: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        notificationScreen: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        notification_sms: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    });

    return Settings;

}

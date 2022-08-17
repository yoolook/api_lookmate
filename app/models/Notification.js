var db = require('../../Initialize/init-database');
module.exports = (sequelize, DataTypes) => {
    const Notifications = sequelize.define("notifications", {
        notification_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            references: {
                model: db.user,
                key: 'user_id'
            }
        },
        appearance_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            references: {
                model: db.appearances,
                key: "appearance_id"
            }
        },
        notification: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        read: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        createdAt: {
            field: 'created_at',
            type: DataTypes.DATE,
            allowNull: false,
            //defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
            field: 'updated_at',
            type: DataTypes.DATE,
            allowNull: false,
            // defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
    });
    return Notifications;
}
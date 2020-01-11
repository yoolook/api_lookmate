const User = require("../models/User");
const Appearance = require('../models/Appearance')

module.exports = (sequelize, DataTypes) => {
    const Rate = sequelize.define("rates", {
        rate_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        appearance_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            references: {
                model: Appearance,
                key: 'appearance_id'
            }
        },
        rate: {
            type: DataTypes.INTEGER(2),
            allowNull: true
        },
        userid: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            references: {
                model: User,
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
    return Rate;
}



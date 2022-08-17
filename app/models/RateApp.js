var db = require('../../Initialize/init-database');
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
                model: db.appearances,
                key: 'appearance_id'
            }
        },
        rate: {
            type: DataTypes.INTEGER(2),
            allowNull: true
        },
        user_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            references: {
                model: db.users,
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



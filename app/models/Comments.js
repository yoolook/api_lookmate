//const Joi = require('joi');
//const jwt = require('jsonwebtoken');
//var authKeys = require('../../config/auth');

var db = require('../database/connection');
const User = require("../models/User");
const Appearance = require('../models/Appearance')

module.exports = (sequelize, DataTypes) => {
    const Comments = sequelize.define("comments", {
        comment_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        appearance_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            /*    references: {
                   model: Appearance,
                   key: 'appearance_id'
               } */
        },
        comment: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        location: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        user_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            references: {
                model: db.user,
                key: 'user_id'
            },
        },
        reply_com_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        last_conv_comment: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        annonymous: {
            type: DataTypes.BOOLEAN,
            allowNull: false
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
    return Comments;
}
//Associations
/* Comments.belongsTo(User);
Comments.belongsTo(Appearance); */


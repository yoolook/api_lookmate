const Sequelize = require("sequelize");
//const Joi = require('joi');
//const jwt = require('jsonwebtoken');
//var authKeys = require('../../config/auth');
const User = require("../models/User");
const Appearance = require('../models/Appearance')


const Comments = sequelize.define("appearance", {
    comment_id: {
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
    comment: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    location: {
        type: Sequelize.STRING(100),
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
Comments.belongsTo(User);
Comments.belongsTo(Appearance);

module.exports = Comments;
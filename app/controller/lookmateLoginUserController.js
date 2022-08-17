const bcrypt = require('bcryptjs');
const Sequelize = require("sequelize");
const infoMessages = require("../../config/info-messages");
const logger = require("../../logger");
var db = require("../../Initialize/init-database");
//todo:use token based searching of user instead of the email of phone number.
exports.login = async function (req, res) {
    //todo:check for null entries in nick_name as it has changed to null entry.
    await db.users.findOne({
        attributes: ['user_id', 'nick_name', 'email', 'first_time_user', 'lastProfilePicId', 'password'],
        where: Sequelize.or({ nick_name: req.body.userid }, { email: req.body.userid })
    }).then(result => {
        logger.debug("Logined User:" + JSON.stringify(result), { service: "Login" });
        if (result) {
            if (bcrypt.compareSync(req.body.password, result.password)) {
                res.send({
                    "code": 200,
                    "success": infoMessages.SUCCESS_GENERAL_LOGIN,
                    /* Just sending, so that UI can keep it in state and use it to match whether the user, is logined user or not logined user */
                    "user_id": result.user_id,
                    //todo: should not be sent, create another unique key in database and send that.
                    "user": result.nick_name,
                    "email": result.email,
                    "first_time_user": result.first_time_user,
                    //handle UI and check for null, if null then use default picture.
                    "lastProfilePicId": result.lastProfilePicId,
                    "authorization": db.users.generateAuthToken(result)
                });
            }
            else {
                logger.debug(infoMessages.ERROR_PASSWORD, { service: "Login" });
                //todo:Need to be managed from response send final middleware.
                var responseObject = {
                    returnType: "Error", //could be error or success.
                    code: 205,
                    message: infoMessages.ERROR_PASSWORD
                }
                res.status(205).send(responseObject)
            }
        } else {
            //todo:Need to be managed from response send final middleware.
            logger.debug(infoMessages.ERROR_EMAIL_NOT_EXIST, { service: "Login" });
            var responseObject = {
                returnType: "Error", //could be error or success.
                code: 205,
                message: infoMessages.ERROR_EMAIL_NOT_EXIST
            }
            res.status(205).send(responseObject)
        }
    }).catch((error) => {
        //todo:Need to be managed from response send final middleware.
        logger.error(infoMessages.ERROR_UNKNOWN_LOGIN, { service: "Login-*c" + error });
        var responseObject = {
            returnType: "Error", //could be error or success.
            code: 402,
            message: infoMessages.ERROR_UNKNOWN_LOGIN
        }
        res.status(402).send(responseObject)
    });
}

/* function is for silient login as soon as user comes into the application */
exports.slogin = async function (req, res) {
    await db.users.findOne({
        attributes: ['user_id', 'nick_name', 'email', 'first_time_user', 'lastProfilePicId', 'password'],
        where: { user_id: req.userDataFromToken.user_info.user_id }
    }).then(result => {
        logger.debug("Logined User:" + JSON.stringify(result), { service: "Login" });
        if (result) {
            res.send({
                "code": 200,
                "success": "Silient login confirmed",
                /* Just sending, so that UI can keep it in state and use it to match whether the user, is logined user or not logined user */
                "user_id": result.user_id,
                //todo: should not be sent, create another unique key in database and send that.
                "user": result.nick_name,
                "email": result.email,
                "first_time_user": result.first_time_user,
                "lastProfilePicId": result.lastProfilePicId,
                "authorization": db.users.generateAuthToken(result)
            });
        } else {
            logger.debug(infoMessages.ERROR_USER_NOT_EXIST, { service: "Login" });
            //todo:Need to be managed from response send final middleware.
            var responseObject = {
                returnType: "Error", //could be error or success.
                code: 205,
                message: infoMessages.ERROR_USER_NOT_EXIST
            }
            res.status(205).send(responseObject)
        }
    }).catch((error) => {
        //todo:Need to be managed from response send final middleware.
        logger.error(infoMessages.ERROR_UNKNOWN_LOGIN, { service: "Login-*c" });
        var responseObject = {
            returnType: "Error", //could be error or success.
            code: 402,
            message: infoMessages.ERROR_UNKNOWN_LOGIN
        }
        res.status(402).send(responseObject)
    });
}

exports.submitRegistrationId = async function (req, res) {
    logger.debug("Firebase token registration: " + req.body.FCMRegistrationId, { service: "Login" });
    await db.users.findOne({ where: { user_id: req.userDataFromToken.user_info.user_id } })
        .then(function (responseData) {
            // Check if record exists in db
            if (responseData) {
                responseData.update({
                    registration_id: req.body.FCMRegistrationId
                }).then(function (updated) {
                    res.send({
                        "code": 200,
                        "success": infoMessages.SUCCESS_SILIENT_LOGIN,
                        /*          todo: check if user should be updated with authorization token or not.   
                                    "user": updated.user_id,
                                    "authorization": db.users.generateAuthToken(result) */
                    });
                }).catch(function (error) {
                    logger.debug(infoMessages.ERROR_FIREBASE, { service: "Login-*c" + error });
                    var responseObject = {
                        returnType: "Error", //user does'nt exist.
                        code: 205,
                        message: infoMessages.ERROR_UNKNOWN_LOGIN
                    }
                    res.status(205).send(responseObject)
                });
            }
        });
}
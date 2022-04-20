const bcrypt = require('bcryptjs');
const otplib = require('otplib');
var authKeys = require('../../auth-secrets');
const { validationResult } = require('express-validator');
var settingsOperation = require('../controller/settingController');
var db = require('../database/connection');
const infoMessages = require("../../config/info-messages");
const logger = require("../../logger");
//todo:move this to config.
var newUserTempRegisterationId = require('uniqid');

//new register policies:
//1. Nick name would be user until someone sets it from welcome page or setting.
//todo:need to make trigger which should make entry in setting table.
exports.register = function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.debug(infoMessages.ERROR_INVALID_INPUT, { service: "Regst" })
        var responseObject = {
            returnType: "Error", //could be error or success.
            code: 206,
            message: infoMessages.ERROR_INVALID_INPUT,
            realReturn: JSON.stringify(error)
        }
        /* return res.status(422).json({ errors: errors.array() }); */
        //if it gives error update the above line to the below line.
        return res.status(206).send(responseObject)
    }

    db.users.create({
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password),
        otp: otplib.authenticator.generate(authKeys.secret_codes.otp_secret_key),
        verified: false,
        registration_id: newUserTempRegisterationId(req.body.email),
        phone: req.body.phone,
        createdAt: db.sequelize.fn('NOW'),
        updatedAt: db.sequelize.fn('NOW'),
        first_time_user: true
    }).then(users => {
        if (users) {
            logger.info("Registered User:" + users.email, { service: "Regst" })
            //Create another mandatory tables
            //todo: should be moved to stored procedure.
            settingsOperation.createUserSetting(users.user_id);
            res.send({
                "code": 200,
                "message": infoMessages.SUCCESS_USER_REGISTERED,
                /* Just sending, so that UI can keep it in state and use it to match whether the user, is logined user or not logined user */
                "user_id": users.user_id,
                //todo: should not be sent, create another unique key in database and send that.
                "user": users.nick_name ? "user" : users.nick_name,
                "email": users.email,
                "phone": users.phone,
                "verified": users.verified,
                "first_time_user": true,
                "authorization": db.users.generateAuthToken(users)
            });
        }
    }).catch(error => {
        //todo:rollback if user won;t able to register.
        logger.error(infoMessages.ERROR_UNABLE_REGISTRATION, { service: "Regst-*c1" })
        //todo:Need to be managed from response send final middleware.
        var responseObject = {
            returnType: "Error", //could be error or success.
            code: 402,
            message: infoMessages.ERROR_UNABLE_REGISTRATION
        }
        res.status(402).send(responseObject)
    });
}
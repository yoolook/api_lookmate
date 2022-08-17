/* Modification history 
1. Updated error model and sending header in the response. 
2. Updated userIdentification to the user id */

const { validationResult } = require("express-validator");
const otplib = require("otplib");
const infoMessages = require("../../config/info-messages");
const logger = require("../../logger");
var db = require("../../Initialize/init-database");
const authSecret = require("../../Initialize/init-cache");
var otpKey = authSecret.get('authKeys').secret_codes.otp_secret_key;

// Alternatively: const secret = otplib.authenticator.generateSecret();
exports.verifyOTP = async function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    var responseObject = {
      returnType: "Error", //could be error or success.
      code: 502,
      message: infoMessages.ERROR_USERNAME_OR_PHONE_NOT_VALID,
    };
    res.status(502).send({ responseObject });
    //return res.status(422).json({ errors: errors.array() });
  }
  //find if phone or email present simply, here we need to check either one of them should present
  //strictly.
  await db.users
    .findOne({
      attributes: ["user_id", "otp", "verified"],
      where: db.sequelize.or(
        { email: req.body.userid },
        { phone: req.body.userid }
      ),
    })
    .then((user) => {
      if (req.body.otp == user.otp) {
        user
          .update({
            verified: true,
          })
          .then((users) => {
            res.send({
              code: 200,
              message: infoMessages.SUCCESS_VERIFIED_OTP,
              verified: users.verified,
              authorization: db.users.generateAuthToken(users),
            });
          });
      } else {
        res.send({
          code: 502,
          message: infoMessages.ERROR_INVALID_OTP,
          verified: false,
        });
      }
    })
    .catch((error) => {
      //todo:Need to be managed from response send final middleware.
      logger.error(infoMessages.ERROR_GENERAL_CATCH + " : " + error, {
        service: "ChOTP-*c",
      });
      var responseObject = {
        returnType: "Error", //could be error or success.
        code: 501,
        message: infoMessages.ERROR_GENERAL_CATCH,
      };
      res.status(501).send({ responseObject });
    });
};

exports.generateOTP = async function (req, res) {
  //todo:validate the number of OTP generating attempt as well.
  var errors = validationResult(req);
  if (!errors.isEmpty) {
    var responseObject = {
      returnType: "Error", //could be error or success.
      code: 206,
      message: infoMessages.ERROR_USERNAME_OR_PHONE_NOT_VALID,
    };
    res.status(206).send(responseObject);
  }
  //find if phone or email present simply, here we need to check either one of them should present
  //strictly.
  await db.users
    .findOne({
      attributes: ["user_id"],
      where: db.sequelize.or(
        { email: req.body.userid },
        { phone: req.body.userid }
      ),
    })
    .then((user) => {
      if (user) {
        user
          .update({
            otp: otplib.authenticator.generate(
              otpKey
            ),
          })
          .then((result) => {
            res.status(200).send({
              code: 200,
              message: infoMessages.SUCCESS_OTP_SENT,
              authorization: db.users.generateAuthToken(result),
            });
          })
          .catch((error) => {
            logger.error(infoMessages.ERROR_GENERAL_CATCH + " : " + error, {
              service: "ChOTP-*c2",
            });
            //todo:Need to be managed from response send final middleware.
            var responseObject = {
              returnType: "Error", //could be error or success.
              code: 402,
              message: infoMessages.ERROR_GENERAL_CATCH,
            };
            res.status(402).send(responseObject);
          });
      } else {
        var responseObject = {
          returnType: "Error", //could be error or success.
          code: 205,
          message: infoMessages.ERROR_USER_NOT_EXIST,
        };
        res.status(205).send(responseObject);
      }
    })
    .catch((error) => {
      //todo:Need to be managed from response send final middleware.
      logger.error(infoMessages.ERROR_GENERAL_CATCH + " : " + error, {
        service: "ChOTP-*c3",
      });
      var responseObject = {
        returnType: "Error", //could be error or success.
        code: 402,
        message: infoMessages.ERROR_GENERAL_CATCH,
      };
      res.status(201).send(responseObject);
    });
};

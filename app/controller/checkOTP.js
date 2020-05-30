
/* Modification history 
1. Updated error model and sending header in the response. 
2. Updated userIdentification to the user id */

const { validationResult } = require('express-validator');
const Sequelize = require("sequelize");
const otplib =require('otplib');
var authKeys = require('../../config/auth');
var db = require('../database/connection');

// Alternatively: const secret = otplib.authenticator.generateSecret();
exports.verifyOTP = async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        var responseObject = {
            returnType: "Error", //could be error or success.
            code: 502,
            message: "Email or phone number not valid"
        }
        res.status(502).send({ responseObject })
        //return res.status(422).json({ errors: errors.array() });
    }
    //find if phone or email present simply, here we need to check either one of them should present
    //strictly.
    console.log("\n\nbefore findone verification of OTP ----" + JSON.stringify(req.body));
    await db.users.findOne({
        attributes: ['user_id', 'otp', 'verified'],
        where: db.sequelize.or({ user_id: req.userDataFromToken.user_info.user_id})
    }).then(
        (user) => {
            console.log("\n\nInternal verification of OTP ----" + JSON.stringify(user));
            if (req.body.otp == user.otp) {
                user.update({
                    verified: true
                }).then(users => {
                    console.log("\n\n--updated value OTP---" + JSON.stringify(users));
                    res.send({
                        "code": 200,
                        "message": "Successfully verified OTP",
                        "verified": users.verified,
                        "authorization": db.users.generateAuthToken(users),  
                    });
                });
            }
            else {
                console.log("---erro in updating---");
                res.send({
                    "code": 502,
                    "message": "Sorry, you've provided wrong OTP.",
                    "verified": false
                });
            }
        }).catch(error => {
            //todo:Need to be managed from response send final middleware.
            var responseObject = {
                returnType: "Error", //could be error or success.
                code: 501,
                message: "Catch from lookmate registration process"
            }
            res.status(501).send({ responseObject })
        });
}


exports.generateOTP = async function (req,res) {
    //todo:validate the number of OTP generating attempt as well.
    var errors = validationResult(req);
    if (!errors.isEmpty) {
        console.log("\m--got into errors" + JSON.stringify(errors));
        var responseObject = {
            returnType: "Error", //could be error or success.
            code: 206,
            message: "Email or phone number not valid"
        }
        res.status(206).send(responseObject)
        //return res.status(422).json({ errors: errors.array() });
    }
    //find if phone or email present simply, here we need to check either one of them should present
    //strictly.
    await db.users.findOne({
        attributes: ['user_id'],
        where: db.sequelize.or({ email: req.body.userid }, { phone: req.body.userid })
    }).then(user => {
            console.log("\n--found data in:" + JSON.stringify(user));
            if(user){  
                user.update({
                    otp:otplib.authenticator.generate(authKeys.secret_codes.otp_secret_key)
                }).then(result => {
                    console.log("Entered the OTP in the list " + JSON.stringify(result));
                    res.status(200).send({
                        "code": 200,
                        "message": "OTP is sent to your mobile device.",
                        "authorization": db.users.generateAuthToken(result) 
                    });
                }).catch(error=>{
                    console.log("\n---got in catch----" + JSON.stringify(error));
                    //todo:Need to be managed from response send final middleware.
                    var responseObject = {
                        returnType: "Error", //could be error or success.
                        code: 402,
                        message: "Catch from updating user auth token"
                    }
                    res.status(402).send(responseObject)
                });
            } else{
                
                console.log("\nShould get inside else");

                var responseObject = {
                    returnType: "Error", //could be error or success.
                    code: 205,
                    message: "Sorry, user is not available"
                }
                res.status(205).send(responseObject)
            }
        }).catch(error => {
            console.log("\nReal Error--" + JSON.stringify(error));
            //todo:Need to be managed from response send final middleware.
            var responseObject = {
                returnType: "Error", //could be error or success.
                code: 402,
                message: "Catch from finding user or generating OTP"
            }
            res.status(201).send(responseObject)
        });

}
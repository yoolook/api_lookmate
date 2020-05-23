
const bcrypt = require('bcryptjs');
const otplib =require('otplib');
var authKeys = require('../../config/auth');
const { validationResult } = require('express-validator');

var db = require('../database/connection')
//Operations object constructor
/* var Operation = function (operation) {
    this.nick_name = operation.nick_name;
    this.email = operation.email;
    this.password = bcrypt.hashSync(operation.password);
    this.createdAt = new Date();
    this.updatedAt = new Date();
}; */
//new register policies:
//1. Nick name would be user until someone sets it from welcome page or setting.

//todo:need to make trigger which should make entry in setting table.
exports.register = function (req, res) { 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    db.users.create({
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password),
        otp:otplib.authenticator.generate(authKeys.secret_codes.otp_secret_key),
        verified:req.body.verified==undefined ? false:req.body.verified,
        phone:req.body.phone,
        createdAt: db.sequelize.fn('NOW'),
        updatedAt: db.sequelize.fn('NOW'),
        first_time_user:true
    }).then(users => {
        if (users) {
            //res.send(users);
            res.send({
                "code": 201,
                "message": "User registered sucessfully",
                "user": users.nick_name? "user":users.nick_name,
                "email": users.email,
                "phone":users.phone,
                "verified":users.verified,
                "first_time_user":true,
                "authorization": db.users.generateAuthToken(result),
                "realReturn":JSON.stringify(users)
            });
        }
    }).catch(error => {
        //todo:Need to be managed from response send final middleware.
        var responseObject={
            returnType:"Error", //could be error or success.
            code:501,
            message:"Catch from lookmate registration process",
            realReturn:JSON.stringify(error)
        }
        res.status(400).send({responseObject })
    });
}


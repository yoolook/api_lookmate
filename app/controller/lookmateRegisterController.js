var User = require('../models/User');
const bcrypt = require('bcryptjs');
const otplib =require('otplib');
var authKeys = require('../../config/auth');
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
exports.register = function (req, res) { 
    User.create({
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password),
        otp:otplib.authenticator.generate(authKeys.secret_codes.otp_secret_key),
        verified:req.body.verified==undefined ? false:req.body.verified,
        createdAt: sequelize.fn('NOW'),
        updatedAt: sequelize.fn('NOW')
    }).then(users => {
        if (users) {
            //res.send(users);
            res.header("x-access-token", User.generateAuthToken()).send({
                "code": 200,
                "success": "user registered sucessfully",
                "user": users.nick_name? "user":users.nick_name,
                "email": users.email,
                "verified":users.verified,
                "new_user":true
            });
        } else {
            res.status(400).send('Error in insert new record');
        }
    }).catch(error => {
        res.send({
            "code": 400,
            "failed": "error ocurred" + error
        });
    });
}


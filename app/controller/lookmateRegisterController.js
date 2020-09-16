
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
        var responseObject={
            returnType:"Error", //could be error or success.
            code:206,
            message:"Validation error in registration process",
            realReturn:JSON.stringify(error)
        }
        /* return res.status(422).json({ errors: errors.array() }); */
        //if it gives error update the above line to the below line.
        return res.status(206).send(responseObject)
    }
    console.log("\n Inside regitration process---" + JSON.stringify(req.body));
    db.users.create({
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password),
        otp:otplib.authenticator.generate(authKeys.secret_codes.otp_secret_key),
        verified:false,
        phone:req.body.phone,
        createdAt: db.sequelize.fn('NOW'),
        updatedAt: db.sequelize.fn('NOW'),
        first_time_user:true
    }).then(users => {
        if (users) {
            console.log("\n registerd user on this awesome app" + JSON.stringify(users));
            //res.send(users);
            res.send({
                "code": 200,
                "message": "User registered sucessfully",
                /* Just sending, so that UI can keep it in state and use it to match whether the user, is logined user or not logined user */
                "user_id":users.user_id, 
                //todo: should not be sent, create another unique key in database and send that.
                "user": users.nick_name? "user":users.nick_name,
                "email": users.email,
                "phone":users.phone,
                "verified":users.verified,
                "first_time_user":true,
                "authorization": db.users.generateAuthToken(users)
            });
        }
    }).catch(error => {
        //todo:rollback if user won;t able to register.
        console.log("\n There is a catch here " + JSON.stringify(error));
        //todo:Need to be managed from response send final middleware.
        var responseObject={
            returnType:"Error", //could be error or success.
            code:402,
            message:"Catch from lookmate registration process"
        }
        res.status(402).send(responseObject)
    });
}



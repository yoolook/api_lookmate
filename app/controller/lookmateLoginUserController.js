var User = require('../models/User');
const bcrypt = require('bcryptjs');
const Sequelize = require("sequelize");

//Operations object constructor
var LoginInfo = function (loginInfo) {
    this.userid = loginInfo.userid;
    this.password = loginInfo.password;
    this.created = new Date();
    this.modified = new Date();
};

//todo:use the above object to get the req parameters, which are currently used directly.

exports.login = async function (req, res) {
    //todo:check for null entries in nick_name as it has changed to null entry.
    await User.findOne({ where: Sequelize.or({ nick_name: req.body.userid },{ email: req.body.userid }) }).then( result => {
        console.log("login api results: " + JSON.stringify(result));    
        if (result) {
                if (bcrypt.compareSync(req.body.password, result.password)) {
                    res.header("x-access-token", User.generateAuthToken(result)).send({
                        "code": 200,
                        "success": "login sucessfull",
                        "user": result.nick_name,
                        "email": result.email,
                        "new_user":false,
                        "first_time_user":result.first_time_user
                    });
                }
                else {
                    res.send({
                        "code": 204,
                        "success": "Email and password does not match"
                    });
                }

            } else {
                res.send({
                    "code": 204,
                    "success": "Email does not exits"
                });
            }
        
    }).catch((error)=>{  
        res.send({
            "code": 400,
            "failed": "error ocurred" + error
        });
    });
}
/* Modification history 
1. Updated error model and sending header in the response. 
2. Updated userIdentification to the user id */

var db = require('../database/connection')
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
//todo:use token based searching of user instead of the email of phone number.

exports.login = async function (req, res) {
    console.log("\n--entered logined with---" + JSON.stringify(req.body));
    //todo:check for null entries in nick_name as it has changed to null entry.
    await db.users.findOne({ 
        attributes:['user_id','nick_name','email','first_time_user','lastProfilePicId','password'],
        where: Sequelize.or({ nick_name: req.body.userid },{ email: req.body.userid }) }).then( result => {
        console.log("login api results: " + JSON.stringify(result));    
        if (result) {
                if (bcrypt.compareSync(req.body.password, result.password)) {
                    res.send({
                        "code": 200,
                        "success": "login sucessfull",
                        "user": result.nick_name,
                        "email": result.email,
                        "first_time_user":result.first_time_user,
                        //handle UI and check for null, if null then use default picture.
                        "lastProfilePicId": result.lastProfilePicId,
                        "authorization": db.users.generateAuthToken(result)
                    });
                }
                else {
                    console.log("\nwrong password");    
                    //todo:Need to be managed from response send final middleware.
                    var responseObject={
                        returnType:"Error", //could be error or success.
                        code:205,
                        message:"Incorrect Password"
                    }
                    res.status(205).send(responseObject)
                }
            } else {
                //todo:Need to be managed from response send final middleware.
                var responseObject={
                    returnType:"Error", //could be error or success.
                    code:205,
                    message:"Email does'nt exists."
                }
                res.status(205).send(responseObject)
            }
    }).catch((error)=>{ 
         //todo:Need to be managed from response send final middleware.
        var responseObject={
            returnType:"Error", //could be error or success.
            code:402,
            message:"Catch from login process"
        }
        res.status(402).send(responseObject)
    });
}


/* fucntion is for silient login as soon as user comes into the application */

exports.slogin = async function (req, res) {  
    console.log("\nEntered Slogin:" + JSON.stringify(req.userDataFromToken));  
    await db.users.findOne({ 
        attributes:['user_id','nick_name','email','first_time_user','lastProfilePicId','password'],
        where:{user_id: req.userDataFromToken.user_info.user_id} }).then( result => {
        console.log("login api results: " + JSON.stringify(result));    
        if (result) {
                    res.send({
                        "code": 200,
                        "success": "Silient login confirmed",
                        "user": result.nick_name,
                        "email": result.email,
                        "first_time_user":result.first_time_user,
                        "lastProfilePicId": result.lastProfilePicId,
                        "authorization": db.users.generateAuthToken(result)
                    });
            } else {
                //todo:Need to be managed from response send final middleware.
                var responseObject={
                    returnType:"Error", //could be error or success.
                    code:205,
                    message:"User does'nt exist"
                }
                res.status(205).send(responseObject)
            }
    }).catch((error)=>{ 
         //todo:Need to be managed from response send final middleware.
        var responseObject={
            returnType:"Error", //could be error or success.
            code:402,
            message:"Catch from silient login"
        }
        res.status(402).send(responseObject)
    });
}
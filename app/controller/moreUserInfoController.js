var User = require('../models/User');
const { validationResult } = require('express-validator');
const Sequelize = require("sequelize");
var db = require('../database/connection')

exports.updateMoreInfo = async function(req,res){
    console.log("\n\n--inside update info----" + JSON.stringify(req.body));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("validation error " + JSON.stringify(errors.array()));
        return res.status(502).json({ errors: errors.array() });
    }
    await db.users.findOne({
        where: {user_id: req.userDataFromToken.user_info.user_id}
    }).then(
         (user) => {
            if(user){
                //todo[urgent]: make its user id get from token, and  resolve birth_year_range issue.
                user.update({
                    nick_name:req.body.nickName,
                    birth_year_range:req.body.birthYear,
                    gender:req.body.gender,
                    first_time_user:false
                }).then(users => {
                    res.send({
                        "code": 200,
                        "message":"Welcome information updated successfully",
                        "verified":users.verified,
                        "first_time_user": users.first_time_user,
                        "authorization": db.users.generateAuthToken(users),
                        "realReturn":JSON.stringify(users)
                    });
                }).catch((err)=>{
                    console.log("Error in updating welcome details " + err);
                });
            }
            else{
                var responseObject={
                    returnType:"Error", //could be error or success.
                    code:201,
                    message:"Not able to find this user",
                    realReturn:JSON.stringify(error)
                }
                res.status(201).send({responseObject })
            }
        }).catch(error => {
                //todo:rollback if user won;t able to register.
                console.log("\n There is a catch here " + JSON.stringify(error));
                //todo:Need to be managed from response send final middleware.
                var responseObject={
                    returnType:"Error", //could be error or success.
                    code:501,
                    message:"Catch from entering welcome information",
                    realReturn:JSON.stringify(error)
                }
                res.status(501).send({responseObject })
    });

}

exports.getUserInformation = async function (req,res){
    /* todo: In future, entitlement needs to be matched with user id, get that from the default req and match, its easy but no need as of now, as settings are just private and public */
        await db.users.findOne({
            attributes:["nick_name","lastProfilePicId","gender","birth_year_range"],
            //if entitlement is not set, then get user own information to use it in settings.
            where: {user_id: req.userEntitlements ? req.params.user_id : req.userDataFromToken.user_info.user_id}
        }).then((responseUserInfo) => {
            var entitlementResponse={
                nickName:responseUserInfo["nick_name"],
                gender:responseUserInfo["gender"],
                birthYear:responseUserInfo["birth_year_range"],
                //already know about this, it wo'nt return profile_picture in any case, and it is not required as well.
                profile_picture:(req.userEntitlements && req.userEntitlements.profilePictureVisibility == 2) ? responseUserInfo["lastProfilePicId"] : "NOACCESS"
            }
            console.log("Sending user information :" + JSON.stringify(entitlementResponse));
            res.send({
                "code": 200,
                "userInformation": entitlementResponse,
                "message": "User data retrieved"
            });
        }).catch(error => {
            console.log("Error in gettin user details" + error);
            res.send({
                "code": 400,
                "message": "Failed to get user data" + error
            });
        }); 
}
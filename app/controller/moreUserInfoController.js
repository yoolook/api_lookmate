const { validationResult } = require('express-validator');
const infoMessages = require("../../config/info-messages");
const logger = require("../../logger");
var db = require("../../Initialize/init-database");

exports.updateMoreInfo = async function(req,res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        var responseObject={
            returnType:"Error", //could be error or success.
            code:201,
            message:infoMessages.ERROR_MORE_INFO_INVALID,
            realReturn:JSON.stringify(errors)
        }
        return res.status(201).send(responseObject);
    }
    const unitConversionYearsArr = [1985, 1990, 1995, 2000, 2005];

    await db.users.findOne({
        where: {user_id: req.userDataFromToken.user_info.user_id}
    }).then(
         (user) => {
            if(user){
                //todo[urgent]: make its user id get from token, and resolve birth_year_range issue.
                user.update({
                    nick_name:req.body.nickName,
                    birth_year_range:unitConversionYearsArr[req.body.birthYear],
                    gender:req.body.gender,
                    bio:req.body.bio,
                    first_time_user:false
                }).then(users => {
                    res.send({
                        "code": 200,
                        "message":infoMessages.SUCCESS_MORE_INFO_UPDATED,
                        "verified":users.verified,
                        "first_time_user": users.first_time_user,
                        "authorization": db.users.generateAuthToken(users),
                        "realReturn":JSON.stringify(users)
                    });
                }).catch((error)=>{
                    logger.error(infoMessages.ERROR_GENERAL_CATCH + " : " + error , { service : "moreInfo-*c1" });
                });
            }
            else{
                var responseObject={
                    returnType:"Error", //could be error or success.
                    code:201,
                    message:infoMessages.ERROR_USER_NOT_EXIST
                }
                res.status(201).send({responseObject })
            }
        }).catch(error => {
                //todo:rollback if user won;t able to register.
                logger.error(infoMessages.ERROR_GENERAL_CATCH + " : " + error , { service : "moreInfo-*c2" });
                //todo:Need to be managed from response send final middleware.
                var responseObject={
                    returnType:"Error", //could be error or success.
                    code:501,
                    message:infoMessages.ERROR_GENERAL_CATCH,
                    realReturn:JSON.stringify(error)
                }
                res.status(501).send({responseObject })
    });

}

exports.getUserInformation = async function (req,res){
    /* todo: In future, entitlement needs to be matched with user id, get that from the default req and match, its easy but no need as of now, as settings are just private and public */
        await db.users.findOne({
            attributes:["nick_name","lastProfilePicId","gender","birth_year_range","bio"],
            //if entitlement is not set, then get user own information to use it in settings.
            where: {user_id: req.userEntitlements ? req.params.user_id : req.userDataFromToken.user_info.user_id}
        }).then((responseUserInfo) => {
            var entitlementResponse={
                nickName:responseUserInfo["nick_name"],
                gender:responseUserInfo["gender"],
                birthYear:responseUserInfo["birth_year_range"],
                bio:responseUserInfo["bio"],
                //already know about this, it wo'nt return profile_picture in any case, and it is not required as well.
                profile_picture:(req.userEntitlements && req.userEntitlements.profilePictureVisibility == 1) ? "NOACCESS" : responseUserInfo["lastProfilePicId"]
            }
            res.send({
                "code": 200,
                "userInformation": entitlementResponse,
                "message": infoMessages.SUCCESS_USER_FOUND
            });
        }).catch(error => {
            logger.error(infoMessages.ERROR_GENERAL_CATCH + " : " + error , { service : "moreInfo-*c3" });
            res.send({
                "code": 400,
                "message": infoMessages.ERROR_GENERAL_UNKNOWN_FAILURE
            });
        }); 
}
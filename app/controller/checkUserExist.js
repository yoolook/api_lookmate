const infoMessages = require("../../config/info-messages");
const logger = require("../../logger");
var db = require("../../Initialize/init-database");

exports.checkEmailorMobileExists = async function(req,res,next){
    await db.users.findOne({
        attributes: ['user_id','verified'],
        where: db.sequelize.or({ email:req.body.email, phone:req.body.phone })
    }).then(result => {
        if(result){
            res.send({
                "code": 201,
                "message": infoMessages.ERROR_USERNAME_UNAVAILABLE
            });
        }
        else{
            res.send({
                "code": 200,
                "message": infoMessages.SUCCESS_AVAILABLE_USERNAME
            });
        }
    }).catch (
        error => {
            logger.error(infoMessages.ERROR_GENERAL_UNKNOWN_FAILURE, { service : "ChUserXt-*c" })
            res.send({
                "code": 402,
                "message": infoMessages.ERROR_GENERAL_UNKNOWN_FAILURE
            });
        }
    )
}
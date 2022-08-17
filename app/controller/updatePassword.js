const bcrypt = require('bcryptjs');
const infoMessages = require("../../config/info-messages");
const logger = require("../../logger");
var db = require("../../Initialize/init-database");
exports.updatePassword = async function(req,res){
    //todo:check for null entries in nick_name as it has changed to null entry.
    await db.users.findOne({
        where: { user_id: req.userDataFromToken.user_info.user_id }  
    }).then(
        (user) => {
            user.update({
                password: bcrypt.hashSync(req.body.password),
            }).then(result => {
                res.send({
                    "code": 200,
                    "message":"Success",
                    "authorization": db.users.generateAuthToken(result)
                });
            });
        }).catch(error => {
            //todo:Need to be managed from response send final middleware.
            logger.error(infoMessages.ERROR_GENERAL_CATCH + " : " + error, { service : "upPass-*c1" })
            var responseObject={
                returnType:"Error", //could be error or success.
                code:501,
                message:infoMessages.ERROR_GENERAL_CATCH,
            }
            res.status(501).send({responseObject })
        });   
}
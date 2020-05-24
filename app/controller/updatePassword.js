const bcrypt = require('bcryptjs');
var db = require('../database/connection')
exports.updatePassword = async function(req,res){
    console.log("\n\nInto update password:" + JSON.stringify(req.body))
    //todo:check for null entries in nick_name as it has changed to null entry.
    await db.users.findOne({
        userid: req.userDataFromToken.user_info.user_id
    }).then(
        (user) => {
            console.log("\n\nInto password update user" + JSON.stringify(user))
            user.update({
                password: bcrypt.hashSync(req.body.password),
            }).then(result => {
                res.send({
                    "code": 200,
                    "message":"Success",
                    "authorization": db.users.generateAuthToken(result),
                    "realReturn":JSON.stringify(result)
                });
            });
        }).catch(error => {
            console.log("\n\nInto catch:" + JSON.stringify(error))
            //todo:Need to be managed from response send final middleware.
            var responseObject={
                returnType:"Error", //could be error or success.
                code:501,
                message:"Catch from updating password",
                realReturn:JSON.stringify(error)
            }
            res.status(501).send({responseObject })
        });   
}
var User = require('../models/User');
const { validationResult } = require('express-validator');
const Sequelize = require("sequelize");
var db = require('../database/connection')

exports.updateMoreInfo = async function(req,res){
    console.log("\n\n--inside update info----" + JSON.stringify(req.body));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
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
var User = require('../models/User');
const { validationResult } = require('express-validator');
const Sequelize = require("sequelize");

exports.updateMoreInfo = async function(req,res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    await User.findOne({
        where: Sequelize.or({email:req.body.userid},{phone:req.body.userid})
    }).then(
         (user) => {
            if(user){
                //todo[urgent]: make its user id get from token, and  resolve birth_year_range issue.
                user.update({
                    nick_name:req.body.nick_name,
                    birth_year_range:null,
                    gender:req.body.gender,
                    first_time_user:false
                }).then(users => {
                    res.header("x-access-token", User.generateAuthToken(users)).send({
                        "code": 200,
                        "verified":users.verified,
                        "first_time_user": users.first_time_user
                    });
                });
            }
            else{
                res.send({
                    "code": 204,
                    "first_time_user": true
                });
            }
        }).catch(error => {
        res.send({
            "code": 400,
            "failed": "No Such User" + error
        });
    });

}
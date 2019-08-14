var User = require('../models/User');
const { validationResult } = require('express-validator');

exports.updateMoreInfo = async function(req,res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    await User.findOne({
        where: Sequelize.or({email:req.body.userIdentity},{phone:req.body.userIdentity})
    }).then(
         (user) => {
            if(user){
                user.update({
                    nick_name:req.body.nick_name,
                    birth_year_range:req.body.birth_year_range,
                    gender:req.body.gender,
                    first_time_user:false
                }).then(users => {
                    res.header("x-access-token", User.generateAuthToken()).send({
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
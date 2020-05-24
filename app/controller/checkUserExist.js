var db = require('../database/connection');
exports.checkEmailorMobileExists = async function(req,res,next){
    await db.users.findOne({
        attributes: ['user_id','verified'],
        where: db.sequelize.or({ email:req.body.email, phone:req.body.phone })
    }).then(result => {
        console.log("\n--user has been checked for existance---" + JSON.stringify(result));
        if(result){
            res.send({
                "code": 201,
                "message": "email already exists"
            });
        }
        else{
            res.send({
                "code": 200,
                "message": "email does not exists"
            });
        }
    }).catch (
        error => {
            res.send({
                "code": 401,
                "message": "unknown error occured"
            });
        }
    )
}
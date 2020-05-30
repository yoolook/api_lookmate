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
                "message": "Sorry, username is not available"
            });
        }
        else{
            res.send({
                "code": 200,
                "message": "Yupp!! username is available"
            });
        }
    }).catch (
        error => {
            res.send({
                "code": 402,
                "message": "unknown error occured"
            });
        }
    )
}
var db = require('../database/connection');
var authKeys = require('../../config/auth');
const { validationResult } = require('express-validator');
//configuration for pusher
/* var feed_channel = new Pusher({
    appId: authKeys.pusher_keys.app_id,
    key:authKeys.pusher_keys.key,
    secret:authKeys.pusher_keys.secret,
    cluster: authKeys.pusher_keys.cluster,
    encrypted: true
  }) ; */
//todo:create the procedure with good logic, handle create and update in the same function and promise instead of different, 
exports.rateAppearance = async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    await db.rate.findOne({ where: db.sequelize.and({ user_id: req.userDataFromToken.user_info.user_id },{ appearance_id: req.body.appearanceid }) }).then( result => {  
        if (result) {
            //if we find that user already rated the pics.
            result.update({
                rate: req.body.rate,
                appearance_id:req.body.appearanceid,
                user_id: req.userDataFromToken.user_info.user_id,
                createdAt: db.sequelize.fn('NOW'),
                updatedAt: db.sequelize.fn('NOW'),
            }).then(ratedAgain => {
                if (ratedAgain) {
                    //opencomment:to push data on pusher
                    //closed: just not to push anything from persi environement and updating database addition functionality.
                    //feed_channel.trigger('push_rate_channel', 'push_rate_event',ratedAgain);
                    res.data = { "message-sent": true };
                    res.send({
                        "code": 200,
                        "message": "image rated",
                        "user": ratedAgain.user_id,
                        "rate": ratedAgain.rate,
                        "createdAt": ratedAgain.createdAt
                    });
                } else {
                    res.send({
                        "code": 204,
                        "message": "Error in rating again this image"
                    });
                }
            }).catch(error => {
                res.send({
                    "code": 400,
                    "message": "server failed " + error
                });
            });

        }
        else{
            //if we do not find any entry, need to make entry in table.
            //if we find that user already rated the pics.
            db.rate.create({
                rate: req.body.rate,
                appearance_id:req.body.appearanceid,
                user_id: req.userDataFromToken.user_info.user_id,
                createdAt: db.sequelize.fn('NOW'),
                updatedAt: db.sequelize.fn('NOW'),
            }).then(rated => {
                if (rated) {
                    //opencomment:to push data on pusher
                    //closed: just not to push anything from persi environement and updating database addition functionality.
                    //feed_channel.trigger('push_rate_channel', 'push_rate_event',rated);
                    res.data = { "message-sent": true };
                    res.send({
                        "code": 200,
                        "message": "image rated",
                        "user": rated.user_id,
                        "rate": rated.rate,
                        "createdAt": rated.createdAt
                    });
                } else {
                    res.send({
                        "code": 204,
                        "message": "Error in rating this image"
                    });
                }
            }).catch(error => {
                res.send({
                    "code": 400,
                    "message": "server failed " + error
                });
            });

        }
    });
};

/* Get rate of the provided appearance for provided user id */
exports.getRateAppearance = async function (req, res) {
    console.log("get rate appearnce: " + req.params.apperanceId);
    db.rate.findOne({ 
        as: 'lm_rate',
        where: db.sequelize.and({ appearance_id:req.params.apperanceId, user_id: req.userDataFromToken.user_info.user_id }),
    }).then((appearanceRate)=>{
        var responseRateAppearance=0;
        if(appearanceRate)
            var responseRateAppearance=appearanceRate.rate;
        console.log("Return user rating:" + JSON.stringify({
            "code": 200,
            "rate": responseRateAppearance,
        }) );
        
        res.send({
            "code": 200,
            "rate": responseRateAppearance,
        });
    }).catch((error)=>{
        res.send({
            "code": 400,
            "message": "server failed" + error
        });
    });           
};

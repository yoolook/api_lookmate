var Rate = require('../models/RateApp');
var Pusher = require('pusher'); //use either pusher of publish to quirue
var authKeys = require('../../config/auth');
const Sequelize = require("sequelize");
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
    await Rate.findOne({ where: Sequelize.and({ userid: req.userDataFromToken.user_info.user_id },{ appearance_id: req.body.appearanceid }) }).then( result => {  
        if (result) {
            //if we find that user already rated the pics.
            result.update({
                rate: req.body.rate,
                appearance_id:req.body.appearanceid,
                userid: req.userDataFromToken.user_info.user_id,
                createdAt: sequelize.fn('NOW'),
                updatedAt: sequelize.fn('NOW'),
            }).then(ratedAgain => {
                if (ratedAgain) {
                    //opencomment:to push data on pusher
                    //closed: just not to push anything from persi environement and updating database addition functionality.
                    //feed_channel.trigger('push_rate_channel', 'push_rate_event',ratedAgain);
                    res.data = { "message-sent": true };
                    res.send({
                        "code": 200,
                        "success": "image rated",
                        "user": ratedAgain.userid,
                        "createdAt": ratedAgain.createdAt
                    });
                } else {
                    res.send({
                        "code": 204,
                        "success": "Error in rating again this image"
                    });
                }
            }).catch(error => {
                res.send({
                    "code": 400,
                    "failed": "server failed " + error
                });
            });

        }
        else{
            //if we do not find any entry, need to make entry in table.
            //if we find that user already rated the pics.
            result.create({
                rate: req.body.rate,
                appearance_id:req.body.appearanceid,
                userid: req.userDataFromToken.user_info.user_id,
                createdAt: sequelize.fn('NOW'),
                updatedAt: sequelize.fn('NOW'),
            }).then(rated => {
                if (rated) {
                    //opencomment:to push data on pusher
                    //closed: just not to push anything from persi environement and updating database addition functionality.
                    //feed_channel.trigger('push_rate_channel', 'push_rate_event',rated);
                    res.data = { "message-sent": true };
                    res.send({
                        "code": 200,
                        "success": "image rated",
                        "user": rated.userid,
                        "createdAt": rated.createdAt
                    });
                } else {
                    res.send({
                        "code": 204,
                        "success": "Error in rating this image"
                    });
                }
            }).catch(error => {
                res.send({
                    "code": 400,
                    "failed": "server failed " + error
                });
            });

        }
    });

};

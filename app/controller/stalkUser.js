var Stalk = require('../models/stalkusers');
var Pusher = require('pusher'); //use either pusher of publish to quirue
var authKeys = require('../../config/auth');

//configuration for pusher
/* var feed_channel = new Pusher({
    appId: authKeys.pusher_keys.app_id,
    key:authKeys.pusher_keys.key,
    secret:authKeys.pusher_keys.secret,
    cluster: authKeys.pusher_keys.cluster,
    encrypted: true
  }) ; */
exports.stalkUser = async function (req, res) {
    Stalk.create({
        user_id: req.userDataFromToken.user_info.user_id,
        stalk_user_id:req.body.stalkUserId,
        blocked:false,
        createdAt: sequelize.fn('NOW'),
        updatedAt: sequelize.fn('NOW'),
    }).then(stalked => {
        if (stalked) {
            res.send({
                "code": 200,
                "success": "stalked",
                "user": stalked.userid,
                "createdAt": stalked.createdAt
            });
        } else {
            res.send({
                "code": 204,
                "success": "Error stalk"
            });
        }
    }).catch(error => {
        res.send({
            "code": 400,
            "failed": "server failed" + error
        });
    });
};

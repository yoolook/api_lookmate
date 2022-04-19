var Stalk = require('../models/stalkusers');
var User = require('../models/User');
const Sequelize = require("sequelize");

//configuration for pusher
/* var feed_channel = new Pusher({
    appId: authKeys.pusher_keys.app_id,
    key:authKeys.pusher_keys.key,
    secret:authKeys.pusher_keys.secret,
    cluster: authKeys.pusher_keys.cluster,
    encrypted: true
  }) ; */
exports.stalkUser = async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    Stalk.create({
        user_id: req.userDataFromToken.user_info.user_id,
        stalk_user_id: req.body.stalkUserId,
        blocked: false,
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



//Get list of user stalking to.

exports.getStalkList = async function (req, res) {
    await Stalk.findAll({ attributes: ['stalk_user_id'] }, 
    {
        where: Sequelize.and({ user_id: req.userDataFromToken.user_info.user_id }, { blocked: false })
    },
    { 
        include:[{ model: User }] 
    }).then(stalkList => {
        if (stalkList) {
            const resObj = stalkList.map(stalkUserId => {
                return Object.assign(
                    {},
                    {
                        userNickNames: stalkUserId.User.map(nickNames => {
                            //tidy up the post data
                            return Object.assign(
                                {},
                                {
                                    userNickName: nickNames.nick_name
                                })
                        })
                    })
            });
            res.json(resObj);
            /*  res.send({
                 "code": 200,
                 "success": "stalked",
                 "stalk_user": stalkList
             }); */
        } else {
            res.send({
                "code": 204,
                "success": "Error getting stalker list"
            });
        }
    }).catch(error => {
        res.send({
            "code": 400,
            "failed": "server failed" + error
        });
    });
};


var Appearance = require('../models/Appearance');
//const publishToQueue = require('../database/connect-rabbitMQ');
var Pusher = require('pusher'); //use either pusher of publish to quirue
var authKeys = require('../../config/auth');
var db = require('../database/connection');

//configuration for pusher
var feed_channel = new Pusher({
    appId: authKeys.pusher_keys.app_id,
    key:authKeys.pusher_keys.key,
    secret:authKeys.pusher_keys.secret,
    cluster: authKeys.pusher_keys.cluster,
    encrypted: true
  });

exports.addAppearanceBySocket = function (status, user_info, callback) {
    //todo: compact the user_info (which is inserted while creating JWA ) from object inside object to outer object with all details.
    //create appearance in the database.
    db.appearances.create({
        caption: status,
        img_url: 'url',
        userid: user_info.user_info.user_id,
        visible:true
    }).then(appearanceMade => {
        if (appearanceMade) {
            //res.send(users);
            callback({
                "code": 200,
                "success": "user appearance made",
                "user": user_info.user_info.user_id,
                "new_user": false
            });
            return;
        } else {
            callback("Error in making an appearance");
        }
    }).catch(error => {
        console.log("Error occured while creating" + error)
        callback(false);
        return;
    });
}

/* @description; This add appearance in the database using API whereas above add it using socket, we need:
1. picture(s) URL: in the form of array.
2. caption: one caption of image.
4. Location: Location of picture uploaded.
-----------------------------------------
Extract other info from token:
1. Userid/emailid.
2. Creation date.
-----------------------------------------
Parameter captured from API.(req.userDataFromToken)
picture:
caption:
Location:
*/

exports.addAppearance = async function (req, res) {
    db.appearances.create({
        picture: (req.body.picture).toString(),
        caption: req.body.caption,
        location: req.body.location,
        userid: req.userDataFromToken.user_info.user_id,
       /*  created_at: db.sequelize.fn('NOW'),
        updated_at: db.sequelize.fn('NOW'), */
    }).then(appearanceMade => {
        if (appearanceMade) {
            console.log("\nReturn appearance made: " + JSON.stringify(appearanceMade));

            console.log("\nUpdated data in appearance made: " + JSON.stringify(appearanceMade.createdAt));
            //opencomment:to push data on pusher
            //closed: just not to push anything from persi environement and updating database addition functionality.
            feed_channel.trigger('push_feed_channel', 'push_feed_event',appearanceMade);
            res.data = { "message-sent": true };
            res.send({
                "code": 200,
                "success": "user appearance made",
                "user": appearanceMade.userid,
                "createdAt": appearanceMade.createdAt,
                "updatedAt": appearanceMade.updatedAt,
            });
        } else {
            res.send({
                "code": 204,
                "success": "Error in appearance entry"
            });
        }
    }).catch(error => {
        res.send({
            "code": 400,
            "failed": "server failed" + error
        });
    });
}

/* @description; This module (producer) add appearance in the rabbitmq (clouds) queue and can be used by consumer later., we need:
1. picture(s) URL: in the form of array.
2. caption: one caption of image.
4. Location: Location of picture uploaded.
-----------------------------------------
Extract other info from token: (req.userDataFromToken)
1. Userid/emailid.
2. Creation date.
*/

//todo[urgent]: save this images things on database too. (open the above feature to get it saved into database.)

exports.addAppearanceByCloud = async function (req, res) {
    try {
            const payload={
            picture: req.body.picture,
            caption: req.body.caption,
            location: req.body.location,
            userid: req.userDataFromToken.user_info.user_id,
            createdAt: db.sequelize.fn('NOW'),
            updatedAt: db.sequelize.fn('NOW'),
        }
        //code here is for rabbit mq, enable if required rabbit mq.
        //await publishToQueue("IntoFeeds", payload); 
        //opencomment:to push data on pusher
        //closed: just not to push anything from persi environement and updating database addition functionality.
        //feed_channel.trigger('push_feed_channel','push_feed',payload);
        res.statusCode = 200;
        res.data = { "message-sent": true };
        res.send({
            "code": 200,
            "success": payload
        });
    }
    catch(error) {
        res.send({
            "code": 400,
            "failure": "failed:" + error
        });
    }

};
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
        user_id: user_info.user_info.user_id,
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
1. user_id/emailid.
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
        user_id: req.userDataFromToken.user_info.user_id,
       /*  created_at: db.sequelize.fn('NOW'),
        updated_at: db.sequelize.fn('NOW'), */
    }).then(appearanceMade => {
        if (appearanceMade) {
            //converting the results to the contract format to send to blink.
            //todo:Handle for multiple images by one user.
            appearanceToBlink = {
                "picture":appearanceMade.picture,
                "appearance_id":appearanceMade.appearance_id
            };          
            console.log("Datails sent to blink: " + JSON.stringify(appearanceToBlink));  
            //opencomment:to push data on pusher
            //closed: just not to push anything from persi environement and updating database addition functionality.
            feed_channel.trigger('push_feed_channel', 'push_feed_event',appearanceToBlink);
            res.data = { "message-sent": true };
            res.send({
                "code": 200,
                "success": "user appearance made",
                "user": appearanceMade.user_id,
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

/* 
@Description: Used to get the latest images for UI. Used when user login into the application, to fill the application screen.
@Todo: Count of image delivered should be controller with some way, either from server or from UI.
2. Decide response contract at some point of time, it should be same from pusher as well.
*/
//appearance_id,picture,caption, location, allowComment, visible, user_id, createdAt, updatedAt
exports.getLatestAppearance = async function (req, res) {
    db.appearances.findAll({ 
        attributes:['appearance_id','picture','location','createdAt','user_id'],
/*         include: [
            {
                attributes: ['nick_name','user_id'],
                model: db.users
            }
        ], */
        limit: 10, 
        order: [['createdAt', 'DESC']]
    }).then((results)=>{
        /* converting the results to the contract format.
        - Removed nick_name, as it should not be required on blink screen.
        - todo:Remove nickname code from sequelize as well if not needed in future | Handle for multiple images by one user. */
        results = results.map((response)=>{
            return {
                "picture":response.picture,
                "appearance_id":response.appearance_id
            }
        });
        //console.log("Returned data:" + JSON.stringify(results));
        res.send({code:200,data:results});
    }).catch(error => {
        res.send({
            "code": 400,
            "message": "server failed" + error
        });
    });
};


/* 
@Description: Used to get appearance details based on the appearance Id provided in the post reqeust object.
2. Decide response contract at some point of time.
*/
//appearance_id,picture,caption, location, allowComment, visible, user_id, createdAt, updatedAt
exports.getAppearance = async function (req, res) {
    db.appearances.findOne({ 
        attributes:['appearance_id','picture','location','createdAt','user_id'],
        where: { appearance_id: req.body.appearanceid },
        include: [
            {
                attributes: ['nick_name','user_id'],
                model: db.users
            }
        ]
    }).then((returnedAppearance)=>{
        /* converting the results to the contract format.
        - For multiple images in the "picture" property, UI should handle this by converting the sting into array and process all on detail page of appearance*/
        returnedAppearance = {
                "code":200,
                "picture":returnedAppearance.picture,
                "appearance_id":returnedAppearance.appearance_id,
                "nick_name":returnedAppearance.nick_name,
                "createdAt":returnedAppearance.createdAt,
            }
        res.send(returnedAppearance);
    }).catch(error => {
        res.send({
            "code": 400,
            "message": "server failed" + error
        });
    });
};


/* @description; This module (producer) add appearance in the rabbitmq (clouds) queue and can be used by consumer later., we need:
1. picture(s) URL: in the form of array.
2. caption: one caption of image.
4. Location: Location of picture uploaded.
-----------------------------------------
Extract other info from token: (req.userDataFromToken)
1. user_id/emailid.
2. Creation date.
*/

//todo[urgent]: save this images things on database too. (open the above feature to get it saved into database.)

exports.addAppearanceByCloud = async function (req, res) {
    try {
            const payload={
            picture: req.body.picture,
            caption: req.body.caption,
            location: req.body.location,
            user_id: req.userDataFromToken.user_info.user_id,
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
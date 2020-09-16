var firebaseRef = require('../database/firebase_db');
var authKeys = require('../../config/auth');
var db = require('../database/connection');


//todo (p1): Implement this awesome format of replying back to users. awesome.:)
//https://github.com/maitraysuthar/rest-api-nodejs-mongodb/blob/master/helpers/apiResponse.js

//todo: Using an OAuth 2.0 refresh tokenc (https://firebase.google.com/docs/admin/setup)
//move initialization of app in the app.js file later.
var feedAppearanceTopic = 'feed_appearance';

exports.addAppearanceBySocket = function (status, user_info, callback) {
    //todo: compact the user_info (which is inserted while creating JWA ) from object inside object to outer object with all details.
    //create appearance in the database.
    db.appearances.create({
        caption: status,
        img_url: 'url',
        user_id: user_info.user_info.user_id,
        visible: true
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
    console.log("\n anonymite " + req.body.anonymity)
    db.appearances.create({
        picture: (req.body.picture).toString(),
        caption: req.body.caption,
        location: req.body.location,
        anonymity: req.body.anonymity,
        user_id: req.userDataFromToken.user_info.user_id,
        /*  created_at: db.sequelize.fn('NOW'),
         updated_at: db.sequelize.fn('NOW'), */
    }).then(appearanceMade => {
        if (appearanceMade) {
            /* preparing data for pushing appearance to the user. */
            var appearanceToBlink = {
                data: {
                    picture: appearanceMade.picture.toString(),
                    appearance_id: appearanceMade.appearance_id.toString()
                },
                topic: feedAppearanceTopic
            };
            // Send a message to devices subscribed to the provided topic.
            firebaseRef.firebaseAdmin.messaging().send(appearanceToBlink)
                .then((appearanceMade) => {
                    // Response is a message ID string.
                    console.log('Successfully sent message:', appearanceMade);

                })
                .catch((error) => {
                    console.log('Error sending message:', error);
                })
                .finally((done) => {
                    console.log("it's done");
                });
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
        console.log("server failed " + error);
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
        limit: 30, 
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
@Description: Used to get the latest images of particular user.
@Todo: Count of image delivered should be controller with some way, either from server or from UI.
2. Decide response contract at some point of time.
*/
//appearance_id,picture,caption, location, allowComment, visible, user_id, createdAt, updatedAt
exports.getMyLatestAppearance = async function (req, res) {
    db.appearances.findAll({ 
        attributes:['appearance_id','picture','location','createdAt','user_id'],
        where: { user_id: req.userDataFromToken.user_info.user_id },
        limit: 30, 
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
2. Get public rate , should get rate from all the user and average the rate.
2. Decide response contract at some point of time.
*/
//appearance_id,picture,caption, location, allowComment, visible, user_id, createdAt, updatedAt
exports.getAppearance = async function (req, res) {
    db.appearances.findOne({ 
        attributes:['appearance_id','picture','location','createdAt','caption','anonymity','user_id'],
        where: { appearance_id: req.body.appearanceid },
        include: [
            {   
                model: db.users,
                attributes: ['nick_name','user_id','lastProfilePicId'],
               
            },
            {   
                as: 'lm_rate',
                model: db.rate,
                attributes: [[db.sequelize.fn('avg', db.sequelize.col('rate')),'rate_avg']],
            }
            /*
            //if no average modification is needed, simply want to take all entried from the third table.          
            {   
                as: 'lm_rate',
                model: db.rate,
                attributes: ['rate','appearance_id'],
            } */
        ]
    }).then((returnedAppearance)=>{
        /* converting the results to the contract format.
        - For multiple images in the "picture" property, UI should handle this by converting the sting into array and process all on detail page of appearance*/
        
        
        /* //sample return from then,
        "appearance_id": 102,
        "picture": "pictures_1596998028687_16.jpg,pictures_1596998028692_16.jpg",
        "location": "UnitedStates",
        "createdAt": "2020-08-09T18:33:51.000Z",
        "caption": "multipleCaption",
        "user_id": 16,
        "user.nick_name": "Kanika",
        "user.user_id": 16,
        "user.lastProfilePicId": "lookmateImagegpxx7rokdq775sb.jpg",
        "lm_rate.rate": 1,
        "lm_rate.rate_avg": "1.5000" */

        returnedAppearance = {
                "code":200,
                "appearance_id":returnedAppearance.appearance_id,
                "picture":returnedAppearance.picture, 
                "location":returnedAppearance.location,
                "createdAt":returnedAppearance.createdAt,
                "caption":returnedAppearance.caption,
                "anonymity":returnedAppearance.anonymity,
                "nick_name":returnedAppearance.user.nick_name,
                "user_id":returnedAppearance.user.user_id,
                "lastProfilePicId":returnedAppearance.user.lastProfilePicId,
                "picture_average_rate":returnedAppearance.lm_rate[0] //todo: for whatever reasons we are not able to get the rate_avg value directly, so sending object directly.
            }
        console.log("\n Returned from screnee " + JSON.stringify(returnedAppearance));    
        res.send(returnedAppearance);
    }).catch(error => {
        console.log("Error in get the condition: " + JSON.stringify(error));
        res.send({
            "code": 400,
            "message": "server failed" + error
        });
    });
};

exports.confirmIfAppearanceBelongsToTheUser =  function(appearance_id,requestedUser){
    //todo: we can get this to the middleware.
    console.log("\n Requested User and iamge " + requestedUser + "--" + appearance_id);
    return db.appearances.findOne({ 
        attributes:['appearance_id','picture','location','createdAt','caption','anonymity','user_id'],
        where: db.sequelize.and({appearance_id: appearance_id, user_id:requestedUser})
    }).then((returnAppearance)=>{
        console.log("response:" + JSON.stringify(returnAppearance.appearance_id) + typeof returnAppearance);
        if(typeof returnAppearance == "object" && returnAppearance.appearance_id==appearance_id)
            return true;
        else
            return false;
    }).catch((error)=>{
        console.log("Error in finding image of this user" + error);
        return false;
    })
}

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
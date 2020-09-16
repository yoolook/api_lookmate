
var db = require('../database/connection');
var appearance = require('./addAppearance');
var notificationController = require ('./notification');
const firebaseRef = require("../database/firebase_db")
var messageHelper = require('../helper/notificationMessages')
var adminConfig = require('../../config/adminConf');
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

exports.addComment = async function (req, res) {
    //temporarly assigning this value to zero, as we just need make comment functionality
    //and UI does not have reply or conversation methods as of now. Its simply having anonymous comments functionality.
    req.body.reply_com_id = 0
    //if replytocommentid is not null or 0, then set the "last_conversation_comment" is false.
    if (req.body.reply_com_id != 0) {
        await db.comments.findOne({
            where: { comment_id: req.body.reply_com_id }
        }).then((commentData) => {
            commentData.update({
                last_conv_comment: false
            }).then((comment) => {
                addCommentToDb(req, res);
            });
        });
    }
    else {
        addCommentToDb(req, res);
    }
};

addCommentToDb = async function (req, res) {
    db.comments.create({
        comment: req.body.commentText,
        location: req.body.location,
        appearance_id: req.body.appearanceid,
        user_id: req.userDataFromToken.user_info.user_id,
        reply_com_id: req.body.reply_com_id, //replyToCommentId should be 0 if its a first comment.
        last_conv_comment: true,
        annonymous: true, //currently all comments are anonymous only.| get this from parameter once you create a UI for the same.
        createdAt: db.sequelize.fn('NOW'),
        updatedAt: db.sequelize.fn('NOW'),
    }).then(commentAdded => {
        //todo(p1):get user registeration token from appearance id.  
        if (commentAdded) {
            //get user id for which update is done.
            //create some kind of common middle ware for this 
            db.appearances.findOne({
                attributes: ['appearance_id','picture'],
                where: { appearance_id: commentAdded.appearance_id },
                include: [
                    {
                        attributes: ['registration_id', 'user_id'],
                        model: db.users
                    }
                ]
            }).then((response) => {
                console.log("reposne from registeration " + JSON.stringify(response));
                //Creating notification (for firebase) which sent it to the user for which it is commented for.
                var message = messageHelper.notificationMessage(req.userDataFromToken.user_info.nick_name,"COMMENT",{picture:adminConfig.internet_appearance_thumbnail_location + response.picture,appearanceid:response.appearance_id})
                //Sending to the firebase push notifacation FCM.
                firebaseRef.firebaseAdmin.messaging().sendToDevice(response.user.registration_id, message)
                    .then((response) => {
                        // Response is a message ID string.
                        console.log('Successfully sent message:', response);
                    })
                    .catch((error) => {
                        console.log('Error sending message:', error);
                    });
                //Update notification to DB as well, if its successfull,no need for its promise as of now, its fine without it.
                //todo: arrange these three methods in some fashion, all the 2 above and 1 below. currently calling asyncronously.
                notificationController.setNotificationIntoDatabaseForUser(response.user.user_id,message).then(returnNotificationAdded=>{
                    console.log("\nDatabase Updated with notification")
                }).catch((error)=>{
                    console.log("\nError in adding notification to the database" + error);
                })
            }).catch((error) => {
                console.log("Error in getting registeration id" + error);
            });
            //---if all goes well then send back the success requestion.
            //success should be sent as comment is added in database, if notification fails its fine.
            res.data = { "message-sent": true };
            res.send({
                "code": 200,
                "message": "Comment submitted",
                "createdAt": commentAdded.createdAt
            });
        } else {
            res.send({
                "code": 204,
                "message": "Error in adding comment"
            });
        }
    }).catch(error => {
        res.send({
            "code": 400,
            "message": "server failed" + error
        });
    });
}
// Get the latest comments from the comment database.
exports.getLatestComment = async function (req, res) {
    //check if that appearance belongs to the user, 
    //todo: I think should not be mandatory , if comments are open for everyone.
    if (appearance.confirmIfAppearanceBelongsToTheUser(req.params.apperanceId, req.userDataFromToken.user_info.user_id)) {
        await db.comments.findAll({
            //order: 'created_at DESC',
            attributes: ['comment_id', 'comment', 'location', 'createdAt', 'user_id'],
            //currently getting only annonymous comments
            where: db.sequelize.and({ last_conv_comment: true, appearance_id: req.params.apperanceId, annonymous: true }),
            /*   include: [
                  {
                      attributes: ['nick_name','user_id'],
                      model: db.users
                  }
              ] */
        }).then(commentData => {
            res.send({
                "code": 200,
                "appearanceComments": commentData,
                "message": "Comments retrieved"
            });
        }).catch(error => {
            res.send({
                "code": 400,
                "message": "server failed" + error
            });
        });
    } else {
        //iamge does'nt belong to the existing user.
        res.send({
            "code": 400,
            "message": "Sorry, Image doesn't belongs to you."
        });
    }
};

// Get the latest comments from the comment database.
exports.getPreviousComment = async function (req, res) {
    await db.comments.findOne({
        attributes: ['reply_com_id'],
        where: db.sequelize.and({ comment_id: req.body.commentId, appearance_id: req.body.appearanceid })
    }).then(commentData => {
        db.comments.findOne({
            attributes: ['comment_id', 'comment', 'location', 'createdAt', 'user_id'],
            where: db.sequelize.and({ comment_id: commentData.reply_com_id, appearance_id: req.body.appearanceid }),
            include: [
                {
                    attributes: ['nick_name'],
                    model: db.users
                }
            ]
        }).then((innerCommentData) => {
            res.send({
                "commentData": innerCommentData,
            });
        });
    }).catch(error => {
        res.send({
            "code": 400,
            "failed": "server failed" + error
        });
    });
};

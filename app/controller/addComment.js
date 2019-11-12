var Comment = require('../models/Comments');
var Appearance = require('../models/Appearance');
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
    let commentsChecked = false;
    //if replytocommentid is not null or 0, then set the "last_conversation_comment" is false.
    if (req.body.replyToCommentId) {
        await Comment.find({
            where: { comment_id: req.body.replyToCommentId }
        }).then(commentData => {
            commentData.update({
                last_conv_comment: false
            }).then((comment)=>{
                commentsChecked=true
            });
        });
    }
    else {
        commentsChecked = true
    }

    if (commentsChecked) {
        Comment.create({
            comment: req.body.commentText,
            location: req.body.location,
            appearance_id: req.body.appearanceid,
            userid: req.userDataFromToken.user_info.user_id,
            reply_com_id: req.body.replyToCommentId, //replyToCommentId should be 0 if its a first comment.
            last_conv_comment: true,
            createdAt: sequelize.fn('NOW'),
            updatedAt: sequelize.fn('NOW'),
        }).then(commentAdded => {
            if (commentAdded) {
                //opencomment:to push data on pusher
                //closed: just not to push anything from persi environement and updating database addition functionality.
                //feed_channel.trigger('push_comment_channel', 'push_comment_event',commentAdded);
                res.data = { "message-sent": true };
                res.send({
                    "code": 200,
                    "success": "comment added",
                    "user": commentAdded.userid,
                    "createdAt": commentAdded.createdAt
                });
            } else {
                res.send({
                    "code": 204,
                    "success": "Error in adding comment"
                });
            }
        }).catch(error => {
            res.send({
                "code": 400,
                "failed": "server failed" + error
            });
        });
    }

};


// Get the latest comments from the comment database.
exports.getLatestComment = async function (req, res) {
    await Comment.find({
        where: sequelize.and({ last_conv_comment:true, appearance_id: req.body.appearanceid })
    }).then(commentData => {
        res.send({
            "commentData": commentData,
        });
    }).catch(error => {
        res.send({
            "code": 400,
            "failed": "server failed" + error
        });
    });
};

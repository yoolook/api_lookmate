var db = require("../database/connection");
var appearance = require("./addAppearance");
var notificationController = require("./notification");
const firebaseRef = require("../database/firebase_db");
var messageHelper = require("../helper/notificationMessages");
var adminConfig = require("../../config/adminConf");
const infoMessages = require("../../config/info-messages");
const logger = require("../../logger");

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
  //if no comments allowed on photo, terminate request here itself
  if (req.params.commentLimitLeft <= 0) {
    logger.debug(infoMessages.ERROR_COMMENT_LIMIT, { service: "addComm" });
    res.send({
      code: 204,
      message: infoMessages.ERROR_COMMENT_LIMIT,
    });
  } else {
    //temporarly assigning this value to zero, as we just need make comment functionality
    //and UI does not have reply or conversation methods as of now. Its simply having anonymous comments functionality.
    req.body.reply_com_id = 0;
    //if replytocommentid is not null or 0, then set the "last_conversation_comment" is false.
    if (req.body.reply_com_id != 0) {
      await db.comments
        .findOne({
          where: { comment_id: req.body.reply_com_id },
        })
        .then((commentData) => {
          commentData
            .update({
              last_conv_comment: false,
            })
            .then((comment) => {
              addCommentToDb(req, res);
            });
        });
    } else {
      addCommentToDb(req, res);
    }
  }
};

addCommentToDb = async function (req, res) {
  //todo:req.body.user_id is risky here, as any user can add this in body request payload and modify the user name.
  // Secure it in a more robust way, check Ip or other thigns, verify them and then allow here.
  var user = {};
  if (req.headers.useridentifier) {
    user = {
      ip_address: req.headers.useridentifier, //todo: change column name to uuid;
      user_id: adminConfig.lookmate_official_unknown_user, //currently used as lookmate unidentified user
    };
  } else {
    user = { user_id: req.userDataFromToken.user_info.user_id };
  }

  db.comments
    .create({
      comment: req.body.commentText,
      location: req.body.location,
      appearance_id: req.body.appearanceid,
      ...user,
      reply_com_id: req.body.reply_com_id, //replyToCommentId should be 0 if its a first comment.
      last_conv_comment: true,
      annonymous: true, //currently all comments are anonymous only.| get this from parameter once you create a UI for the same.
      createdAt: db.sequelize.fn("NOW"),
      updatedAt: db.sequelize.fn("NOW"),
    })
    .then((commentAdded) => {
      //todo(p1):get user registeration token from appearance id.
      if (commentAdded) {
        if (req.params.registeration_id && req.params.user_id) {
          //Creating notification (for firebase) which sent it to the user for which it is commented for.
          var commentorUser = req.userDataFromToken
            ? req.userDataFromToken.user_info.nick_name
            : adminConfig.unknown_lookmate_username;
          var message = messageHelper.notificationMessage(
            commentorUser,
            "COMMENT",
            {
              picture:
                adminConfig.internet_appearance_thumbnail_location +
                req.params.picture,
              appearanceid: req.params.appearance_id,
            }
          );
          //Sending to the firebase push notifacation FCM.
          firebaseRef.firebaseAdmin
            .messaging()
            .sendToDevice(req.params.registeration_id, message)
            .then((response) => {
              // Response is a message ID string.
              logger.debug("Message sent to the device:" + response, {
                service: "addComm",
              });
            })
            .catch((error) => {
              logger.error(
                infoMessages.ERROR_GENERAL_CATCH +
                  " [ Firebase message emit error ] : " +
                  error,
                { service: "addComm-*c1" }
              );
            });
          //Update notification to DB as well, if its successfull,no need for its promise as of now, its fine without it.
          //todo: arrange these three methods in some fashion, all the 2 above and 1 below. currently calling asyncronously.
          notificationController
            .setNotificationIntoDatabaseForUser(req.params.user_id, message)
            .then((returnNotificationAdded) => {
              logger.debug(
                "Notification added to the database :" +
                  returnNotificationAdded,
                { service: "addComm" }
              );
            })
            .catch((error) => {
              logger.error(
                infoMessages.ERROR_GENERAL_CATCH +
                  " [ Adding notification in database ] : " +
                  error,
                { service: "addComm-*c2" }
              );
            });
        } else {
          logger.error(
            "Error with registeration id parameter. (firbase unknown)",
            { service: "addComm-*c3" }
          );
        }
        //---if all goes well then send back the success requestion.
        //success should be sent as comment is added in database, if notification fails its fine.
        res.data = { "message-sent": true };
        res.send({
          code: 200,
          message: infoMessages.SUCCESS_COMMENT_POSTED,
          // -1 for the current updated comment.
          isCommentLimitOver:
            req.params.commentLimitLeft - 1 <= 0 ? true : false,
          createdAt: commentAdded.createdAt,
        });
      } else {
        logger.error(
          infoMessages.ERROR_POSTING_COMMENT +
            "[ Error adding comment in database.]",
          { service: "addComm" }
        );
        res.send({
          code: 204,
          message: infoMessages.ERROR_POSTING_COMMENT,
        });
      }
    })
    .catch((error) => {
      logger.error(
        infoMessages.ERROR_GENERAL_CATCH +
          " [ Error adding comment in database. ] : " +
          error,
        { service: "addComm-*c3" }
      );
      res.send({
        code: 400,
        message: infoMessages.ERROR_GENERAL_CATCH,
      });
    });
};
// Get the latest comments from the comment database.
exports.getLatestComment = async function (req, res) {
  //check if that appearance belongs to the user,
  //todo: I think should not be mandatory , if comments are open for everyone.
  if (
    appearance.confirmIfAppearanceBelongsToTheUser(
      req.params.apperanceId,
      req.userDataFromToken.user_info.user_id
    )
  ) {
    await db.comments
      .findAll({
        //order: 'created_at DESC',
        attributes: [
          "comment_id",
          "comment",
          "location",
          "createdAt",
          "user_id",
        ],
        //currently getting only annonymous comments
        where: db.sequelize.and({
          last_conv_comment: true,
          appearance_id: req.params.apperanceId,
          annonymous: true,
        }),
        /*   include: [
                  {
                      attributes: ['nick_name','user_id'],
                      model: db.users
                  }
              ] */
      })
      .then((commentData) => {
        res.send({
          code: 200,
          appearanceComments: commentData,
          message: infoMessages.SUCCESS_COMMENT_FETCHED,
        });
      })
      .catch((error) => {
        logger.error(
          infoMessages.ERROR_GENERAL_CATCH +
            " [ Error getLatestComment ] : " +
            error,
          { service: "addComm-*c3" }
        );
        res.send({
          code: 400,
          message: infoMessages.ERROR_GENERAL_CATCH,
        });
      });
  } else {
    //iamge does'nt belong to the existing user.
    logger.error(
      infoMessages.ERROR_GENERAL_UNKNOWN_FAILURE +
        " [ Error: Image doesn't belongs to the user. ]",
      { service: "addComm" }
    );
    res.send({
      code: 400,
      message: infoMessages.ERROR_GENERAL_UNKNOWN_FAILURE,
    });
  }
};

// Get the latest comments from the comment database.
exports.getPreviousComment = async function (req, res) {
  await db.comments
    .findOne({
      attributes: ["reply_com_id"],
      where: db.sequelize.and({
        comment_id: req.body.commentId,
        appearance_id: req.body.appearanceid,
      }),
    })
    .then((commentData) => {
      db.comments
        .findOne({
          attributes: [
            "comment_id",
            "comment",
            "location",
            "createdAt",
            "user_id",
          ],
          where: db.sequelize.and({
            comment_id: commentData.reply_com_id,
            appearance_id: req.body.appearanceid,
          }),
          include: [
            {
              attributes: ["nick_name"],
              model: db.users,
            },
          ],
        })
        .then((innerCommentData) => {
          res.send({
            commentData: innerCommentData,
          });
        });
    })
    .catch((error) => {
      logger.error(infoMessages.ERROR_GENERAL_CATCH + " : " + error, {
        service: "addComm-*c4",
      });
      res.send({
        code: 400,
        failed: infoMessages.ERROR_GENERAL_CATCH,
      });
    });
};

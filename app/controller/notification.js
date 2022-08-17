const { validationResult } = require("express-validator");
const infoMessages = require("../../config/info-messages");
const logger = require("../../logger");
var db = require("../../Initialize/init-database");
/* notification object should have
{
    notification: {
        title: string;
        body: string;
    };
    android: {
        notification: {
            image: any;
        };
    };
    data: {
        appearance_id: any;
    };

}
*/

exports.setNotificationIntoDatabaseForUser = function (userid, notification) {
  return new Promise(function (resolve, reject) {
    db.notifications
      .create({
        notification: notification.notification.title,
        appearance_id: parseInt(notification.data.appearance_id),
        user_id: userid,
        read: false,
        createdAt: db.sequelize.fn("NOW"),
        updatedAt: db.sequelize.fn("NOW"),
      })
      .then((notificationAdded) => {
        resolve(notificationAdded);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//todo: need to keep only latest 10 motifications ,remove rest of the notification for any user.
/* 
@prerequisit: User should be authenticated with token and get id from the token in req
*/
exports.getLatestNotificationFromDatabaseForUser = function (req, res) {
  db.notifications
    .findAll({
      attributes: [
        "notification_id",
        "notification",
        "appearance_id",
        "read",
        "createdAt",
      ],
      where: { user_id: req.userDataFromToken.user_info.user_id },
      include: [
        {
          attributes: ["appearance_id", "picture"],
          model: db.appearances,
        },
      ],
      limit: 10,
      order: [["createdAt", "DESC"]],
    })
    .then((notificationReturn) => {
      res.send({
        code: 200,
        notifications: notificationReturn,
        message: infoMessages.SUCCESS_NOTIFICATION_FETCHED,
      });
    })
    .catch((error) => {
      logger.error(infoMessages.ERROR_GENERAL_CATCH + " : " + error, {
        service: "notif-*c1",
      });
      res.send({
        code: 400,
        message: infoMessages.ERROR_GENERAL_CATCH,
      });
    });
};

//todo: need to keep only latest 10 motifications ,remove rest of the notification for any user.
/* 
@prerequisit: User should be authenticated with token and get id from the token in req
*/
exports.getUnreadNotificationCountFromDatabaseForUser = function (req, res) {
  db.notifications
    .count({
      where: db.sequelize.and({
        user_id: req.userDataFromToken.user_info.user_id,
        read: false,
      }),
    })
    .then((notificationReturn) => {
      res.send({
        code: 200,
        unreadCount: notificationReturn,
        message: infoMessages.SUCCESS_EMPTY_RESPONSE,
      });
    })
    .catch((error) => {
      logger.error(infoMessages.ERROR_GENERAL_CATCH + " : " + error, {
        service: "notif-*c2",
      });
      res.send({
        code: 400,
        message: infoMessages.ERROR_GENERAL_UNKNOWN_FAILURE,
      });
    });
};

//todo: need to keep only latest 10 motifications ,remove rest of the notification for any user.
/* 
@prerequisit: User should be authenticated with token and get id from the token in req
*/
exports.markReadAllNotificationFromDatabaseForUser = function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({
      code: 400,
      message: infoMessages.ERROR_READ_NOTIFICATION_ERROR,
    });
  }
  db.notifications
    .update(
      { read: true },
      {
        returning: true,
        where: db.sequelize.and({
          user_id: req.userDataFromToken.user_info.user_id,
          notification_id: req.params.notification_id,
          read: false,
        }),
      }
    )
    .then((notificationReturn) => {
      res.send({
        code: 200,
        message: infoMessages.SUCCESS_NOTIFICATION_READ,
      });
    })
    .catch((error) => {
      logger.error(infoMessages.ERROR_NOTIFICATION_READ + " : " + error, {
        service: "notif-*c3",
      });
      res.send({
        code: 400,
        message: infoMessages.ERROR_NOTIFICATION_READ,
      });
    });
};

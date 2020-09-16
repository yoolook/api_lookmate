var authKeys = require('../../config/auth');
var db = require('../database/connection');
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
    return new Promise (function(resolve, reject){
        db.notifications.create({
            notification: notification.notification.title,
            appearance_id: parseInt(notification.data.appearance_id),
            user_id: userid,
            read:false,
            createdAt: db.sequelize.fn('NOW'),
            updatedAt: db.sequelize.fn('NOW'),
        }).then(notificationAdded => {
            resolve(notificationAdded);
        }).catch((error)=>{
            reject(error);
        });
    })
}

//todo: need to keep only latest 10 motifications ,remove rest of the notification for any user.
/* 
@prerequisit: User should be authenticated with token and get id from the token in req
*/
exports.getLatestNotificationFromDatabaseForUser = function (req,res) {
    db.notifications.findAll({
        attributes: ['notification_id', 'notification', 'appearance_id','read','createdAt'],
        where: { user_id:req.userDataFromToken.user_info.user_id},
        include: [
            {
                attributes: ['appearance_id','picture'],
                model: db.appearances
            }
        ],
        limit:10,
        order: [['createdAt', 'DESC']]
    }).then(notificationReturn => {
        console.log("Notifications sent" + JSON.stringify(notificationReturn));
        res.send({
            "code": 200,
            "notifications": notificationReturn,
            "message": "Notification retrieved"
        });
    }).catch(error => {
        res.send({
            "code": 400,
            "message": "server failed" + error
        });
    });
}


//todo: need to keep only latest 10 motifications ,remove rest of the notification for any user.
/* 
@prerequisit: User should be authenticated with token and get id from the token in req
*/
exports.getUnreadNotificationCountFromDatabaseForUser = function (req,res) {
    db.notifications.count({
        where:  db.sequelize.and({ user_id:req.userDataFromToken.user_info.user_id, read:false}),
    }).then(notificationReturn => {
        console.log("Notification Count format :" + JSON.stringify(notificationReturn));
        res.send({
            "code": 200,
            "unreadCount": notificationReturn,
            "message": "Notification count retrieved"
        });
    }).catch(error => {
        res.send({
            "code": 400,
            "message": "Notification Count failed" + error
        });
    });
}

//todo: need to keep only latest 10 motifications ,remove rest of the notification for any user.
/* 
@prerequisit: User should be authenticated with token and get id from the token in req
*/
exports.markReadAllNotificationFromDatabaseForUser = function (req,res) {
    db.notifications.update({ read : true },{ 
        returning: true, where: db.sequelize.and({ user_id:req.userDataFromToken.user_info.user_id, read:false})
    }).then(notificationReturn => {
        res.send({
            "code": 200,
            "message": "Marked Read"
        });
    }).catch(error => {
        res.send({
            "code": 400,
            "message": "Marking read failed" + error
        });
    });
}
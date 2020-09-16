var firebaseNotifications = require("../firebase_controller/notification");
var firebaseInitiateNotification = require("../firebase_controller/initiateFirbase");


exports.testroutes = async function (req, res) {
    console.log("Under test routes"); 
    firebaseInitiateNotification.createNotificationChildSchema()

    
    var obj={
        "date":"Notification new date",
        "Notification Title":"Notification new title",
        "Notification body":"Notificaiton new body"
    }
    firebaseNotifications.pushNotificationForUserFirebase("user1",obj);
}

const firebaseRef = require("../database/firebase_db")

exports.createNotificationChildSchema = function (user, obj) {
    var notificaReference = firebaseRef.firebaseDBReference.child("notifications");
    notificaReference.set({
        "user1": {
            "DatabaseKey": {
                "date": "Notification old date",
                "Notification Title": "Notification old title",
                "Notification body": "Notificaiton old body"
            },
            "DatabaseKey2": {
                "date": "Notification 2 old date",
                "Notification Title": "Notification 2 old title",
                "Notification body": "Notificaiton 2 old body"
            }
        }
    },(err)=>{
        if(err)
            console.log("we gotta error" + err);
        else
            console.log("Perfect Done");
    });
}
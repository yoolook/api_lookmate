const firebaseRef = require("../database/firebase_db")
var notificationsFbRef=firebaseRef.firebaseDBReference.child("notifications");

exports.pushNotificationForUserFirebase = function (user,obj) {
    //var postsRef = ref.child(user);
    var hopperRef = notificationsFbRef.child(user);
    var pushNotificationFirbase = hopperRef.push().update(obj,(err)=>{
        if(err) {
            console.log("error in updating the record" + err);
        }
        else {
            console.log("Operation completed succcessfully")
        }
    });

    console.log("Key pushed in db is " + pushNotificationFirbase.key);

 /*    var oneUser = userRef.child(obj.roll);
    oneUser.update(obj, (err) => {
        if (err) {
            res.status(300).json({ "msg": "Something went wrong", "error": err });
        }
        else {
            res.status(200).json({ "msg": "user created sucessfully" });
        }
    }) */
};


/* {
    "notifications": {
      "user1": {
        "timestamp1":{
            "title":"notification title",
            "body":"notification body",
            "picture":"notification picture"    
        },
        "timestamp2":{
            "title":"notification title",
            "body":"notification body",
            "picture":"notification picture"    
        },
      },
      "user2": {
        "timestamp1":{
            "title":"notification title",
            "body":"notification body",
            "picture":"notification picture"    
        },
        "timestamp2":{
            "title":"notification title",
            "body":"notification body",
            "picture":"notification picture"    
        },
      }
    }
} */
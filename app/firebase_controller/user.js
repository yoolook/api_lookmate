const firebase_db = require("../database/firebase_db")
var userFbRef=db.ref("users");

exports.addUserInFirebase = function (obj, res) {
    var oneUser = userRef.child(obj.roll);
    oneUser.update(obj, (err) => {
        if (err) {
            res.status(300).json({ "msg": "Something went wrong", "error": err });
        }
        else {
            res.status(200).json({ "msg": "user created sucessfully" });
        }
    })
};

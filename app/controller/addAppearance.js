var Appearance = require('../models/Appearance');
exports.addAppearance = function (status, callback) {
    //create appearance in the database.
    Appearance.create({
        caption: status,
        img_url: 'url',
        userid: 3
    }).then(appearanceMade => {
        if (appearanceMade) {
            //res.send(users);
            callback({
                "code": 200,
                "success": "user appearance made",
                "user": "username",
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
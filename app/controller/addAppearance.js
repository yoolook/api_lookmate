var Appearance = require('../models/Appearance');
exports.addAppearance = function (status,user_info,callback) {
    //todo: compact the user_info (which is inserted while creating JWA ) from object inside object to outer object with all details.
    //create appearance in the database.
    Appearance.create({
        caption: status,
        img_url: 'url',
        userid: user_info.user_info.user_id
    }).then(appearanceMade => {
        if (appearanceMade) {
            //res.send(users);
            callback({
                "code": 200,
                "success": "user appearance made",
                "user": user_info.user_info.user_id,
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
var Appearance = require('../models/Appearance');
const publishToQueue = require('../database/connect-rabbitMQ');
exports.addAppearanceBySocket = function (status, user_info, callback) {
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

exports.addAppearance = async function (req, res) {
    Appearance.create({
        picture: (req.body.picture).toString(),
        caption: req.body.caption,
        location: req.body.location,
        userid: req.userDataFromToken.user_info.user_id,
        createdAt: sequelize.fn('NOW'),
        updatedAt: sequelize.fn('NOW'),
    }).then(appearanceMade => {
        if (appearanceMade) {
            res.send({
                "code": 200,
                "success": "user appearance made",
                "user": appearanceMade.userid,
                "createdAt": appearanceMade.createdAt
            });
        } else {
            res.send({
                "code": 204,
                "success": "Error in appearance entry"
            });
        }
    }).catch(error => {
        res.send({
            "code": 400,
            "failed": "server failed"
        });
    });
}

/* @description; This module (producer) add appearance in the rabbitmq (clouds) queue and can be used by consumer later., we need:
1. picture(s) URL: in the form of array.
2. caption: one caption of image.
4. Location: Location of picture uploaded.
-----------------------------------------
Extract other info from token: (req.userDataFromToken)
1. Userid/emailid.
2. Creation date.
*/

exports.addAppearanceByCloud = async function (req, res) {
    try {
        const payload={
            picture: req.body.picture,
            caption: req.body.caption,
            location: req.body.location,
            userid: req.userDataFromToken.user_info.user_id,
            createdAt: sequelize.fn('NOW'),
            updatedAt: sequelize.fn('NOW'),
        }
        await publishToQueue("IntoFeeds", payload)
        res.statusCode = 200;
        res.data = { "message-sent": true };
        res.send({
            "code": 200,
            "success": payload
        });
    }
    catch(error) {
        res.send({
            "code": 400,
            "failure": "failed:" + error
        });
    }

};
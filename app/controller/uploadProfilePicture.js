var db = require('../database/connection');
const { validationResult } = require('express-validator');
const Sequelize = require("sequelize");
const fs = require('fs');
var adminConfig = require('../../config/adminConf');

// Alternatively: const secret = otplib.authenticator.generateSecret();
exports.updateProfilePicCode = async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    //find if phone or email present simply, here we need to check either one of them should present
    //strictly.
    await db.users.findOne({
        attributes: ['user_id', 'lastProfilePicId'],
        where: { user_id: req.userDataFromToken.user_info.user_id }
    }).then(
        (user) => {
            console.log("photo search " + JSON.stringify(user));
            /* remove already existing image from the configured profile image folder. why here..?
            because, we want to call db only once, and this is the only place where controller is called ForeignKeyConstraintError, its worth to call fs and unlink fileURLToPath */
            if (user.lastProfilePicId) {
                var path = adminConfig.profile_image_location + "/" + user.lastProfilePicId;
                //todo: try if else on this, there is not catch on this, try to throw in else part.
                if(fs.existsSync(path))
                    fs.unlinkSync(path);
            }
            //then update new name to db.
            user.update({
                lastProfilePicId: (req.body.picture).toString()
            }).then(users => {
                console.log("\nUploaded user iamge:" + JSON.stringify(users));
                /* todo: confirm the authorization parameter is correctly implemented on front end.
                implement authorization for other requests as well, there are a lot of them which 
                do not have this implementation. */
                res.send({
                    "code": 200,
                    "picture": users.lastProfilePicId,
                    "message": "profile picture has been updated",
                    "reference":600, 
                /* reference code is used to tell UI , which portion to update on profile page appearance 
                500: is for appearance
                600: is for profile picture*/
                    "authorization": db.users.generateAuthToken(users)
                });
            });
        }).catch(error => {
            console.log("Error: " + error);
            res.send({
                "code": 400,
                "failed": "Error in profile picture upload" + error
            });
        });
}
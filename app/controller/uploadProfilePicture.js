const { validationResult } = require('express-validator');
const fs = require('fs');
const infoMessages = require("../../config/info-messages");
const logger = require("../../logger");
var db = require("../../Initialize/init-database");
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
                /* todo: confirm the authorization parameter is correctly implemented on front end.
                implement authorization for other requests as well, there are a lot of them which 
                do not have this implementation. */
                res.send({
                    "code": 200,
                    "picture": users.lastProfilePicId,
                    "message": infoMessages.SUCCESS_PROFILE_PICTURE_UPDATED,
                    "reference":600, 
                /* reference code is used to tell UI , which portion to update on profile page appearance 
                500: is for appearance
                600: is for profile picture*/
                    "authorization": db.users.generateAuthToken(users)
                });
            });
        }).catch(error => {
            logger.error(infoMessages.ERROR_GENERAL_CATCH + " [ Updated Profile Picture ] : " + error, { service : "upPrPic-*c1" })
            res.send({
                "code": 400,
                "failed": infoMessages.ERROR_GENERAL_CATCH
            });
        });
}
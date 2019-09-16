var Appearance = require('../models/Appearance');
const Sequelize = require("sequelize");
//const publishToQueue = require('../database/connect-rabbitMQ');

//configuration for pusher
/* var feed_channel = new Pusher({
    appId: authKeys.pusher_keys.app_id,
    key:authKeys.pusher_keys.key,
    secret:authKeys.pusher_keys.secret,
    cluster: authKeys.pusher_keys.cluster,
    encrypted: true
  }); */


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
//description: we are just soft deleting the appearance, so that it won't be visible on screen.
exports.deleteAppearance = async function (req, res) {
    Appearance.findOne({
        where: Sequelize.and({userid: req.userDataFromToken.user_info.user_id,},{appearance_id:req.params.appearanceId})        
    }).then(appearanceHideVisibility => {
        if (appearanceHideVisibility) {
            appearanceHideVisibility.update({
                visible:false
            }).then( visiblityChanged => {
                res.send({
                    "code": 200,
                    "success": "user appearance deleted"
                });
            }).catch( visiblityChangeError => {
                res.send({
                    "code": 204,
                    "failure": "Error in deleting the appearance"
                });
            });
        } else {
            res.send({
                "code": 204,
                "failure": "No such appearance or user exists"
            });
        }
    }).catch(error => {
        res.send({
            "code": 400,
            "failed": "server failed" + error
        });
    });
}
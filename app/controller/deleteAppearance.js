var db = require('../database/connection');
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
   /*  db.appearances.findOne({
        where: Sequelize.and({userid: req.userDataFromToken.user_info.user_id,},{appearance_id:req.params.appearanceId})        
    }) */

    db.sequelize.query('CALL delete_appearance (:appearance_id)', 
        {replacements: { appearance_id: req.params.appearanceId}})
    .then(returnedProcResponse => {
        if (returnedProcResponse) {
                res.send({
                    "code": 200,
                    "message": "user appearance deleted",
                    "appearance_id":returnedProcResponse[0]["@appearance_id"] || req.params.appearanceId 
                });
        } else {
            res.send({
                "code": 204,
                "message": "No such appearance or user exists"
            });
        }
    }).catch(error => {
        res.send({
            "code": 400,
            "message": "server failed" + error
        });
    });
}
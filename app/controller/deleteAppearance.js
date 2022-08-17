const infoMessages = require("../../config/info-messages");
const logger = require("../../logger");
var db = require("../../Initialize/init-database");
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

  db.sequelize
    .query("CALL delete_appearance (:appearance_id)", {
      replacements: { appearance_id: req.params.appearanceId },
    })
    .then((returnedProcResponse) => {
      if (returnedProcResponse) {
        res.send({
          code: 200,
          message: infoMessages.SUCCESS_APPEARANCE_DELETED,
          appearance_id:
            returnedProcResponse[0]["@appearance_id"] ||
            req.params.appearanceId,
        });
      } else {
        logger.error(infoMessages.ERROR_APPEARANCE_NOT_FOUND + " : " + error, {
          service: "delApp",
        });
        res.send({
          code: 204,
          message: infoMessages.ERROR_APPEARANCE_NOT_FOUND,
        });
      }
    })
    .catch((error) => {
      logger.error(infoMessages.ERROR_GENERAL_CATCH + " : " + error, {
        service: "delApp-*c1",
      });
      res.send({
        code: 400,
        message: infoMessages.ERROR_GENERAL_CATCH,
      });
    });
};

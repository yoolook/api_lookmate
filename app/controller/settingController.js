var db = require("../database/connection");
const infoMessages = require("../../config/info-messages");
const logger = require("../../logger");

exports.createUserSetting = async function (user_id) {
  await db.settings
    .create({
      user_id: user_id,
    })
    .then((createdSettingsTable) => {
      logger.info(
        " [Created user setting table. ] : " + createdSettingsTable.user_id,
        { service: "setCont" }
      );
      return true;
    })
    .catch((error) => {
      logger.error(
        infoMessages.ERROR_GENERAL_CATCH +
          " [Error in creating user setting table. ] : " +
          error,
        { service: "setCont-*c1" }
      );
      return false;
    });
};

exports.getUserSettings = async function (req, res) {
  await db.settings
    .findOne({
      attributes: [
        "profileVisibleTo",
        "profilePictureVisibility",
        "strictlyAnonymous",
        "maxCommentCountPerPerson",
        "notificationScreen",
      ],
      where: { user_id: req.userDataFromToken.user_info.user_id },
    })
    .then((settingResponse) => {
      res.send({
        code: 200,
        currentSettings: settingResponse,
        message: infoMessages.SUCCESS_SETTING_FETCHED,
      });
    })
    .catch((error) => {
      logger.error(
        infoMessages.ERROR_GENERAL_CATCH +
          " [Error getting user settings. ] : " +
          error,
        { service: "setCont-*c2" }
      );
      res.send({
        code: 400,
        message: infoMessages.ERROR_GENERAL_CATCH,
      });
    });
};

/* todo:going forward take only a single setting, rather then providing the complete set */
exports.getOtherUsersEntitlements = async function (req, res) {
  //todo:check entitlements again, if setting is completely private.
  if (req.userEntitlements) {
    res.send({
      code: 200,
      currentSettings: settingResponse,
      message: infoMessages.SUCCESS_SETTING_FETCHED,
    });
  }
};

exports.setUserSettings = async function (req, res) {
  /* way to destruct the object, only keep two properties here */
  const { setControl, setValue } = req.body;
  await db.settings
    .findOne({
      attributes: ["setting_id"],
      where: { user_id: req.userDataFromToken.user_info.user_id },
    })
    .then((settingResponse) => {
      settingResponse
        .update({
          [setControl]: setValue,
        })
        .then((updatedSettingResponse) => {
          res.send({
            code: 200,
            fieldUpdated: setControl,
            message: infoMessages.SUCCESS_SETTING_UPDATED,
          });
        })
        .catch((error) => {
          logger.error(
            infoMessages.ERROR_GENERAL_CATCH +
              " [ Update user settings. ] : " +
              error,
            { service: "setCont-*c3" }
          );
          res.send({
            code: 400,
            message: infoMessages.ERROR_GENERAL_CATCH,
          });
        });
    });
};

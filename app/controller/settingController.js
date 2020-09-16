
var db = require('../database/connection');
var messageHelper = require('../helper/notificationMessages')
var adminConfig = require('../../config/adminConf');

exports.getUserSettings = async function (req, res) {
    await db.settings.findOne({
        attributes: ['profileVisibleTo','profilePictureVisibility','strictlyAnonymous','maxCommentCountPerPerson','notificationScreen'],
        where: { user_id: req.userDataFromToken.user_info.user_id }
    }).then((settingResponse) => {
        console.log("sending settings: " + JSON.stringify(settingResponse));
        res.send({
            "code": 200,
            "currentSettings": settingResponse,
            "message": "Settings Retrieved"
        });
    }).catch(error => {
        res.send({
            "code": 400,
            "message": "server failed to get settings " + error
        });
    });

}

exports.setUserSettings = async function (req,res){
    /* way to destruct the object, only keep two properties here */
    const { setControl, setValue } = req.body;
    await db.settings.findOne({
        attributes: ['setting_id'],
        where: { user_id: req.userDataFromToken.user_info.user_id }
    }).then((settingResponse) => {
        console.log("Returned setting response to update settings " + JSON.stringify(settingResponse));
        settingResponse.update({
            [setControl]: setValue
        }).then((updatedSettingResponse) => {
            res.send({
                "code": 200,
                "fieldUpdated": setControl,
                "message": "Settings Updated"
            });
        }).catch(error => {
            res.send({
                "code": 400,
                "message": "server failed to set settings " + error
            });
        });;
    });
}
//requiring the validator
var expressValidator = require('express-validator');
var adminConfig = require('../../config/adminConf');
const infoMessages = require("../../config/info-messages");

/* not sure if these are in use, i tried to create authorizedsettings with it, but it did'nt worked */
module.exports = function (app, io) {
    //the app use part
    app.use(expressValidator({
        customValidators: {
            isImage: function (value, filename) {
                return;
            },
            authorizedSettings: function(value){
                var authorizedArray = adminConfig.authorizedSettingValues
                if (authorizedArray.includes(value))
                    return true;
                else 
                    return false;        
            }
        }
    }));
};

/* now I tried differently. but above method is awesome if somehow it works */
exports.authorizedSettings = function(value){
    var authorizedArray = adminConfig.authorizedSettingValues
    if (authorizedArray.includes(value))
        return true;
    else 
        return false;        
}


exports.checkMobileOrEmail = function (req, res, next) {
    if (validator.isEmail(req.body.userid)) {
        //assign email parameter, the provided email id
        req.body.email = req.body.userid;
        req.body.phone = null;
        next();
    }
    else if (validator.isMobilePhone(req.body.userid)) {
        req.body.email = null;
        req.body.phone = req.body.userid;
        next();
    }
    else{
        var responseObject={
            returnType:"Error", //could be error or success.
            code:206,
            message:infoMessages.ERROR_INVALID_INPUT
        }
        res.status(206).send(responseObject)
    }
};
//requiring the validator
var expressValidator = require('express-validator');
var adminConfig = require('../../config/adminConf');


/* not sure if these are in use, i tried to create authorizedsettings with it, but it did'nt worked */
module.exports = function (app, io) {
    //the app use part
    app.use(expressValidator({
        customValidators: {
            isImage: function (value, filename) {
                console.log("custom validation started in the body:" + value + " | " + filename);
                return;
            },
            authorizedSettings: function(value){
                console.log("custom validation to check authorized user allowed strings of settings");
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
    console.log("custom validation to check authorized user allowed strings of settings");
    var authorizedArray = adminConfig.authorizedSettingValues
    if (authorizedArray.includes(value))
        return true;
    else 
        return false;        
}

var validator = require('validator');
var db = require('../database/connection');
/**
 * Check if provided value is mobile or email. if not from both, return 400 back to the user.
 * !partial implementation: these values are used in register controller.
 * @param req: all requested parameters
 * @param res: provide the response if required.
 */

 /* Updates:
 1. Updated userIdentification to userid as there is only one param on UI for register and login and both should be same.

 */

exports.checkMobileOrEmail = function (req, res, next) {
    console.log("inside in validators--" + JSON.stringify(req.body));
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
        console.log("\n into else part");
        var responseObject={
            returnType:"Error", //could be error or success.
            code:206,
            message:"Invalid user input"
        }
        res.status(206).send(responseObject)
    }
};

/* todo:going forward take only a single setting, rather then providing the complete set */
exports.checkUserAndGetEntitlements = function(req, res,next) {
    console.log("\nReached to middleware :" +   req.params.user_id );
    if(req.params.user_id!=null){
        db.settings.findOne({
            attributes: ['user_id','profileVisibleTo','profilePictureVisibility','strictlyAnonymous','maxCommentCountPerPerson','notificationScreen'],
            where: { user_id: req.params.user_id }
        }).then((settingResponse) => {
            console.log("sending settings to the contrlller: " + JSON.stringify(settingResponse));
            req.userEntitlements = settingResponse;
            next();
        }).catch(error => {
            res.send({
                "code": 400,
                "message": "server failed to get settings " + error
            });
        });
    }else{
        // if somehow you need to pass this code, make sure next controller should only be used to fetch logined user information, it is safe then...as it is used here. 
        req.userEntitlements = null
        console.log("sending else case to the contrlller: " + req.userEntitlements);
        
        next();
    }
};

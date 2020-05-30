
var validator = require('validator');

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

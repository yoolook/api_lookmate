
var validator = require('validator');

/**
 * Check if provided value is mobile or email. if not from both, return 400 back to the user.
 * !partial implementation: these values are used in register controller.
 * @param req: all requested parameters
 * @param res: provide the response if required.
 */

exports.checkMobileOrEmail = function (req, res, next) {
    console.log("inside: in validators");
    if (validator.isEmail(req.body.userIdentity)) {
        //assign email parameter, the provided email id
        req.body.email = req.body.userIdentity;
        req.body.phone = null;
        next();
    }
    else if (validator.isMobilePhone(req.body.userIdentity)) {
        req.body.email = null;
        req.body.phone = req.body.userIdentity;
        next();
    }
    else{
        res.send({
            "code": 400,
            "failed": "User Identity is not valid"
        });
    }
};
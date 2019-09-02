var User = require('../models/User');
const { validationResult } = require('express-validator');
const Sequelize = require("sequelize");

// Alternatively: const secret = otplib.authenticator.generateSecret();
exports.verifyOTP = async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    //find if phone or email present simply, here we need to check either one of them should present
    //strictly.
    await User.findOne({
        where: Sequelize.or({email:req.body.userIdentity},{phone:req.body.userIdentity})
    }).then(
        (user) => {
            if (req.body.otp == user.otp) {
                user.update({
                    verified: true
                }).then(users => {
                    res.header("x-access-token", User.generateAuthToken(users)).send({
                        "code": 200,
                        "verified": users.verified
                    });
                });
            }
            else {
                res.send({
                    "code": 204,
                    "verified": false
                });
            }
        }).catch(error => {
            res.send({
                "code": 400,
                "failed": "No Such User"
            });
        });

}
var User = require('../models/User');
const { validationResult } = require('express-validator');
const Sequelize = require("sequelize");

// Alternatively: const secret = otplib.authenticator.generateSecret();
exports.updateProfilePicCode = async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    //find if phone or email present simply, here we need to check either one of them should present
    //strictly.
    await User.findOne({
        userid: req.userDataFromToken.user_info.user_id
    }).then(
        (user) => {
            user.update({
                lastProfilePicId:req.body.pictureCode
            }).then(users => {
                res.header("x-access-token", User.generateAuthToken(users)).send({
                    "code": 200,
                    "pictureCode": users.lastProfilePicId
                });
            });
        }).catch(error => {
            res.send({
                "code": 400,
                "failed": "No Such User"
            });
        });
}
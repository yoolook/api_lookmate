var User = require('../models/User');
// Alternatively: const secret = otplib.authenticator.generateSecret();
exports.verifyOTP = async function(req,res){
    await User.findOne({ where: { email: req.body.email} }).then(
         (user) => {
            if(req.body.otp == user.otp){
                user.update({
                    verified:true
                }).then(users => {
                    res.header("x-access-token", User.generateAuthToken()).send({
                        "code": 200,
                        "verified":users.verified
                    });
                });
            }
            else{
                res.send({
                    "code": 204,
                    "verified":false
                });
            }
        }).catch(error => {
        res.send({
            "code": 400,
            "failed": "No Such User"
        });
    });

}
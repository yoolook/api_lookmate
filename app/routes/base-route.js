const verifyAuthToken= require('../middleware/auth')
module.exports = function (app) {
    var lookmateLoginUserRoute = require('../controller/lookmateLoginUserController');
    var lookmateRegisterRoute = require('../controller/lookmateRegisterController');
    var googleAuthorization = require('../controller/googleAuth');
    var checkOTP = require('../controller/checkOTP');
    //loomkmate login route
    app.route('/login').post(lookmateLoginUserRoute.login);
    //lookmate registartion route
    app.route('/register').post(lookmateRegisterRoute.register);
    //google related URL's.
    app.route('/auth/google/').get(googleAuthorization.verify);
    //google related URL's.
    app.route('/auth/otp/').get(verifyAuthToken,checkOTP.verifyOTP);
};
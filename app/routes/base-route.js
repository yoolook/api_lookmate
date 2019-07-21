const verifyAuthToken= require('../middleware/auth');
const { check} = require('express-validator');
var io        =     require("socket.io");
//check is used for getting the error: to set errors on response, validation is used in controller.

module.exports = function (app) {
    var lookmateLoginUserRoute = require('../controller/lookmateLoginUserController');
    var lookmateRegisterRoute = require('../controller/lookmateRegisterController');
    var googleAuthorization = require('../controller/googleAuth');
    var generalMethods = require('../controller/general.validators');
    var checkOTP = require('../controller/checkOTP');
    //loomkmate login route
    app.route('/login').post([check('userid').isLength({ min: 4}),check('password').isLength({ min: 5})],lookmateLoginUserRoute.login);
    //lookmate registartion route
    app.route('/register').post([check('userIdentity').isLength({ min: 4}),check('password').isLength({ min: 5})],generalMethods.checkMobileOrEmail,lookmateRegisterRoute.register);
    //google related URL's.
    app.route('/auth/google/').get(googleAuthorization.verify);
    //google related URL's.
    app.route('/auth/otp/').post(verifyAuthToken,checkOTP.verifyOTP);

    
};
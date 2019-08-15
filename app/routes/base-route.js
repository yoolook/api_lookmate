const { verifyAuthToken, verifyAuthSocketToken } = require('../middleware/auth');
/* verifyAuthSocketToken:used for authentication of socket data. */
const { check } = require('express-validator');

//check is used for getting the error: to set errors on response, validation is used in controller.

module.exports = function (app, io) {
    var lookmateLoginUserRoute = require('../controller/lookmateLoginUserController');
    var lookmateRegisterRoute = require('../controller/lookmateRegisterController');
    var googleAuthorization = require('../controller/googleAuth');
    var generalMethods = require('../controller/general.validators');
    var checkOTP = require('../controller/checkOTP');
    var lookmateMoreUserInfo = require('../controller/moreUserInfoController')
    var makeAppearance = require('../controller/addAppearance');
    //loomkmate login route
    app.route('/login').post([check('userid').isLength({ min: 4 }), check('password').isLength({ min: 5 })], lookmateLoginUserRoute.login);
    //lookmate registartion route
    app.route('/register').post([check('userIdentity').isLength({ min: 4 }), check('password').isLength({ min: 5 })], generalMethods.checkMobileOrEmail, lookmateRegisterRoute.register);
    //google related URL's.
    app.route('/auth/google/').get(googleAuthorization.verify);
    //google related URL's.
    app.route('/auth/otp/').post(verifyAuthToken, generalMethods.checkMobileOrEmail, checkOTP.verifyOTP);
    //register more user info into the database.
    app.route('/register/next').post(verifyAuthToken, [check('nick_name').isLength({ min: 4 }), check('birth_year_range').isLength({ min: 4 }), check('gender').isLength({ min: 1 }, { max: 1 })], lookmateMoreUserInfo.updateMoreInfo);
    //app.route('/auth/otp/').post(verifyAuthToken, checkOTP.verifyOTP);
    //example of authentication on the socket.
    /* todo: keep udpating the policy for the Socket URL update. 
    toinitialConnect:"connection" request:[token] response[error message]
    toAddAppearance: "addAppearance" request:[]
    */
    io.use(verifyAuthSocketToken);
    io.on('connect', function (socket) {
        // Connection now authenticated to receive further events
        console.log("in connect >" + JSON.stringify(socket.decoded));
        socket.on('addAppearance', function (data) {
            console.log("Add appearance triggered");
            makeAppearance.addAppearance(data,socket.decoded,function (res) {
                if (res) {
                    console.log("Add appearance emitted");
                    io.emit('refreshAppearance', res);
                } else {
                    console.log("Add appearance error");
                    io.emit('error');
                }
            });
            //io.sockets.emit('event',"that's what you sent:" + data);
        });
    })
};

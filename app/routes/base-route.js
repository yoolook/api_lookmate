module.exports = function (app) {
    var lookmateLoginUserRoute = require('../controller/lookmateLoginUserController');
    var lookmateRegisterRoute = require('../controller/lookmateRegisterController');
    var googleAuthorization = require('../controller/googleAuth');
    //loomkmate login route
    app.route('/login').post(lookmateLoginUserRoute.login);
    //lookmate registartion route
    app.route('/register').post(lookmateRegisterRoute.register);
    //google related URL's.
    app.route('/auth/google/').get(googleAuthorization.verify);

};
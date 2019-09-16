const { verifyAuthToken, verifyAuthSocketToken } = require('../middleware/auth');
/* verifyAuthSocketToken:used for authentication of socket data. */
const { check } = require('express-validator');
//check is used for getting the error: to set errors on response, validation is used in controller.
var numClients = 0;

module.exports = function (app, io) {
    var lookmateLoginUserRoute = require('../controller/lookmateLoginUserController');
    var lookmateRegisterRoute = require('../controller/lookmateRegisterController');
    var googleAuthorization = require('../controller/googleAuth');
    var generalMethods = require('../middleware/general.validators');
    var checkOTP = require('../controller/checkOTP');
    var lookmateMoreUserInfo = require('../controller/moreUserInfoController')
    var makeAppearance = require('../controller/addAppearance');
    var uploadImageToServer = require('../middleware/uploadImage');
    var commentController = require('../controller/addComment');
    var uploadProfilePic = require('../middleware/uploadProfileImage');
    var updateProfilePicCode = require('../controller/uploadProfilePicture');
    var rateController = require('../controller/rateAppearance');
    var deleteAppearanceController = require('../controller/deleteAppearance');
    //loomkmate login route
    app.route('/login').post([check('userid').isLength({ min: 4 }), check('password').isLength({ min: 5 })], lookmateLoginUserRoute.login);
    //lookmate registartion route
    //todo:add an entry using triggers in setting table as soon as user is created.
    app.route('/register').post([check('userIdentity').isLength({ min: 4 }), check('password').isLength({ min: 5 })], generalMethods.checkMobileOrEmail, lookmateRegisterRoute.register);
    //google related URL's.
    app.route('/auth/google/').get(googleAuthorization.verify);
    //google related URL's.
    app.route('/auth/otp/').post(verifyAuthToken, generalMethods.checkMobileOrEmail, checkOTP.verifyOTP);
    //register more user info into the database.
    app.route('/register/next').post(verifyAuthToken, [check('nick_name').isLength({ min: 4 }), check('birth_year_range').isLength({ min: 4 }), check('gender').isLength({ min: 1 }, { max: 1 })], lookmateMoreUserInfo.updateMoreInfo);
    //app.route('/auth/otp/').post(verifyAuthToken, checkOTP.verifyOTP);
    //below is for Mysql update of appearance which was commented because I was trying to implement the same with rabbitmq.
    //app.route('/addAppearance').post(verifyAuthToken,[check('picture').isLength({ min: 1 }),check('caption').isLength({ min: 1 })],makeAppearance.addAppearance);
    //merged the service to upload file/images to the server. 
    //todo:remove the images from the folder if database failed to record the image data to the db.
    app.route('/addAppearance').post(verifyAuthToken,[check('picture').isLength({ min: 1 }),check('caption').isLength({ min: 1 })],uploadImageToServer.uploadImageToServer,makeAppearance.addAppearance);
    //route for the comments 
    //todo:implement to concept of x-socket-id
    app.route('/comment').post(verifyAuthToken,[check('commentText').isLength({ min: 1 })],commentController.addComment);
    //upload user profile pic.
    //todo:delete it from folder if database failed to record the image in db, implement to concept of x-socket-id
    app.route('/uploadprofilepic').post(verifyAuthToken,uploadProfilePic.uploadProfilePicOnFolder,updateProfilePicCode.updateProfilePicCode);
    //update rate by the user.
    app.route('/rateappearance').post(verifyAuthToken,[check('rate').isIn([1,2,3,4,5])],rateController.rateAppearance);
    
    //delete API's.
    app.route('/deleteAppearance/:appearanceId').delete(verifyAuthToken,deleteAppearanceController.deleteAppearance);
    
    /*todo: keep udpating the policy for the Socket URL update. 
    toinitialConnect:"connection" request:[token] response[error message]
    toAddAppearance: "addAppearance" request:[]
    */
   //for testing purpose
   //app.route('/testcustomcheck').post([check('image').isImage()],function(){ console.log("function executed")});

   io.use(verifyAuthSocketToken);
   io.on('connect', function (socket) {
    console.log("Client " + numClients++ +" in connect >" + JSON.stringify(socket.decoded));
        io.emit('refreshAppearance',"updated message");
   });

/*  //for experiment of of    
    var iosa = io.of('/lookmate');
    iosa.on('connection', function(socket){
        console.log('Connected to Stack Abuse namespace');
    });
    iosa.emit('refreshAppearance',"test data"); */
   
    

/* //--------very important:start (open addAppearance file as well)-------------- 
    // this module allow user to upload appearance from socket as well, later I realized that this should be from api instead of socket, but it's completely working.
    io.use(verifyAuthSocketToken);
    io.on('connect', function (socket) {
        // Connection now authenticated to receive further events
        console.log("in connect >" + JSON.stringify(socket.decoded));
        socket.on('addAppearance', function (data) {
            console.log("Add appearance triggered");
            makeAppearance.addAppearanceBySocket(data,socket.decoded,function (res) {
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
    }) */

 


};


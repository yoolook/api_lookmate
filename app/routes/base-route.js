const { verifyAuthToken } = require('../middleware/auth');
const { check} = require('express-validator');

module.exports = function (app) {
    //var testRouteController = require('../controller/testRoute');
    var lookmateLoginUserRoute = require('../controller/lookmateLoginUserController');
    var settingController = require('../controller/settingController');
    var lookmateRegisterRoute = require('../controller/lookmateRegisterController');
    var googleAuthorization = require('../controller/googleAuth');
    var generalMethods = require('../middleware/general.validators')
    var checkOTP = require('../controller/checkOTP');
    var lookmateMoreUserInfo = require('../controller/moreUserInfoController')
    var makeAppearance = require('../controller/addAppearance');
    var uploadImageToServer = require('../middleware/uploadImage');
    var commentController = require('../controller/addComment');
    var notificationController = require('../controller/notification');
    var updateProfilePicCode = require('../controller/uploadProfilePicture');
    var rateController = require('../controller/rateAppearance');
    var stalkUserController = require('../controller/stalkUser');
    var updatePasswordController = require('../controller/updatePassword');
    var checkUserExists = require('../controller/checkUserExist');
    var appearanceInfoDesktop = require('../controller/desktopAppearanceDetails');
    var deleteAppearanceController = require('../controller/deleteAppearance');
    var customValidation = require('../middleware/custom-validators');

    //Silient login here.
    app.route('/slogin').get(verifyAuthToken, lookmateLoginUserRoute.slogin);
    //loomkmate login route
    app.route('/login').post([check('userid').isLength({ min: 4 }), check('password').isLength({ min: 5 })], lookmateLoginUserRoute.login);
    //lookmate registartion route
    //todo:add an entry using triggers in setting table as soon as user is created.
    app.route('/register').post([check('userid').isLength({ min: 4 }), check('password').isLength({ min: 5 })], generalMethods.checkMobileOrEmail, lookmateRegisterRoute.register);
    //checkIfUserExists
    app.route('/checkUserExists').post([check('userid').isLength({ min: 4 })], generalMethods.checkMobileOrEmail, checkUserExists.checkEmailorMobileExists)
    //google related URL's.
    app.route('/auth/google/').get(googleAuthorization.verify);
    //Verify OTP of the user second stage of the application - removed verification method from OTP section.
    app.route('/auth/otp').post(generalMethods.checkMobileOrEmail, checkOTP.verifyOTP);
    //Generate OTP and feed that in database API.
    app.route('/auth/generateOTP').post(generalMethods.checkMobileOrEmail, checkOTP.generateOTP);
    app.route('/updatePassword').post(verifyAuthToken, updatePasswordController.updatePassword);
    //register more user info into the database.
    app.route('/updateWelcomeDetails').post(verifyAuthToken, [check('nickName').isLength({ min: 4 }, { max: 12 }), check('birthYear').isLength({ min: 1 }), check('gender').isLength({ min: 1 }, { max: 1 }), check('bio').isLength({ max: 100 })], lookmateMoreUserInfo.updateMoreInfo);
    //todo:remove the images from the folder if database failed to record the image data to the db.
    app.route('/addAppearance').post(verifyAuthToken, [check('picture').isLength({ min: 1 }), check('caption').isLength({ min: 1 })], uploadImageToServer.uploadImageToServer, makeAppearance.addAppearance);
    //todo:implement to concept of x-socket-id
    app.route('/addComment').post(verifyAuthToken, [check('commentText').isLength({ min: 1 })], generalMethods.getAppearanceRelatedUserDetail, generalMethods.checkCommentLimitSetting, commentController.addComment);
    //todo:implement to concept of x-socket-id
    app.route('/getComments/:apperanceId').get(verifyAuthToken, generalMethods.checkIfAppearanceExists, commentController.getLatestComment);
    //upload user profile pic.
    //todo:delete it from folder if database failed to record the image in db, implement to concept of x-socket-id
    app.route('/uploadprofilepic').post(verifyAuthToken, uploadImageToServer.uploadImageToServer, updateProfilePicCode.updateProfilePicCode);
    //update rate by the user.
    app.route('/rateappearance').post(verifyAuthToken, [check('rate').isIn([1, 2, 3, 4, 5])], rateController.rateAppearance);
    //get rate for specific appearance and for specific user.
    app.route('/getrateappearance/:apperanceId').get(verifyAuthToken, rateController.getRateAppearance);
    //stalk user API's (both the below API are working fine. commented on 0412022) with reason that they are not in use.
    //todo:create an API to (GET API )get count of stalker, (GET API) list of user stalking to, delete the stalk relationship.
    //app.route('/stalkuser').post(verifyAuthToken, [check('stalkUserId').isLength({ min: 1 })], stalkUserController.stalkUser);
    //GET Request API's
    //app.route('/getStalkList').get(verifyAuthToken, stalkUserController.getStalkList);
    //GET latest upload pic, for as soon as user gets on the home page of application.
    app.route('/getlatestAppearaces').get(verifyAuthToken, makeAppearance.getLatestAppearance);
    //GET latest upload pic of a particular user if user_id is set, otherwise get for logined user. 
    app.route('/getUserAppearance/:user_id').get(verifyAuthToken, generalMethods.checkUserAndGetEntitlements, makeAppearance.getUserLatestAppearance);
    //POST get appearance with details using the appearacnce id., when user clicks and open a appearance.
    app.route('/getAppearance').post(verifyAuthToken, generalMethods.checkIfAppearanceExists, generalMethods.getAppearanceRelatedUserDetail, generalMethods.checkCommentLimitSetting, makeAppearance.getAppearance);
    //provide latest list of comments based on appearance id.
    app.route('/getPreviousComment').post(verifyAuthToken, commentController.getPreviousComment);
    //Get user related data with permissions, strictly check entitlement for this.
    app.route('/getUserInformation/:user_id').get(verifyAuthToken, generalMethods.checkUserAndGetEntitlements, lookmateMoreUserInfo.getUserInformation);
    //notification API's
    app.route('/getLatestNotifications').get(verifyAuthToken, notificationController.getLatestNotificationFromDatabaseForUser)
    app.route('/getUnreadNotificationsCount').get(verifyAuthToken, notificationController.getUnreadNotificationCountFromDatabaseForUser)
    app.route('/markReadNotification/:notification_id').get(verifyAuthToken, check('notification_id').exists().isInt(), notificationController.markReadAllNotificationFromDatabaseForUser)
    //soft delete appearances  
    app.route('/deleteAppearance/:appearanceId').delete(verifyAuthToken, generalMethods.checkIfAppearanceBelongsToDeleteUser, deleteAppearanceController.deleteAppearance);
    app.route('/submitRegistrationId').post(verifyAuthToken, lookmateLoginUserRoute.submitRegistrationId);
    /*todo: keep udpating the policy for the Socket URL update. 
    toinitialConnect:"connection" request:[token] response[error message]
    toAddAppearance: "addAppearance" request:[]
    */
    /* Setting routes */
    app.route('/getUserSettings').get(verifyAuthToken, settingController.getUserSettings);
    //check if userid sent in the body exists with us first before going ahead with permissions. 
    app.route('/getOtherUsersEntitlements').post(verifyAuthToken, generalMethods.checkUserAndGetEntitlements, settingController.getOtherUsersEntitlements);
    app.route('/setUserSettings').post(verifyAuthToken, [check('setValue').isLength({ min: 1 }), check('setValue').custom(customValidation.authorizedSettings)], settingController.setUserSettings);

    //Risky API's from desktop:
    app.route(`/getDesktopDetails/:pictureId`).get(generalMethods.checkIfAppearanceExists, appearanceInfoDesktop.getDesktopRelatedAppearanceDetails);
    //anyone can changes the user identifier from postman and submit the request many times.
    app.route('/addOpenComment').post([check('commentText').isLength({ min: 1 })], generalMethods.mapPictureIdToAppearanceId, generalMethods.getAppearanceRelatedUserDetail, generalMethods.checkOpenCommentLimitSetting, commentController.addComment);
    //for testing purpose
    //app.route('/testcustomcheck').post([check('image').isImage()],function(){ console.log("function executed")});
    //app.route('/test').get(testRouteController.testroutes);
};


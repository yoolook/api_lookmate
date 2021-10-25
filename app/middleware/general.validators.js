
var validator = require('validator');
var db = require('../database/connection');
var requestParamFormatter = require('../helper/requestParamFormatter');
var adminConfig = require('../../config/adminConf');
var requestIp = require('request-ip');
/**
 * Check if provided value is mobile or email. if not from both, return 400 back to the user.
 * !partial implementation: these values are used in register controller.
 * @param req: all requested parameters
 * @param res: provide the response if required.
 */

 /* Updates:
 1. Updated userIdentification to userid as there is only one param on UI for register and login and both should be same.

 */

checkMobileOrEmail = function (req, res, next) {
    console.log("inside in validators--" + JSON.stringify(req.body));
    if (validator.isEmail(req.body.userid)) {
        //assign email parameter, the provided email id
        req.body.email = req.body.userid;
        req.body.phone = null;
        next();
    }
    else if (validator.isMobilePhone(req.body.userid)) {
        req.body.email = null;
        req.body.phone = req.body.userid;
        next();
    }
    else{
        console.log("\n into else part");
        var responseObject={
            returnType:"Error", //could be error or success.
            code:206,
            message:"Invalid user input"
        }
        res.status(206).send(responseObject)
    }
};

/* todo:going forward take only a single setting, rather then providing the complete set */
checkUserAndGetEntitlements = function(req, res,next) {
    console.log("\nReached to middleware :" +   req.params.user_id );
    if(req.params.user_id!=null){
        db.settings.findOne({
            attributes: ['user_id','profileVisibleTo','profilePictureVisibility','strictlyAnonymous','maxCommentCountPerPerson','notificationScreen'],
            where: { user_id: req.params.user_id }
        }).then((settingResponse) => {
            console.log("sending settings to the contrlller: " + JSON.stringify(settingResponse));
            req.userEntitlements = settingResponse;
            next();
        }).catch(error => {
            res.send({
                "code": 400,
                "message": "server failed to get settings " + error
            });
        });
    }else{
        // if somehow you need to pass this code, make sure next controller should only be used to fetch logined user information, it is safe then...as it is used here. 
        req.userEntitlements = null
        console.log("sending else case to the contrlller: " + req.userEntitlements);
        
        next();
    }
};

/* Special function for delete, we need to verify if this image belongs to this user only. */
checkIfAppearanceBelongsToDeleteUser = function(req, res,next){
    console.log("Got delete request to delete appearance id " +  req.params.appearanceId);
    db.appearances.count({
        attributes: ['appearance_id', 'picture'],
        where: { 
            appearance_id: req.params.appearanceId,
            user_id: req.userDataFromToken.user_info.user_id },
        include: [
            {
                attributes: ['registration_id', 'user_id'],
                model: db.users
            }
        ]
    }).then((count) => {
        console.log("Count of records on delete:" + count);
        if(count>=1)
            next();
    }).catch((error)=>{
        /* image does not belong to this user */
        res.send({
            "code": 400,
            "message": "server failed to delete image" + error
        });
    });
}

mapPictureIdToAppearanceId = function (req, res, next) {
    console.log("Appearance picture ID:", req.body);
    db.appearances.findOne({
        attributes: ['appearance_id'],
        where: { picture: requestParamFormatter.APPEARANCE_NAME_FORMAT(req.body.pictureId) }
    }).then((response) => {
        if (response) {
            console.log("Fetched Response", response);
            req.body.appearanceid = response.appearance_id
            next();
        }
        else {
            throw new Error("No Appearance Found for mapping");
        }
    }).catch((error) => {
        //todo:pass an error to UI here.
        /* image does not belong to this user */
        res.send({
            "code": 400,
            "message": "No Appearance found for mapping"
        });
    });
}

checkIfAppearanceExists = function (req, res, next) {
    var whereMarker;
    if (req.params && req.params.pictureId) {
        console.log("picture Id:",requestParamFormatter.APPEARANCE_NAME_FORMAT(req.params.pictureId));
        whereMarker = { picture: requestParamFormatter.APPEARANCE_NAME_FORMAT(req.params.pictureId) }
        //modify param now, once it is validated.
        req.params.pictureId = requestParamFormatter.APPEARANCE_NAME_FORMAT(req.params.pictureId);
        
    }
    else
        whereMarker = { appearance_id: req.body.appearanceid || req.params.apperanceId }
    db.appearances.count({
        attributes: ['appearance_id'],
        where: whereMarker
    }).then((response) => {
        console.log("response:" + JSON.stringify(response));
        if (response >= 1) {
            next();
        }
        else {
            throw new Error("No Appearance Found");
        }
    }).catch((error) => {
        //todo:pass an error to UI here.
        console.log("No appearance found" + error);
        /* image does not belong to this user */
        res.send({
            "code": 400,
            "message": "No Appearance found"
        });
    });
}


getAppearanceRelatedUserDetail = function (req, res, next) {
    console.log("Appearance id in user details " + req.body.appearanceid);
    db.appearances.findOne({
        attributes: ['appearance_id', 'picture'],
        where: { appearance_id: req.body.appearanceid},
        include: [
            {
                attributes: ['registration_id', 'user_id'],
                model: db.users
            }
        ]
    }).then((response) => {
        console.log("response:" + JSON.stringify(response));
        if (response || response!=undefined) {
            console.log("user for which comment has been made " + response.user.user_id);
            req.params.user_id = response.user.user_id; 
            req.params.registeration_id = response.user.registration_id;
            req.params.picture = response.picture;
            req.params.appearance_id = response.appearance_id;
            checkUserAndGetEntitlements(req,res,next);
        }
        else {
            throw new Error("error: No related user found")
        }
    }).catch((error) => {
        //todo:pass an error to UI here.
        console.log("Error in getting registeration id" + error);
        /* image does not belong to this user */
        res.send({
            "code": 400,
            "message": "server failed to open image"
        });
    });
};


/* check if user is not excedding the limit of comments set in the settings */
checkCommentLimitSetting = async function(req, res, next){
    db.comments.count({
        where:{
            appearance_id: req.body.appearanceid,
            user_id: req.userDataFromToken.user_info.user_id
        }
    }).then(count=>{
        //update req obj to send commentlimitleft in response, so that we can disable button on UI.
        req.params.commentLimitLeft = (req.userEntitlements.maxCommentCountPerPerson - count); 
        console.log("Comment Limit Left: " + req.params.commentLimitLeft);
        //req.params.commentLimitLeft = 1;
        next();   
    });
}

// inside middleware handler- can use to get ip address of the user and save it in the database.
trackIpAddressForOpenRequests = function(req, res, next) {
    req.body.user_id = requestIp.getClientIp(req); 
    console.log("userId now is",req.body.user_id);
    next();
};

/* check if user is not excedding the limit of comments set in the settings in case of open comments with IP address*/
checkOpenCommentLimitSetting = async function(req, res, next){
    console.log("User Identifier:",req.headers.useridentifier);
    db.comments.count({
        where:{
            appearance_id: req.body.appearanceid,
            ip_address: req.headers.useridentifier
        }
    }).then(count=>{
        //update req obj to send commentlimitleft in response, so that we can disable button on UI.
        req.params.commentLimitLeft = adminConfig.openCommentsLimit-count; 
        
        console.log("Comment Limit Left: " + req.params.commentLimitLeft);
        
        //req.params.commentLimitLeft = 1;
        next();   
    }).catch((error) => {
        res.send({
            "code": 400,
            "message": "Not allowed to comment now."
        });
    });
}



module.exports = {
    checkMobileOrEmail:checkMobileOrEmail,
    checkUserAndGetEntitlements:checkUserAndGetEntitlements,
    getAppearanceRelatedUserDetail:getAppearanceRelatedUserDetail,
    checkCommentLimitSetting:checkCommentLimitSetting,
    checkIfAppearanceBelongsToDeleteUser:checkIfAppearanceBelongsToDeleteUser,
    checkIfAppearanceExists:checkIfAppearanceExists,
    mapPictureIdToAppearanceId:mapPictureIdToAppearanceId,
    trackIpAddressForOpenRequests:trackIpAddressForOpenRequests,
    checkOpenCommentLimitSetting:checkOpenCommentLimitSetting
  };
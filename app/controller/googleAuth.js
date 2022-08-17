
var authKeys = require('../../config/auth-bind-config');
var lookmateRegisterRoute = require('../controller/lookmateRegisterController');
var db = require("../../Initialize/init-database");
var client = require("../../Initialize/init-google-auth");
const authSecret = require("../../Initialize/init-cache");
var googleClientId = authSecret.get('authKeys').googleAuth.clientID;
const infoMessages = require('../../config/info-messages');
/* dnd:used when auth is from backend, but now its from UI so running next line function */


exports.verify = function (req, res) {
    //verify function verifies the user from google server.
    verify(req, res).then(async (payload) => {
        //check if payload is fine todo: apply more authentication to the payload.
        //if email exist getting the record and sending the user details.
        await db.users.findOne({ where: { email: payload.email } }).then(result => {
            if (result) {
                //login and send back the response with jwt auth key.
                /* res.header("x-auth-token", db.users.generateAuthToken(result)).send({ */
                res.send({
                    "code": 200,
                    "message": infoMessages.SUCCESS_GOOGLE_LOGIN,
                    "user": result.nick_name,
                    "email": result.email,
                    "first_time_user": result.first_time_user,
                    "authorization": db.users.generateAuthToken(result),
                    "realReturn": JSON.stringify(result)
                });
            }
            else {
                /*  --new user from google policies:
                 1. password will be the email (automatically generated)
                 2. Nick name will be 'user' for new user, unit he/she will set it from welcome screen or settings */
                var user_info = {
                    body:
                    {
                        email: payload.email,
                        password: payload.email,
                        verified: payload.email_verified,
                        phone: null
                    }
                }
                //create user and send back the response with jwt auth key and new user true, get user to create nick name.
                lookmateRegisterRoute.register(user_info, res);
            }
        });
    }).catch(error => {
        logger.error(infoMessages.ERROR_UNKNOWN_LOGIN + ":" + error, { service: "GoogleAuth-*c" })
        //todo:Need to be managed from response send final middleware.
        var responseObject = {
            returnType: "Error", //could be error or success.
            code: 501,
            message: infoMessages.ERROR_UNKNOWN_LOGIN,
        }
        res.status(400).send({ responseObject })
    }
    );
}

async function verify(req, res) {
    const ticket = await client.verifyIdToken({
        idToken: req.headers.authorization, //always recieved in small case on node. :(
        audience: googleClientId  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    return ticket.getPayload();
}



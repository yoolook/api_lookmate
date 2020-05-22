var db = require('../database/connection')
const { OAuth2Client } = require('google-auth-library');
var authKeys = require('../../config/auth');
var lookmateRegisterRoute = require('../controller/lookmateRegisterController');

/* dnd:used when auth is from backend, but now its from UI so running next line function */
//const client = new OAuth2Client(authKeys.googleAuth.clientID);
const client = new OAuth2Client({
    clientId:authKeys.googleAuth.clientID,redirectUri:authKeys.googleAuth.callbackURL});

exports.verify = function (req, res) {
    //verify function verifies the user from google server.
    verify(req, res).then(async (payload) => {
        //check if payload is fine todo: apply more authentication to the payload.
        console.log("\npayload from google: " + JSON.stringify(payload));
        let user = await db.users.findOne({ where: { email: payload.email } });
        if (user) {
            //login and send back the response with jwt auth key.
            res.header("x-auth-token", User.generateAuthToken(user)).send({
                "code": 200,
                "success": "login sucessfull",
                "user": user.nick_name,
                "email": user.email,
                "new_user": false
            });
        }
        else {
            console.log("user not found");
            /*  --new user from google policies:
             1. password will be the email (automatically generated)
             2. Nick name will be 'user' for new user, unit he/she will set it from welcome screen or settings */
            const user_info = {
                body:
                {
                    email: payload.email,
                    password: payload.email,
                    verified:payload.email_verified,
                    phone:null
                }
            }
            //create user and send back the response with jwt auth key and new user true, get user to create nick name.
            lookmateRegisterRoute.register(user_info, res);
        }
    }).catch(error => {
        console.log("Google Auth Error: " + error)
        res.send({ Error: "Error logged on server" + error })
    }
    );
}

async function verify(req, res) {
    const ticket = await client.verifyIdToken({
        idToken: req.headers.authkey,
        audience: authKeys.googleAuth.clientID  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    return ticket.getPayload();
    //const payload = ticket.getPayload();
    //res.send(payload);
}



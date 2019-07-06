var User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');
var authKeys = require('../../config/auth');
var lookmateRegisterRoute = require('../controller/lookmateRegisterController');


const client = new OAuth2Client(authKeys.googleAuth.clientID);
exports.verify = async function (req, res, next) {
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: req.headers.authkey,
            audience: authKeys.googleAuth.clientID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        //res.send(payload);
        //check if payload is fine todo: apply more authentication to the payload.
        if (payload) {
            console.log("\npayload from google: " + JSON.stringify(payload));
            let user = await User.findOne({ where: { email: payload.email } });
            if (user) {
                //login and send back the response with jwt auth key.
                res.header("x-auth-token", User.generateAuthToken()).send({
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
                        password: payload.email
                    }
                }
                //create user and send back the response with jwt auth key and new user true, get user to create nick name.
                lookmateRegisterRoute.register(user_info,res);
            }
        }
    }
    verify().catch(console.error, () => {
        console.error();
        res.send("Error logged on server")
    }
    );
}



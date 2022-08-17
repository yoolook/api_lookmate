//input source [authKeys]
const { OAuth2Client } = require('google-auth-library');
const authSecret = require("./init-cache");
const authKeys = authSecret.get('authKeys');

const client = new OAuth2Client({ clientId: authKeys.googleAuth.clientID, redirectUri: authKeys.googleAuth.callbackURL });
module.exports = client;
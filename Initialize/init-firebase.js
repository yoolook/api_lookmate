//input source [authKeys, adminConfig]
var firebaseAdmin = require("firebase-admin");
var adminConfig = require("../config/adminConf");
const authSecret = require("./init-cache");
const authKeys = authSecret.get('authKeys');
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(authKeys.firebase_Auth),
  databaseURL: "https://lookmate-1561824215990.firebaseio.com",
});
var db = firebaseAdmin.database();
db.ref(adminConfig.firebase_db_ref);
module.exports = firebaseAdmin;


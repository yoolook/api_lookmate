
var firebaseAdmin = require("firebase-admin");
/* var authKeys = require('../../config/auth-bind-config'); */
//todo: Using an OAuth 2.0 refresh tokenc (https://firebase.google.com/docs/admin/setup)
//todo: Authenticate with limited privileges using
//https://firebase.google.com/docs/database/admin/start#node.js
//move initialization of app in the app.js file later.
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(authKeys.firebase_Auth),
  databaseURL: "https://lookmate-1561824215990.firebaseio.com"
});
var db=firebaseAdmin.database();

var firebaseDBReference = db.ref("lookmate");
module.exports = {
  firebaseAdmin:firebaseAdmin,
  firebaseDBReference:firebaseDBReference
}

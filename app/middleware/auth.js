const jwt = require("jsonwebtoken");
var authKeys = require('../../config/auth');
/* Token Policies
1. Token should be attached in the form of ["x-access-token"] in header of all the requests. 
2. All User information can be attained throuigh "userDataFromToken" for later user.
*/
exports.verifyAuthToken = function (req, res, next) {
  //get the token from the header if present
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  console.log("decoded value in Auth:" + token);
  //if no token found, return response (without going to the next middelware)
  if (!token) {
    console.log("token is not present");
    return res.status(401).send("Access denied. No token provided.");
  }
  try {

    //if can verify the token, set req.user and pass to next middleware
    const decoded = jwt.verify(token, authKeys.secret_codes.jwt_secret_key);
    //todo:manage the time duration, if lapse then redirect back to user with time out status
    //can be managed using "decode"
    req.userDataFromToken = decoded;
    console.log("Auth > UserDetails: " + JSON.stringify(decoded));
    next();
  } catch (ex) {
    console.log("invalid token" + JSON.stringify(ex));
    //if invalid token
    //res.status(401).send("Invalid token." + ex);
      var responseObject={
        returnType:"Error", //could be error or success.
        code:206,
        message:"Catch from token auth"
      }
      res.status(206).send(responseObject);
  }
};

exports.verifyAuthSocketToken = function (socket, next) {
  //policy: status.token: Should send the token to the socket.
  const token = socket.handshake.query.token;
  if (!token) {
    return next(new Error('Could not find token'));
  }
  try {
    //if can verify the token, set req.user and pass to next middleware
    const decoded = jwt.verify(token, authKeys.secret_codes.jwt_secret_key);
    //const decoded = 1234;
    //todo:comment above line and uncomment next to above line when real jwt is sent from client
    //todo:manage the time duration, if lapse then redirect back to user with time out status
    socket.decoded = decoded;
    next();
  } catch (ex) {
    next(new Error('Could not Parse token'));
  }

};
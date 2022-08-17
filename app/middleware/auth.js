const jwt = require("jsonwebtoken");
const logger = require("../../logger");
const infoMessages = require("../../config/info-messages");
const authSecret = require("../../Initialize/init-cache");
const authKeys = authSecret.get('authKeys');

/* Token Policies
1. Token should be attached in the form of ["x-access-token"] in header of all the requests. 
2. All User information can be attained throuigh "userDataFromToken" for later user.
*/
exports.verifyAuthToken = function (req, res, next) {
  //get the token from the header if present
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  //if no token found, return response (without going to the next middelware)
  if (!token) {
    logger.warn(infoMessages.ERROR_ACCESS_DENIED + ":" + infoMessages.ERROR_TOKEN, { service : "Auth" })
    return res.status(401).send(infoMessages.ERROR_ACCESS_DENIED + ":" + infoMessages.ERROR_TOKEN );
  }
  try {
    //if can verify the token, set req.user and pass to next middleware
    const decoded = jwt.verify(token, authKeys.secret_codes.jwt_secret_key);
    //todo:manage the time duration, if lapse then redirect back to user with time out status
    //can be managed using "decode"
    req.userDataFromToken = decoded;
    next();
  } catch (ex) {
    logger.error(infoMessages.ERROR_ACCESS_DENIED + ":" + infoMessages.ERROR_TOKEN, { service : "Auth-*c" })
      var responseObject={
        returnType:"Error",
        code:206,
        message:infoMessages.ERROR_TOKEN
      }
      res.status(206).send(responseObject);
  }
};
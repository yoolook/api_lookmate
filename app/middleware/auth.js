const jwt = require("jsonwebtoken");
var authKeys = require('../../config/auth');
/* Token Policies
1. Token should be attached in the form of ["x-access-token"] in header of all the requests. 
2.*/
module.exports = function(req, res, next) {
  console.log("processing token verification..." + JSON.stringify(req.headers));
  //get the token from the header if present
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  //if no token found, return response (without going to the next middelware)
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    //if can verify the token, set req.user and pass to next middleware
    const decoded = jwt.verify(token, authKeys.secret_codes.jwt_secret_key);
    //todo:manage the time duration, if lapse then redirect back to user with time out status
    //can be managed using "decode"
    //req.user = decoded;
    next();
  } catch (ex) {
    //if invalid token
    res.status(400).send("Invalid token.");
  }
};
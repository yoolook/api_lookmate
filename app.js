var logger = require("./logger/index");
var express = require("express");
var bodyParser = require("body-parser");
const { env } = require("process");
var adminConfig = require("./config/adminConf");
//just to initialize the secret server here, todo: try to implement caching here. so that it should not ask for secret again and again.
const initSecrets = require("./Initialize/initialize-secrets");
const storeSecret = require("./Initialize/init-cache");
require("./Initialize/initialize-server-dir");
logger.info("Initialized server directories..", { service: "base" });
initSecrets.then((x) => {
  //creating directory if not present.
  port = env.PORT || adminConfig.initial_server_run_port;
  var app = express();
  //opening Images and thumbnail folder to whole world.
  //todo: Use some strategy to limit the access to this folder and deliver the image through some script.
  app.use(
    "/images",
    express.static(__dirname + adminConfig.appearance_location.replace(".", ""))
  );
  app.use(
    "/thumbnails",
    express.static(
      __dirname + adminConfig.appearance_thumbnail_location.replace(".", "")
    )
  );
  app.use(
    "/profileimages",
    express.static(
      __dirname + adminConfig.profile_image_location.replace(".", "")
    )
  );
  //---db and google auth libraray setup----
  //todo: You can take each setup file externally and initialize it there with security from here.
  storeSecret.mset([
    {key: "dbConfig", val: x.dbConfigSecret},
    {key: "authKeys", val: x.authConfigSecret},
  ])
  //const client = new OAuth2Client(authKeys.googleAuth.clientID);
  //----end------
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(bodyParser.json({ type: "application/vnd.api+json" }));
  var routes = require("./app/routes/base-route");
  app.listen(port, adminConfig.intial_server_run_IP);
  var cors = require("cors");
  app.use(cors());
/*   routes(app,db,client,firebaseRef,otpKey,googleClientId,adminConfig); */
  routes(app);
  logger.info("Server Initiated on port " + port, { service: "base" });
}).catch((secretIntError) => {
  logger.error("Secret Initialization Error.." + secretIntError, { service: "IntSec" });
  //creating dummy server to keep docker container running and debug the network tunnels/ connections between the containers.
  const http = require('http');
  const port = env.PORT || adminConfig.initial_server_run_port;
  const requestListener = function (req, res) {
    res.writeHead(200);
    res.end('Debug Server Response');
  }
  const server = http.createServer(requestListener);
  server.listen(port);
  console.log("\n---Server created on " + port + " to debug docker network/connection on same port.---\n*Note: It's not a real expected lookmate server. It should be reverted, once actual server starts.");
});

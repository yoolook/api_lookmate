var logger = require('./logger/index')
var express    = require('express');
var bodyParser = require('body-parser');
require('dotenv').config({path: './lookmate.env'})
//creating directory if not present.
require('./initialize-server-dir');
logger.info("Initialized server directories..", { service: "base" } );
var adminConfig = require('./config/adminConf');
port = process.env.PORT || 3000;
var app = express();
//opening Images and thumbnail folder to whole world.
//todo: Use some strategy to limit the access to this folder and deliver the image through some script.
app.use('/images', express.static(__dirname + adminConfig.appearance_location.replace(".", "")));
app.use('/thumbnails', express.static(__dirname +  adminConfig.appearance_thumbnail_location.replace(".", "")));
app.use('/profileimages', express.static(__dirname + adminConfig.profile_image_location.replace(".", "")));
var db = require('./app/database/connection');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(bodyParser.json({ type: 'application/vnd.api+json' }))
var routes = require('./app/routes/base-route');
app.listen(port,adminConfig.intial_server_run_IP);
var cors = require('cors');
app.use(cors());
routes(app);
logger.info("Server Initiated on port " + port, { service: "base" } );
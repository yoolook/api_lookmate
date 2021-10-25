var express    = require('express');
var bodyParser = require('body-parser');

var http = require('http'); //only required when operating HTML from here , 
//I used it only for socket purpose when testing it with client htmk on local browser.
//var db = require('./app/models/db');
port = process.env.PORT || 3000;
var app = express();

//opening Images and thumbnail folder to whole world.
//todo: Use some strategy to limit the access to this folder and deliver the image through some script.
app.use('/images', express.static(__dirname + '/Images'));
app.use('/thumbnails', express.static(__dirname + '/Thumbnails'));
app.use('/profileimages', express.static(__dirname + '/ProfileImages'));



var db = require('./app/database/connection');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }))
 
var routes = require('./app/routes/base-route'); //importing route
//---start:for socket.io----
/* var http      =     require('http').Server(app);
var io        =     require("socket.io")(http); */
//---end:for socket.io-----

var socket = require("socket.io")
var server = app.listen(port,"0.0.0.0");
var io= socket(server);
var cors = require('cors');
app.use(cors());

routes(app, io); //register the route  */

app.get("/",function(req,res){
  res.sendFile(__dirname + '/socketCheck.html');
});



console.log('Lookmate server is running on: ' + port);

//changes for the test thing.
//module.exports = app


//--helper---
/* 1. Error formats/Object
Error = {
  code:
  message:
}

Codes:
200:Success
201 Created.The request has been fulfilled and has resulted in one or more new resources being created.
205: When username or password is incorrect, resources are not available. | show error message on UI.
206: invalid format of input.
------------------------------------
401: When something is not found.
402: Catch issue in SQL function | show error message from UI.

501: The request was not completed. The server met an unexpected condition..
502: Validation issue

Changes done after 23:05:2020
- I think x-access-token shouldn't be sent in res header, should be sent in res body.
*/
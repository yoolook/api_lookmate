var express    = require('express');
var bodyParser = require('body-parser');

var http = require('http'); //only required when operating HTML from here , 
//I used it only for socket purpose when testing it with client htmk on local browser.
//var db = require('./app/models/db');
port = process.env.PORT || 3000;
var app = express();
app.use('/images', express.static(__dirname + '/Images'));

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

routes(app,io); //register the route  */

app.get("/",function(req,res){
  res.sendFile(__dirname + '/socketCheck.html');
});

console.log('Lookmate server is running on: ' + port);

//--helper---
/* 1. Error formats/Object
Error = {
  code:
  message:
}

Codes:
401: When something is not found.
501: All Catches.

Changes done after 23:05:2020
- I think x-access-token shouldn't be sent in res header, should be sent in res body.
*/
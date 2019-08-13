var express    = require('express');
var bodyParser = require('body-parser');
var http = require('http'); //only required when operating HTML from here , 
//I used it only for socket purpose when testing it with client htmk on local browser.

port = process.env.PORT || 3000;
var app = express();
var SeqConnection = require("./app/database/connection");

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
var server = app.listen(port);
var io= socket(server);

routes(app,io); //register the route  */

app.get("/",function(req,res){
  res.sendFile(__dirname + '/socketCheck.html');
});


console.log('Lookmate server is running on: ' + port);




/* io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
 */


/* app.route('/events').post((req, res) => {
  let userid = req.body.userid;
  io.emit('call progress event', { userid });
  // Set the response type as XML.
res.header('Content-Type', 'text/xml');
// Send the TwiML as the response.
res.send({ user:userid });
}); */
//--end:socket.io------------





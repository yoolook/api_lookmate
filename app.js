var express    = require('express');
var bodyParser = require('body-parser');


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


routes(app); //register the route  */

app.listen(port);

console.log('Lookmate server is running on: ' + port);
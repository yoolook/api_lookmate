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

/* app.use(function(req,res,next){
    var token=req.body.token || req.headers['token'];
    if(token){
        jwt.verify(token,process.env.SECRET_KEY,function(err,ress){
            if(err){
                res.status(500).send('Token Invalid');
            }else{
                next();
            }
        })
    }else{
        res.send('Please send a token')
    }
}); */

routes(app); //register the route  */

app.listen(port);

console.log('Lookmate server is running on: ' + port);
const app = require('./app.js');
port = process.env.PORT || 3000;
app.listen(port,"0.0.0.0");

console.log('Lookmate server is running on: ' + port);


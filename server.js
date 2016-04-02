// set up ======================================================================
var http = require('http');
var express = require('express');
var app = express();
var port = process.env.PORT || 8000; // set the port
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
// configuration ===============================================================
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    'extended': 'true'
}));
app.use(bodyParser.json());
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
}));
app.use(methodOverride('X-HTTP-Method-Override'));
// Mongoose ====================================================================
require('./config/database');
// Serveur ===================================================================
var server = http.Server(app);
// routes ======================================================================
require('./app/routes')(app);
process.on('SIGINT', function() {
    console.log('Stopping...');
    process.exit();
});
// listen (start app with node server.js) ======================================
server.listen(port);
console.log('Listening at http://127.0.0.1:' + port);

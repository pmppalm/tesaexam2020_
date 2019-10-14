process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('./config/express'),
    mongoose = require('./config/mongoose'),
    passport = require('./config/passport');

var db = mongoose();
var app = express();
var port = process.env.PORT || 8080;
var passport = passport();

app.listen(port);


module.exports = app;

console.log('Server running …');

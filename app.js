var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var users = require('./routes/users');
var issues = require('./routes/issues');
var index = require('./routes/index');

var app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())

app.use('/', index);
app.use('/api/v1/users', users);
app.use('/api/v1/issues', issues);

module.exports = app;

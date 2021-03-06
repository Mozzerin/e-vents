var express = require('express'),
    fs = require('fs'),
    https = require("https"),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    methodOverride = require('method-override');


var libs = process.cwd() + '/libs/';
require(libs + 'auth/auth');
var config = require('./libs/config');
var log = require('./libs/log')(module);
var oauth2 = require('./libs/auth/oauth2');
var api = require('./libs/routes/api');
var users = require('./libs/routes/users');
var events = require('./libs/routes/events');


var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(methodOverride());
app.use(passport.initialize());

app.use('/', api);
app.use('/api', api);
app.use('/api/users', users);
app.use('/api/events', events);
app.use('/api/oauth/token', oauth2.token);

//Error handling
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404);
    log.debug('%s %d %s', req.method, res.statusCode, req.url);
    res.json({
        error: 'Not found'
    });
    return;
});

// error handlers
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    log.error('%s %d %s', req.method, res.statusCode, err.message);
    res.json({
        error: err.message
    });
    return;
});


var privateKey = fs.readFileSync('ssl/96189580-localhost.key');
var certificate = fs.readFileSync('ssl/96189580-localhost.cert');

var credentials = {key: privateKey, cert: certificate};

var httpsServer = https.createServer(credentials, app);

httpsServer.listen(config.get('port'), function () {
    log.info('Express server listening on port ' + config.get('port'));
});

module.exports = app;

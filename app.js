var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var log = require('./libs/log')(module);
var EventModel    = require('./libs/mongoose').EventModel;
var config = require('./libs/config');
var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);
app.use('/users', users);

app.get('/ErrorExample', function (req, res, next) {
    next(new Error('Random error!'));
});


app.get('/api/events', function(req, res) {
    return EventModel.find(function (err, events) {
        if (!err) {
            return res.send(events);
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
    });
});

app.post('/api/events', function(req, res) {
    var event = new EventModel({
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        images: req.body.images
    });

    event.save(function (err) {
        if (!err) {
            log.info("article created");
            return res.send({ status: 'OK', event:event });
        } else {
            console.log(err);
            if(err.name == 'ValidationError') {
                res.statusCode = 400;
                res.send({ error: 'Validation error' });
            } else {
                res.statusCode = 500;
                res.send({ error: 'Server error' });
            }
            log.error('Internal error(%d): %s',res.statusCode,err.message);
        }
    });
});

app.get('/api/events/:id', function(req, res) {
    return EventModel.findById(req.params.id, function (err, event) {
        if(!event) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        if (!err) {
            return res.send({ status: 'OK', event:event });
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
    });
});

app.put('/api/events/:id', function (req, res){
    return EventModel.findById(req.params.id, function (err, event) {
        if(!event) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        event.title = req.body.title;
        event.description = req.body.description;
        event.author = req.body.author;
        event.images = req.body.images;
        return event.save(function (err) {
            if (!err) {
                log.info("article updated");
                return res.send({ status: 'OK', event:event });
            } else {
                if(err.name == 'ValidationError') {
                    res.statusCode = 400;
                    res.send({ error: 'Validation error' });
                } else {
                    res.statusCode = 500;
                    res.send({ error: 'Server error' });
                }
                log.error('Internal error(%d): %s',res.statusCode,err.message);
            }
        });
    });
});

app.delete('/api/events/:id', function (req, res){
    return EventModel.findById(req.params.id, function (err, event) {
        if(!event) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        return event.remove(function (err) {
            if (!err) {
                log.info("article removed");
                return res.send({ status: 'OK' });
            } else {
                res.statusCode = 500;
                log.error('Internal error(%d): %s',res.statusCode,err.message);
                return res.send({ error: 'Server error' });
            }
        });
    });
});


//Error handling
app.use(function (req, res, next) {
    res.status(404);
    log.debug('Not found URL: %s', req.url);
    res.send({error: 'Not found'});
});

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    log.error('Internal error(%d): %s', res.statusCode, err.message);
    res.send({error: err.message});
});

app.listen(config.get('port'), function(){
    log.info('Express server listening on port ' + config.get('port'));
});

module.exports = app;

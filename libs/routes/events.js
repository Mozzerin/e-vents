var express = require('express');
var passport = require('passport');
var router = express.Router();

var libs = process.cwd() + '/libs/';
var log = require(libs + 'log')(module);
var db = require(libs + 'db/mongoose');
var Events = require(libs + 'model/events');

router.get('/', passport.authenticate('bearer', { session: false }), function(req, res) {

    Events.find(function (err, events) {
        if (!err) {
            return res.json(events);
        } else {
            res.statusCode = 500;

            log.error('Internal error(%d): %s',res.statusCode,err.message);

            return res.json({
                error: 'Server error'
            });
        }
    });
});

router.post('/', passport.authenticate('bearer', { session: false }), function(req, res) {

    var event = new Events({
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        images: req.body.images
    });

    event.save(function (err) {
        if (!err) {
            log.info("New article created with id: %s", event.id);
            return res.json({
                status: 'OK',
                article: event
            });
        } else {
            if(err.name === 'ValidationError') {
                res.statusCode = 400;
                res.json({
                    error: 'Validation error'
                });
            } else {
                res.statusCode = 500;

                log.error('Internal error(%d): %s', res.statusCode, err.message);

                res.json({
                    error: 'Server error'
                });
            }
        }
    });
});

router.get('/:id', passport.authenticate('bearer', { session: false }), function(req, res) {

    Events.findById(req.params.id, function (err, event) {

        if(!event) {
            res.statusCode = 404;

            return res.json({
                error: 'Not found'
            });
        }

        if (!err) {
            return res.json({
                status: 'OK',
                article: event
            });
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode,err.message);

            return res.json({
                error: 'Server error'
            });
        }
    });
});

router.put('/:id', passport.authenticate('bearer', { session: false }), function (req, res){
    var eventId = req.params.id;

    Events.findById(eventId, function (err, event) {
        if(!event) {
            res.statusCode = 404;
            log.error('Article with id: %s Not Found', eventId);
            return res.json({
                error: 'Not found'
            });
        }

        event.title = req.body.title;
        event.description = req.body.description;
        event.author = req.body.author;
        event.images = req.body.images;

        event.save(function (err) {
            if (!err) {
                log.info("Article with id: %s updated", event.id);
                return res.json({
                    status: 'OK',
                    article:event
                });
            } else {
                if(err.name === 'ValidationError') {
                    res.statusCode = 400;
                    return res.json({
                        error: 'Validation error'
                    });
                } else {
                    res.statusCode = 500;

                    return res.json({
                        error: 'Server error'
                    });
                }
                log.error('Internal error (%d): %s', res.statusCode, err.message);
            }
        });
    });
});

module.exports = router;

var express = require('express');
var passport = require('passport');
var router = express.Router();
var libs = process.cwd() + '/libs/';
var log = require(libs + 'log')(module);
var db = require(libs + 'db/mongoose');
var Article = require(libs + 'model/events');


router.get('/', function (req, res) {
    return EventModel.find(function (err, events) {
        if (!err) {
            return res.send(events);
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s', res.statusCode, err.message);
            return res.send({error: 'Server error'});
        }
    });
});

router.post('/', function (req, res) {
    var event = new EventModel({
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        images: req.body.images
    });

    event.save(function (err) {
        if (!err) {
            log.info("article created");
            return res.send({status: 'OK', event: event});
        } else {
            console.log(err);
            if (err.name == 'ValidationError') {
                res.statusCode = 400;
                res.send({error: 'Validation error'});
            } else {
                res.statusCode = 500;
                res.send({error: 'Server error'});
            }
            log.error('Internal error(%d): %s', res.statusCode, err.message);
        }
    });
});

router.get('/:id', function (req, res) {
    return EventModel.findById(req.params.id, function (err, event) {
        if (!event) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }
        if (!err) {
            return res.send({status: 'OK', event: event});
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s', res.statusCode, err.message);
            return res.send({error: 'Server error'});
        }
    });
});

router.put('/:id', function (req, res) {
    return EventModel.findById(req.params.id, function (err, event) {
        if (!event) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }

        event.title = req.body.title;
        event.description = req.body.description;
        event.author = req.body.author;
        event.images = req.body.images;
        return event.save(function (err) {
            if (!err) {
                log.info("article updated");
                return res.send({status: 'OK', event: event});
            } else {
                if (err.name == 'ValidationError') {
                    res.statusCode = 400;
                    res.send({error: 'Validation error'});
                } else {
                    res.statusCode = 500;
                    res.send({error: 'Server error'});
                }
                log.error('Internal error(%d): %s', res.statusCode, err.message);
            }
        });
    });
});

router.delete('/:id', function (req, res) {
    return EventModel.findById(req.params.id, function (err, event) {
        if (!event) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }
        return event.remove(function (err) {
            if (!err) {
                log.info("article removed");
                return res.send({status: 'OK'});
            } else {
                res.statusCode = 500;
                log.error('Internal error(%d): %s', res.statusCode, err.message);
                return res.send({error: 'Server error'});
            }
        });
    });
});

module.exports = router;

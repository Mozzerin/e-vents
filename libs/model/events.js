/**
 * Created by Mozzerin on 03.01.2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schemas
var Images = new Schema({
    kind: {
        type: String,
        enum: ['thumbnail', 'detail'],
        required: true
    },
    url: { type: String, required: true }
});

var Event = new Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String, required: true },
    images: [Images],
    modified: { type: Date, default: Date.now }
});

// validation
Event.path('title').validate(function (v) {
    return v.length > 5 && v.length < 70;
});


module.exports = mongoose.model('Event', Event);
/**
 * Created by Mozzerin on 03.01.2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// AccessToken
var AccessToken = new Schema({
    userId: {
        type: String,
        required: true
    },

    clientId: {
        type: String,
        required: true
    },

    token: {
        type: String,
        unique: true,
        required: true
    },

    created: {
        type: Date,
        default: Date.now
    }
});

var AccessToken = mongoose.model('AccessToken', AccessToken);

module.exports = AccessToken;
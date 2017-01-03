/**
 * Created by Mozzerin on 03.01.2017.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,

    RefreshToken = new Schema({
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

var RefreshToken = mongoose.model('RefreshToken', RefreshToken);
module.exports = RefreshToken;
/**
 * Created by Mozzerin on 29.12.2016.
 */
var nconf = require('nconf');

nconf.argv()
    .env()
    .file({ file: './config.json' });

module.exports = nconf;
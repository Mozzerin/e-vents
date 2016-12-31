/**
 * Created by Mozzerin on 29.12.2016.
 */
var winston = require('winston');
require('winston-daily-rotate-file');

function getLogger(module) {
    var path = module.filename.split('/').slice(-2).join('/'); //отобразим метку с именем файла, который выводит сообщение

    return new winston.Logger({
        transports : [
            new winston.transports.Console({
                colorize:   true,
                level:      'debug',
                label:      path
            }),
            new winston.transports.DailyRotateFile({
                filename: '../e-events_api.log',
                datePattern: 'yyyy-MM-dd.',
                prepend: true,
                level: 'debug'
            })
        ]
    });
}

module.exports = getLogger;
/*jslint node: true */
'use strict';


/**
 * Module dependencies.
 */
var config = require('../config/config'),
    chalk = require('chalk'),
    mongooseService = require ('./mongoose'),
    express = require ('./express'); 
    
module.exports.init = function init(callback) {
  
    mongooseService.connect (function(){

        mongooseService.loadModels();

        // Initialize express
        var app = express.init();

        if (callback) callback(app, config);
    });
}; 
  
module.exports.start = function start(callback) {
    var me = this;

    me.init(function (app, config) {

        // Start the app by listening on <port> at <host>
        app.listen(config.port, config.host, function () {

            var host = (config.host ==='0.0.0.0') ? 'localhost' : config.host,
                serverUrl = (process.env.NODE_ENV === 'secure' ? 'https://' : 'http://') + host + ':' + config.port;

            // Logging initialization
            console.log();
            console.log();
            console.log();
            console.log('----------------------------------------------');
            console.log(chalk.green.bold(config.app.title));
            console.log();
            console.log(chalk.green('Environment:     ' + process.env.NODE_ENV));
            console.log(chalk.green('Server:          ' + serverUrl));
            console.log(chalk.green('Database:        ' + config.db.uri));
            console.log(chalk.blue('Waiting for requests...'));
            console.log('----------------------------------------------');

            if (callback) callback(app, config);
        });
    });
};
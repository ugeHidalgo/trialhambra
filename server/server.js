/*jslint node: true */
'use strict';

/**
 * Module dependencies.
 */
var config = require('./config/config'),
    app = require('./src/app'),
    server;

// Set NODE_ENV to 'development' for a while only, needs to be added to a gulp task(see meanjs).
process.env.NODE_ENV = 'development';

server = app.start();

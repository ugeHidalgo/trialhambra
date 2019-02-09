/*jslint node: true */
'use strict';

/**
 * Module dependencies.
 */
var config = require('../../config/config');


module.exports.init = function (app) {

    //Main page
    app.get('/', function (request, res){
        res.render ('index', { title: config.app.title });
    });

    console.log('Home controller initialized');
};
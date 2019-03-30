/*jslint node: true */
'use strict';

/**
 * Module dependencies.
 */
var config = require('../../config/config'),
    nodemailer = require('nodemailer'),
    smtpTransport = require('nodemailer-smtp-transport'),
    userManager = require('../managers/userManager'),
    auth = require ('../auth/authMiddleware'),

    transporter = nodemailer.createTransport(smtpTransport({
        service: config.recoveryMail.service,
        host: config.recoveryMail.host,
        port: config.recoveryMail.port,
        secure: config.recoveryMail.secure,
        auth: {
            user: config.recoveryMail.user,
            pass: config.recoveryMail.pass
        }
    })),

    mailOptions = {
        from: config.recoveryMail.user,
        to: 'ugehidalgo@gmail.com',
        subject: config.recoveryMail.subject,
        text: 'That was easy!'
    };

/**
 * Public methods.
 */
module.exports.init = function (app) {

    // Send a password recovery mail to the user.
    // (POST)http:localhost:3000/api/user/userrecover body: {firstName: 'a name', username:'ugeHidalgo', ...}
    app.post('/api/user/userrecover', function(request, response, next){

        var userToRecover =  request.body.username;

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
              response.status(400).send(false);
            } else {
              console.log('Email sent to : ' + userToRecover + '. Info:' + info.response);
              response.set('Content-Type','text/html');
              response.status(201).send(true);
            }
          });
    });

    // Updates an user password.
    // (POST)http:localhost:3000/api/username body: {password: 'kahdakjsh'}
    app.post('/api/user/:username', function(request, response, next){

        var username = request.params.username,
            password =  request.body.password;

        userManager.updateUserPassword (username, password, function(error){
                if (error){
                    console.log('Failed to update username password: ' + error);
                    response.status(400).send(false);
                } else {
                    response.set('Content-Type','application/json');
                    response.status(201).send(true);
                }
            });
    });

    // Register a new user.
    // (POST)http:localhost:3000/api/user body: {firstName: 'a name', username:'ugeHidalgo', ...}
    app.post('/api/user', function(request, response, next){

        var userToUpdate =  request.body;

        userManager.updateUser ( userToUpdate, function(error, updatedUser){
             if (error){
                response.status(400).send('Failed to save user: ' + error);
            } else {
                response.set('Content-Type','application/json');
                response.status(201).send(updatedUser);
             }
        });
    });

    // Verify if an user can access
    // (POST)http:localhost:3000/api/auth body: {username: 'a user name', password:'a password'}
    app.post('/api/auth', function(req, res, next){

        var userData =  req.body;

        auth.authenticateUser ( userData, function(error, loginResult){
             if (error){
                res.status(400).send(loginResult.message + loginResult.userName);
            } else {
                if (loginResult.success) {
                    res.set('Content-Type','application/json');
                    res.status(201).send(loginResult);
                }
                else {
                    res.status(401).send(loginResult.message);
                }
             }
        });
    });

    console.log('Auth controller initialized');
};
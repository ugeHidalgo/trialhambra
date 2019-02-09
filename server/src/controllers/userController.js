/*jslint node: true */
'use strict';

/**
 * Module dependencies.
 */
var url = require ('url'),
    userManager = require('../managers/userManager'),
    auth = require ('../auth/authMiddleware');

/**
 * Public methods.
 */
module.exports.init = function (app) {
    app.get ('/api/user/:username', auth.isUserAuthenticated, function (req, res, next) {
        // (GET)http:localhost:3000/api/user/ugeHidalgo
        var id = req.params.id,
            msg;

        userManager.getUserByUserName ( userName, function(error, users){
            if (error){
                console.log('User controller returns an error (400)');
                res.status(400).send(error);
            } else {
                res.set('Content-Type','application/json');
                if (users.length === 0 ) {
                    msg = `No user found with user name: ${userName}`;
                    console.log(msg);
                    res.status(200).send([msg]);
                } else {
                    console.log(`User controller returns user ${userName} successfully.`);
                    res.send(user[0]);
                }
            }
        });
    });

    app.get ('/api/user', auth.isUserAuthenticated, function (req, res, next) {
        // By name: (GET)http:localhost:3000/api/user/?username=ugeHidalgo
        // By Id: (GET)http:localhost:3000/api/user/?id=5a78a8fe458a4c457a3b4969
        var queryString = url.parse(req.url, true).query,
            username = queryString.username,
            id = queryString.id,
            msg;

        if (username) {
            userManager.getUserByExactUserName ( username, function(error, users){
                if (error){
                    console.log('User controller returns an error (400)');
                    res.status(400).send(error);
                } else {
                    res.set('Content-Type','application/json');
                    if (users.length === 0 ) {
                        msg = `No users found with user name: ${username}`;
                        console.log(msg);
                        res.status(200).send([msg]);
                    } else {
                        console.log(`User controller returns user ${username} successfully.`);
                        users[0].password = '';
                        users[0].salt = '';
                        res.status(200).send(users[0]);
                    }
                }
            });
        }

        if (id) {
            userManager.getUserById ( id, function(error, users){
                if (error){
                    console.log('Users controller returns an error (400)');
                    res.status(400).send(error);
                } else {
                    res.set('Content-Type','application/json');
                    if (users.length === 0 ) {
                        msg = `No user found with id: ${id}`;
                        console.log(msg);
                        res.status(200).send([msg]);
                    } else {
                        console.log(`User controller returns user with ${id} successfully.`);
                        user[0].password = '';
                        user[0].salt = '';
                        res.send(user[0]);
                    }
                }
            });
        }
    });

    console.log('User controller initialized');
};

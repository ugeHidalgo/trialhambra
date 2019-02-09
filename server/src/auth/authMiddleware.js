/*jslint node: true */
'use strict';

/**
 * Module dependencies.
 */
var jwt = require('jsonwebtoken'),
    config = require ('../../config/config'),
    hasher = require ('../auth/hasher'),
    userManager = require('../managers/userManager');

/**
 * Public methods.
 */

/**
 * Function used to verify if an user was succesfully authenticathed.
 */
module.exports.isUserAuthenticated = function (req, res, next) {
    const token = req.body.token || req.query.token || req.headers['authorization-token']

    if (token) {
        jwt.verify(token, config.sessionSecret, function (err, decoded) {
            if (err){
                return res.status(401).send({message: err.message});
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(403).send({message: 'no token provided'});
    }
};

/**
 * Function used to athenticate an existing user providing him with a valid JSON web token.
 * @param {object} receivedUser An object containing the username and password to log in.
 * @param {function} callbackFn
 */
module.exports.authenticateUser = function( receivedUser, callbackFn) {

    userManager.getUserByExactUserName(receivedUser.userName, function (err, userInDb) {
        var receivedHashedPassword,
            storedHashedPassword,
            userInDb,
            notFoundUser = { success: false, message: 'User ' + receivedUser.userName + ' not found.'},
            notValidPassword = { success: false, message: 'Incorrect password for username: ' + receivedUser.userName };

        if (err) { return callbackFn(err); }
        if (!userInDb || userInDb.length === 0) { return callbackFn(null, notFoundUser); }

        userInDb = userInDb[0];
        receivedHashedPassword = hasher.computeHash(receivedUser.password, userInDb.salt);
        storedHashedPassword = userInDb.password;

        if (receivedHashedPassword !== storedHashedPassword) {
                return callbackFn (null, notValidPassword);
        }

        return callbackFn (null, createResposeWithJsonWebToken(userInDb.username));
    });
}

/**
 * Private methods.
 */
function createResposeWithJsonWebToken(userName){
    var secret = config.sessionSecret,
        expiresIn = config.sessionJsonWebTokenExpires,
        payload = { userName: userName },
        token = jwt.sign( payload, secret, { expiresIn: expiresIn });

    return { success: true, message: 'Successfully logged.', token: token}
}
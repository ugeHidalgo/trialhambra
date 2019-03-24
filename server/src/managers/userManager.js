/*jslint node: true */
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require ('mongoose'),
    hasher = require ('../auth/hasher'),
    User = require ('../models/user');

/**
 * Public methods.
 */
module.exports.getUserById = function (id, callbackFn) {

    User.find({_id: id}, callbackFn);
};

module.exports.getUserByExactUserName = function (userName, callbackFn) {

    User.find({username: userName}, callbackFn);
};

module.exports.getUserByUserName = function (userName, callbackFn) {

    var regexString = `/${userName}/`;
    User.find({username: new RegExp(userName, 'i')}, callbackFn);
};

module.exports.updateUser = function (user, callbackFn) {

    if (user._id) {
        updateExistingUser (user, callbackFn)
    } else {
        createNewUser(user, callbackFn);
    }
};

module.exports.updateUserPassword = function (username, password, callbackFn) {

    var salt = hasher.createSalt(),
        updatedValues = {
            password: hasher.computeHash(password, salt),
            salt: salt
         };

    User.findOneAndUpdate(
    {username: username},
    { $set: updatedValues },
    function (error){
        if (error){
            callbackFn(error, false);
        } else {
            console.log ('Password updated for username ' + username);
            callbackFn(null, true)
        }
    });
};


/**
 * Private methods.
 */
function createNewUser (user, callbackFn){

    User.find({username: user.username},(error, data) => {
        if (data.length > 0) {
            callbackFn('User ' + user.username + ' already exists.', user);
        } else {
            var newUser = new User(user),
            salt = hasher.createSalt();

            newUser.password = hasher.computeHash(user.password, salt);
            newUser.salt = salt;

            newUser.save(function (error) {
                if (error) {
                    callbackFn(error, null);
                } else {
                    console.log ('New user saved with username ' + newUser.username + ' and id: ' + newUser._id);
                    callbackFn(null, newUser);
                }
            });
        }
    });
};

function updateExistingUser (user, callbackFn) {

    var salt = hasher.createSalt(),
        updatedValues = {
        firstName: user.firstName,
        lastName: user.lastName,
        eMail: user.eMail,
        active: user.active,
        admin: user.admin,
        birthDate: user.birthDate,
        updated: new Date(),
        phone: user.phone,
        mobile: user.mobile
    };

    if (user.password !== ''){
        updatedValues.password = hasher.computeHash(user.password, salt);
        updatedValues.salt = salt;
    }

    User.findOneAndUpdate(
    {_id: user._id},
    { $set: updatedValues },
    function (error){
        if (error){
            callbackFn(error, null);
        } else {
            console.log ('User data updated for username ' + user.username + ' with id: ' + user._id);
            callbackFn(null, user)
        }
    });
};
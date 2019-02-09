/*jslint node: true */
'use strict';

/**
 * Module dependencies.
 */
var crypto = require('crypto');  //Build into node


module.exports.createSalt = function () {
    var len = 8;
    return crypto.randomBytes(Math.ceil(len/2)).toString('hex').substring(0,len);
};

module.exports.computeHash = function (sourceString, salt) {
    var hmac = crypto.createHmac('sha1', salt),
        hash = hmac.update(sourceString);
    
    return hash.digest('hex');
};

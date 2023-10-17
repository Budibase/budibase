'use strict';

var server = require('./_http_server');

exports.IncomingMessage = require('./_http_incoming').IncomingMessage;
exports.STATUS_CODES = server.STATUS_CODES;

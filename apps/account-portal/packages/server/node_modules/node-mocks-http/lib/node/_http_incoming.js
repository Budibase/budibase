'use strict';

var util = require('util');
var Stream = require('stream');

function readStart() {}
exports.readStart = readStart;

function readStop() {}
exports.readStop = readStop;


function IncomingMessage() {
    Stream.Readable.call(this);

    this.httpVersionMajor = null;
    this.httpVersionMinor = null;
    this.httpVersion = null;
    this.complete = false;
    this.headers = {};
    this.rawHeaders = [];
    this.trailers = {};
    this.rawTrailers = [];

    this.readable = true;

    this._pendings = [];
    this._pendingIndex = 0;
    this.upgrade = null;

    this.url = '';
    this.method = null;

    this.statusCode = null;
    this.statusMessage = null;

    this._consuming = false;

    this._dumped = false;
}
util.inherits(IncomingMessage, Stream.Readable);

exports.IncomingMessage = IncomingMessage;

IncomingMessage.prototype.read = function() {};
IncomingMessage.prototype._read = function() {};
IncomingMessage.prototype.destroy = function() {};

IncomingMessage.prototype.setTimeout = function(msecs, callback) {
    if (callback) {
        setTimeout(callback, msecs);
    }
};

IncomingMessage.prototype._addHeaderLines = function(headers, n) {
    if (headers && headers.length) {
        var raw, dest;
        if (this.complete) {
            raw = this.rawTrailers;
            dest = this.trailers;
        } else {
            raw = this.rawHeaders;
            dest = this.headers;
        }

        for (var i = 0; i < n; i += 2) {
            var k = headers[i];
            var v = headers[i + 1];
            raw.push(k);
            raw.push(v);
            this._addHeaderLine(k, v, dest);
        }
    }
};

IncomingMessage.prototype._addHeaderLine = function(field, value, dest) {
    field = field.toLowerCase();
    switch (field) {
        // Array headers:
        case 'set-cookie':
            if (!util.isUndefined(dest[field])) {
                dest[field].push(value);
            } else {
                dest[field] = [value];
            }
            break;

        case 'content-type':
        case 'content-length':
        case 'user-agent':
        case 'referer':
        case 'host':
        case 'authorization':
        case 'proxy-authorization':
        case 'if-modified-since':
        case 'if-unmodified-since':
        case 'from':
        case 'location':
        case 'max-forwards':
            if (util.isUndefined(dest[field])) {
                dest[field] = value;
            }
            break;

        default:
            if (!util.isUndefined(dest[field])) {
                dest[field] += ', ' + value;
            } else {
                dest[field] = value;
            }
    }
};

IncomingMessage.prototype._dump = function() {
    if (!this._dumped) {
        this._dumped = true;
    }
};

'use strict';
var Writable = require('./writable');
var Readable = require('./readable');

exports.createReadStream = function (opts) {
  opts = opts || {};
  return new Readable(this, opts);
};
exports.createWriteStream = function (opts) {
  opts = opts || {};
  return new Writable(this, opts);
};
var ep = require('./eventProxy');
var streamEvents = [
  'drain',
  'pipe',
  'unpipe',
  'error'
];
exports.write = function (chunk, encoding, callback) {
  if (!this.__stream) {
    this.__stream = new Writable(this);
    ep(this, this.__stream, streamEvents);
    this.on('destroy', function () {
      this.__stream.end();
    });
  }
  return this.__stream.write(chunk, encoding, callback);
};
exports.end = function () {
  this.emit('done');
};

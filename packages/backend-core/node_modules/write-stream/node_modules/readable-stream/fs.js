'use strict';

module.exports = FSReadable;

// This uses the existing bindings in Node's FS module to
// implement a read-method style readable stream.

var Readable = require('./readable.js');
var util = require('util');
var fs = require('fs');
var StringDecoder = require('string_decoder').StringDecoder;
var assert = require('assert');

// a very basic memory pool.  this optimization helps revent lots
// of allocations when there are many fs readable streams happening
// concurrently.
var pool;
var minPoolSpace = 128;
var poolSize = 40 * 1024;
function allocNewPool() {
  pool = new Buffer(poolSize);
  pool.used = 0;
}

util.inherits(FSReadable, Readable);

function FSReadable(path, options) {
  if (!options)
    options = {};

  Readable.call(this, options);

  var state = this._readableState;
  this.path = path;
  this.flags = options.flags || 'r';
  this.mode = options.mode || 438; //=0666
  this.fd = options.fd || null;

  // a little bit bigger buffer and watermark by default
  state.bufferSize = options.bufferSize || 64 * 1024;
  state.lowWaterMark = options.lowWaterMark || 16 * 1024;

  if (this.encoding) {
    this._decoder = new StringDecoder(this.encoding);
  }

  var typeofStart = typeof this.start;
  if (typeofStart !== 'undefined') {
    if (typeofStart !== 'number')
      throw new TypeError('start must be a Number');

    var typeofEnd = typeof this.end;
    if (typeofEnd === 'undefined')
      this.end = Infinity;
    else if (typeofEnd !== 'number')
      throw new TypeError('end must be a Number');

    this.pos = this.start;
  }

  if (typeof this.fd !== 'number')
    this.open();
}

FSReadable.prototype.open = function() {
  fs.open(this.path, this.flags, this.mode, function(er, fd) {
    if (er) {
      this.destroy();
      this.emit('error', er);
      return;
    }

    this.fd = fd;
    this.emit('open', fd);
  }.bind(this));
};

FSReadable.prototype._read = function(n, cb) {
  if (this.fd === null) {
    this.once('open', this._read.bind(this, n, cb));
    return;
  }

  if (this.destroyed)
    return;

  if (!pool || pool.length - pool.used < minPoolSpace) {
    // discard the old pool. Can't add to the free list because
    // users might have refernces to slices on it.
    pool = null;
    allocNewPool();
  }

  var thisPool = pool;
  var toRead = Math.min(pool.length - pool.used, n);
  var start = pool.used;

  if (this.pos !== undefined)
    toRead = Math.min(this.end - this.pos + 1, toRead);


  if (toRead <= 0) {
    this.emit('readable');
    return;
  }

  fs.read(this.fd, pool, pool.used, toRead, this.pos, onread.bind(this));

  function onread(er, bytesRead) {
    if (er) {
      this.destroy();
      return cb(er);
    }

    var b = null;
    if (bytesRead > 0)
      b = thisPool.slice(start, start + bytesRead);

    cb(null, b);
  }
};

FSReadable.prototype.close = function(cb) {
  if (cb)
    this.once('close', cb);
  if (this.closed || this.fd === null) {
    if (this.fd === null)
      this.once('open', this.destroy);
    return process.nextTick(this.emit.bind(this, 'close'));
  }
  this.closed = true;

  fs.close(this.fd, function(er) {
    if (er)
      this.emit('error', er);
    else
      this.emit('close');
  }.bind(this));
};

FSReadable.prototype.destroy = function() {
  this.destroyed = true;
  fs.close(this.fd, function() {});
};

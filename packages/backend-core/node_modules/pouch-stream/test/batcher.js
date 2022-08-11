'use strict';
var inherits = require('inherits');
var Transform = require('readable-stream').Transform;

module.exports = Batcher;
inherits(Batcher, Transform);

function Batcher(size) {
  if (!(this instanceof Batcher)) {
    return new Batcher(size);
  }
  Transform.call(this, {
    objectMode: true
  });
  this.size = size;
  this.queue = [];
}
Batcher.prototype._transform = function (chunk, _, next) {
  this.queue.push(chunk);
  if (chunk.length >= this.size) {
    this.push(this.queue);
    this.queue = [];
    next();
  } else {
    next();
  }
};

Batcher.prototype._flush = function (next) {
  if (this.queue.length) {
    this.push(this.queue);
  }
  next();
};

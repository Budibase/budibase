'use strict'

var AbstractLevelDOWN = require('abstract-leveldown').AbstractLevelDOWN
var AbstractChainedBatch = require('abstract-leveldown').AbstractChainedBatch
var AbstractIterator = require('abstract-leveldown').AbstractIterator
var inherits = require('inherits')
var Codec = require('level-codec')
var EncodingError = require('level-errors').EncodingError
var rangeMethods = ['approximateSize', 'compactRange']

module.exports = DB.default = DB

function DB (db, opts) {
  if (!(this instanceof DB)) return new DB(db, opts)

  var manifest = db.supports || {}
  var additionalMethods = manifest.additionalMethods || {}

  AbstractLevelDOWN.call(this, manifest)

  this.supports.encodings = true
  this.supports.additionalMethods = {}

  rangeMethods.forEach(function (m) {
    // TODO (future major): remove this fallback
    var fallback = typeof db[m] === 'function'

    if (additionalMethods[m] || fallback) {
      this.supports.additionalMethods[m] = true

      this[m] = function (start, end, opts, cb) {
        start = this.codec.encodeKey(start, opts)
        end = this.codec.encodeKey(end, opts)
        return this.db[m](start, end, opts, cb)
      }
    }
  }, this)

  opts = opts || {}
  if (typeof opts.keyEncoding === 'undefined') opts.keyEncoding = 'utf8'
  if (typeof opts.valueEncoding === 'undefined') opts.valueEncoding = 'utf8'

  this.db = db
  this.codec = new Codec(opts)
}

inherits(DB, AbstractLevelDOWN)

DB.prototype.type = 'encoding-down'

DB.prototype._serializeKey =
DB.prototype._serializeValue = function (datum) {
  return datum
}

DB.prototype._open = function (opts, cb) {
  this.db.open(opts, cb)
}

DB.prototype._close = function (cb) {
  this.db.close(cb)
}

DB.prototype._put = function (key, value, opts, cb) {
  key = this.codec.encodeKey(key, opts)
  value = this.codec.encodeValue(value, opts)
  this.db.put(key, value, opts, cb)
}

DB.prototype._get = function (key, opts, cb) {
  var self = this
  key = this.codec.encodeKey(key, opts)
  opts.asBuffer = this.codec.valueAsBuffer(opts)
  this.db.get(key, opts, function (err, value) {
    if (err) return cb(err)
    try {
      value = self.codec.decodeValue(value, opts)
    } catch (err) {
      return cb(new EncodingError(err))
    }
    cb(null, value)
  })
}

DB.prototype._del = function (key, opts, cb) {
  key = this.codec.encodeKey(key, opts)
  this.db.del(key, opts, cb)
}

DB.prototype._chainedBatch = function () {
  return new Batch(this)
}

DB.prototype._batch = function (ops, opts, cb) {
  ops = this.codec.encodeBatch(ops, opts)
  this.db.batch(ops, opts, cb)
}

DB.prototype._iterator = function (opts) {
  opts.keyAsBuffer = this.codec.keyAsBuffer(opts)
  opts.valueAsBuffer = this.codec.valueAsBuffer(opts)
  return new Iterator(this, opts)
}

DB.prototype._clear = function (opts, callback) {
  opts = this.codec.encodeLtgt(opts)
  this.db.clear(opts, callback)
}

function Iterator (db, opts) {
  AbstractIterator.call(this, db)
  this.codec = db.codec
  this.keys = opts.keys
  this.values = opts.values
  this.opts = this.codec.encodeLtgt(opts)
  this.it = db.db.iterator(this.opts)
}

inherits(Iterator, AbstractIterator)

Iterator.prototype._next = function (cb) {
  var self = this
  this.it.next(function (err, key, value) {
    if (err) return cb(err)
    try {
      if (self.keys && typeof key !== 'undefined') {
        key = self.codec.decodeKey(key, self.opts)
      } else {
        key = undefined
      }

      if (self.values && typeof value !== 'undefined') {
        value = self.codec.decodeValue(value, self.opts)
      } else {
        value = undefined
      }
    } catch (err) {
      return cb(new EncodingError(err))
    }
    cb(null, key, value)
  })
}

Iterator.prototype._seek = function (key) {
  key = this.codec.encodeKey(key, this.opts)
  this.it.seek(key)
}

Iterator.prototype._end = function (cb) {
  this.it.end(cb)
}

function Batch (db, codec) {
  AbstractChainedBatch.call(this, db)
  this.codec = db.codec
  this.batch = db.db.batch()
}

inherits(Batch, AbstractChainedBatch)

Batch.prototype._put = function (key, value) {
  key = this.codec.encodeKey(key)
  value = this.codec.encodeValue(value)
  this.batch.put(key, value)
}

Batch.prototype._del = function (key) {
  key = this.codec.encodeKey(key)
  this.batch.del(key)
}

Batch.prototype._clear = function () {
  this.batch.clear()
}

Batch.prototype._write = function (opts, cb) {
  this.batch.write(opts, cb)
}

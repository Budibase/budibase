var nextTick = require('./next-tick')

function AbstractChainedBatch (db) {
  if (typeof db !== 'object' || db === null) {
    throw new TypeError('First argument must be an abstract-leveldown compliant store')
  }

  this.db = db
  this._operations = []
  this._written = false
}

AbstractChainedBatch.prototype._checkWritten = function () {
  if (this._written) {
    throw new Error('write() already called on this batch')
  }
}

AbstractChainedBatch.prototype.put = function (key, value) {
  this._checkWritten()

  var err = this.db._checkKey(key) || this.db._checkValue(value)
  if (err) throw err

  key = this.db._serializeKey(key)
  value = this.db._serializeValue(value)

  this._put(key, value)

  return this
}

AbstractChainedBatch.prototype._put = function (key, value) {
  this._operations.push({ type: 'put', key: key, value: value })
}

AbstractChainedBatch.prototype.del = function (key) {
  this._checkWritten()

  var err = this.db._checkKey(key)
  if (err) throw err

  key = this.db._serializeKey(key)
  this._del(key)

  return this
}

AbstractChainedBatch.prototype._del = function (key) {
  this._operations.push({ type: 'del', key: key })
}

AbstractChainedBatch.prototype.clear = function () {
  this._checkWritten()
  this._clear()

  return this
}

AbstractChainedBatch.prototype._clear = function () {
  this._operations = []
}

AbstractChainedBatch.prototype.write = function (options, callback) {
  this._checkWritten()

  if (typeof options === 'function') { callback = options }
  if (typeof callback !== 'function') {
    throw new Error('write() requires a callback argument')
  }
  if (typeof options !== 'object' || options === null) {
    options = {}
  }

  this._written = true
  this._write(options, callback)
}

AbstractChainedBatch.prototype._write = function (options, callback) {
  this.db._batch(this._operations, options, callback)
}

// Expose browser-compatible nextTick for dependents
AbstractChainedBatch.prototype._nextTick = nextTick

module.exports = AbstractChainedBatch

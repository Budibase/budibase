'use strict'

var inherits = require('inherits')
var AbstractIterator = require('abstract-leveldown').AbstractIterator
var createKeyRange = require('./util/key-range')
var deserialize = require('./util/deserialize')
var noop = function () {}

module.exports = Iterator

function Iterator (db, location, options) {
  AbstractIterator.call(this, db)

  this._limit = options.limit
  this._count = 0
  this._callback = null
  this._cache = []
  this._completed = false
  this._aborted = false
  this._error = null
  this._transaction = null

  this._keys = options.keys
  this._values = options.values
  this._keyAsBuffer = options.keyAsBuffer
  this._valueAsBuffer = options.valueAsBuffer

  if (this._limit === 0) {
    this._completed = true
    return
  }

  try {
    var keyRange = createKeyRange(options)
  } catch (e) {
    // The lower key is greater than the upper key.
    // IndexedDB throws an error, but we'll just return 0 results.
    this._completed = true
    return
  }

  this.createIterator(location, keyRange, options.reverse)
}

inherits(Iterator, AbstractIterator)

Iterator.prototype.createIterator = function (location, keyRange, reverse) {
  var self = this
  var transaction = this.db.db.transaction([location], 'readonly')
  var store = transaction.objectStore(location)
  var req = store.openCursor(keyRange, reverse ? 'prev' : 'next')

  req.onsuccess = function (ev) {
    var cursor = ev.target.result
    if (cursor) self.onItem(cursor)
  }

  this._transaction = transaction

  // If an error occurs (on the request), the transaction will abort.
  transaction.onabort = function () {
    self.onAbort(self._transaction.error || new Error('aborted by user'))
  }

  transaction.oncomplete = function () {
    self.onComplete()
  }
}

Iterator.prototype.onItem = function (cursor) {
  this._cache.push(cursor.key, cursor.value)

  if (this._limit <= 0 || ++this._count < this._limit) {
    cursor.continue()
  }

  this.maybeNext()
}

Iterator.prototype.onAbort = function (err) {
  this._aborted = true
  this._error = err
  this.maybeNext()
}

Iterator.prototype.onComplete = function () {
  this._completed = true
  this.maybeNext()
}

Iterator.prototype.maybeNext = function () {
  if (this._callback) {
    this._next(this._callback)
    this._callback = null
  }
}

Iterator.prototype._next = function (callback) {
  if (this._aborted) {
    // The error should be picked up by either next() or end().
    var err = this._error
    this._error = null
    this._nextTick(callback, err)
  } else if (this._cache.length > 0) {
    var key = this._cache.shift()
    var value = this._cache.shift()

    if (this._keys && key !== undefined) {
      key = this._deserializeKey(key, this._keyAsBuffer)
    } else {
      key = undefined
    }

    if (this._values && value !== undefined) {
      value = this._deserializeValue(value, this._valueAsBuffer)
    } else {
      value = undefined
    }

    this._nextTick(callback, null, key, value)
  } else if (this._completed) {
    this._nextTick(callback)
  } else {
    this._callback = callback
  }
}

// Exposed for the v4 to v5 upgrade utility
Iterator.prototype._deserializeKey = deserialize
Iterator.prototype._deserializeValue = deserialize

Iterator.prototype._end = function (callback) {
  if (this._aborted || this._completed) {
    return this._nextTick(callback, this._error)
  }

  // Don't advance the cursor anymore, and the transaction will complete
  // on its own in the next tick. This approach is much cleaner than calling
  // transaction.abort() with its unpredictable event order.
  this.onItem = noop
  this.onAbort = callback
  this.onComplete = callback
}

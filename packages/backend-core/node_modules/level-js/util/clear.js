'use strict'

module.exports = function clear (db, location, keyRange, options, callback) {
  if (options.limit === 0) return db._nextTick(callback)

  var transaction = db.db.transaction([location], 'readwrite')
  var store = transaction.objectStore(location)
  var count = 0

  transaction.oncomplete = function () {
    callback()
  }

  transaction.onabort = function () {
    callback(transaction.error || new Error('aborted by user'))
  }

  // A key cursor is faster (skips reading values) but not supported by IE
  var method = store.openKeyCursor ? 'openKeyCursor' : 'openCursor'
  var direction = options.reverse ? 'prev' : 'next'

  store[method](keyRange, direction).onsuccess = function (ev) {
    var cursor = ev.target.result

    if (cursor) {
      // Wait for a request to complete before continuing, saving CPU.
      store.delete(cursor.key).onsuccess = function () {
        if (options.limit <= 0 || ++count < options.limit) {
          cursor.continue()
        }
      }
    }
  }
}

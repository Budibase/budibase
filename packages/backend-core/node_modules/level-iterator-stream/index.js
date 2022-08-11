var inherits = require('inherits')
var Readable = require('readable-stream').Readable
var extend = require('xtend')

module.exports = ReadStream
inherits(ReadStream, Readable)

function ReadStream (iterator, options) {
  if (!(this instanceof ReadStream)) return new ReadStream(iterator, options)
  options = options || {}
  Readable.call(this, extend(options, {
    objectMode: true
  }))
  this._iterator = iterator
  this._options = options
  this.on('end', this.destroy.bind(this, null, null))
}

ReadStream.prototype._read = function () {
  var self = this
  var options = this._options
  if (this.destroyed) return

  this._iterator.next(function (err, key, value) {
    if (self.destroyed) return
    if (err) return self.destroy(err)

    if (key === undefined && value === undefined) {
      self.push(null)
    } else if (options.keys !== false && options.values === false) {
      self.push(key)
    } else if (options.keys === false && options.values !== false) {
      self.push(value)
    } else {
      self.push({ key: key, value: value })
    }
  })
}

ReadStream.prototype._destroy = function (err, callback) {
  this._iterator.end(function (err2) {
    callback(err || err2)
  })
}

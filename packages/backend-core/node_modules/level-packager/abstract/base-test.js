'use strict'

var location = require('./location')

module.exports = function (test, level) {
  test('test db open and use, level(location, cb)', function (t) {
    level(location, function (err, db) {
      t.notOk(err, 'no error')
      db.put('test1', 'success', function (err) {
        t.notOk(err, 'no error')
        db.close(t.end.bind(t))
      })
    })
  })

  test('test db open and use, level(location, options, cb)', function (t) {
    level(location, { createIfMissing: false, errorIfExists: false }, function (err, db) {
      t.notOk(err, 'no error')
      db.put('test2', 'success', function (err) {
        t.notOk(err, 'no error')
        db.close(t.end.bind(t))
      })
    })
  })

  test('test db open and use, db=level(location)', function (t) {
    var db = level(location)
    db.put('test3', 'success', function (err) {
      t.notOk(err, 'no error')
      db.close(t.end.bind(t))
    })
  })

  test('options.keyEncoding and options.valueEncoding are passed on to encoding-down', function (t) {
    var db = level(location, { keyEncoding: 'json', valueEncoding: 'json' })
    db.on('ready', function () {
      var codec = db.db.codec
      t.equal(codec.opts.keyEncoding, 'json', 'keyEncoding correct')
      t.equal(codec.opts.valueEncoding, 'json', 'valueEncoding correct')
      db.close(t.end.bind(t))
    })
  })

  test('encoding options default to utf8', function (t) {
    var db = level(location)
    db.on('ready', function () {
      var codec = db.db.codec
      t.equal(codec.opts.keyEncoding, 'utf8', 'keyEncoding correct')
      t.equal(codec.opts.valueEncoding, 'utf8', 'valueEncoding correct')
      db.close(t.end.bind(t))
    })
  })
}

'use strict'

// Promise polyfill for IE and others.
if (typeof Promise !== 'function') {
  global.Promise = require('pinkie')
}

var test = require('tape')
var uuid = require('uuid/v4')
var level = require('.')

require('level-packager/abstract/base-test')(test, level)
require('level-packager/abstract/db-values-test')(test, level)

function factory (opts) {
  return level(uuid(), opts)
}

test('level put', function (t) {
  t.plan(4)

  var db = factory()

  db.put('name', 'level', function (err) {
    t.ifError(err, 'no put error')

    db.get('name', function (err, value) {
      t.ifError(err, 'no get error')
      t.is(value, 'level')

      db.close(function (err) {
        t.ifError(err, 'no close error')
      })
    })
  })
})

test('level Buffer value', function (t) {
  t.plan(5)

  var db = factory({ valueEncoding: 'binary' })
  var buf = Buffer.from('00ff', 'hex')

  db.put('binary', buf, function (err) {
    t.ifError(err, 'no put error')

    db.get('binary', function (err, value) {
      t.ifError(err, 'no get error')
      t.ok(Buffer.isBuffer(value), 'is a buffer')
      t.same(value, buf)

      db.close(function (err) {
        t.ifError(err, 'no close error')
      })
    })
  })
})

test('level Buffer key', function (t) {
  var db = factory({ keyEncoding: 'binary' })
  var key = Buffer.from('00ff', 'hex')

  if (!db.supports.bufferKeys) {
    t.pass('Environment does not support buffer keys')
    return t.end()
  }

  db.put(key, 'value', function (err) {
    t.ifError(err, 'no put error')

    db.get(key, function (err, value) {
      t.ifError(err, 'no get error')
      t.is(value, 'value')

      db.close(function (err) {
        t.ifError(err, 'no close error')
        t.end()
      })
    })
  })
})

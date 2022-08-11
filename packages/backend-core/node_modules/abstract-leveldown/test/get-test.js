var db
var verifyNotFoundError = require('./util').verifyNotFoundError
var isTypedArray = require('./util').isTypedArray

exports.setUp = function (test, testCommon) {
  test('setUp common', testCommon.setUp)
  test('setUp db', function (t) {
    db = testCommon.factory()
    db.open(t.end.bind(t))
  })
}

exports.args = function (test, testCommon) {
  test('test argument-less get() throws', function (t) {
    t.throws(
      db.get.bind(db),
      /Error: get\(\) requires a callback argument/,
      'no-arg get() throws'
    )
    t.end()
  })

  test('test callback-less, 1-arg, get() throws', function (t) {
    t.throws(
      db.get.bind(db, 'foo'),
      /Error: get\(\) requires a callback argument/,
      'callback-less, 1-arg get() throws'
    )
    t.end()
  })

  test('test callback-less, 3-arg, get() throws', function (t) {
    t.throws(
      db.get.bind(db, 'foo', {}),
      /Error: get\(\) requires a callback argument/,
      'callback-less, 2-arg get() throws'
    )
    t.end()
  })

  test('test custom _serialize*', function (t) {
    t.plan(3)
    var db = testCommon.factory()
    db._serializeKey = function (data) { return data }
    db._get = function (key, options, callback) {
      t.deepEqual(key, { foo: 'bar' })
      process.nextTick(callback)
    }
    db.open(function () {
      db.get({ foo: 'bar' }, function (err) {
        t.error(err)
        db.close(t.error.bind(t))
      })
    })
  })
}

exports.get = function (test, testCommon) {
  test('test simple get()', function (t) {
    db.put('foo', 'bar', function (err) {
      t.error(err)
      db.get('foo', function (err, value) {
        t.error(err)
        t.ok(typeof value !== 'string', 'should not be string by default')

        var result
        if (isTypedArray(value)) {
          result = String.fromCharCode.apply(null, new Uint16Array(value))
        } else {
          t.ok(typeof Buffer !== 'undefined' && value instanceof Buffer)
          try {
            result = value.toString()
          } catch (e) {
            t.error(e, 'should not throw when converting value to a string')
          }
        }

        t.equal(result, 'bar')

        db.get('foo', {}, function (err, value) { // same but with {}
          t.error(err)
          t.ok(typeof value !== 'string', 'should not be string by default')

          var result
          if (isTypedArray(value)) {
            result = String.fromCharCode.apply(null, new Uint16Array(value))
          } else {
            t.ok(typeof Buffer !== 'undefined' && value instanceof Buffer)
            try {
              result = value.toString()
            } catch (e) {
              t.error(e, 'should not throw when converting value to a string')
            }
          }

          t.equal(result, 'bar')

          db.get('foo', { asBuffer: false }, function (err, value) {
            t.error(err)
            t.ok(typeof value === 'string', 'should be string if not buffer')
            t.equal(value, 'bar')
            t.end()
          })
        })
      })
    })
  })

  test('test simultaniously get()', function (t) {
    db.put('hello', 'world', function (err) {
      t.error(err)
      var r = 0
      var done = function () {
        if (++r === 20) { t.end() }
      }
      var i = 0
      var j = 0

      for (; i < 10; ++i) {
        db.get('hello', function (err, value) {
          t.error(err)
          t.equal(value.toString(), 'world')
          done()
        })
      }

      for (; j < 10; ++j) {
        db.get('not found', function (err, value) {
          t.ok(err, 'should error')
          t.ok(verifyNotFoundError(err), 'should have correct error message')
          t.ok(typeof value === 'undefined', 'value is undefined')
          done()
        })
      }
    })
  })

  test('test get() not found error is asynchronous', function (t) {
    t.plan(5)

    db.put('hello', 'world', function (err) {
      t.error(err)

      var async = false

      db.get('not found', function (err, value) {
        t.ok(err, 'should error')
        t.ok(verifyNotFoundError(err), 'should have correct error message')
        t.ok(typeof value === 'undefined', 'value is undefined')
        t.ok(async, 'callback is asynchronous')
      })

      async = true
    })
  })
}

exports.tearDown = function (test, testCommon) {
  test('tearDown', function (t) {
    db.close(testCommon.tearDown.bind(null, t))
  })
}

exports.all = function (test, testCommon) {
  exports.setUp(test, testCommon)
  exports.args(test, testCommon)
  exports.get(test, testCommon)
  exports.tearDown(test, testCommon)
}

var db
var isTypedArray = require('./util').isTypedArray

exports.setUp = function (test, testCommon) {
  test('setUp common', testCommon.setUp)
  test('setUp db', function (t) {
    db = testCommon.factory()
    db.open(t.end.bind(t))
  })
}

exports.args = function (test, testCommon) {
  testCommon.promises || test('test argument-less put() throws', function (t) {
    t.throws(
      db.put.bind(db),
      /Error: put\(\) requires a callback argument/,
      'no-arg put() throws'
    )
    t.end()
  })

  testCommon.promises || test('test callback-less, 1-arg, put() throws', function (t) {
    t.throws(
      db.put.bind(db, 'foo'),
      /Error: put\(\) requires a callback argument/,
      'callback-less, 1-arg put() throws'
    )
    t.end()
  })

  testCommon.promises || test('test callback-less, 2-arg, put() throws', function (t) {
    t.throws(
      db.put.bind(db, 'foo', 'bar'),
      /Error: put\(\) requires a callback argument/,
      'callback-less, 2-arg put() throws'
    )
    t.end()
  })

  testCommon.promises || test('test callback-less, 3-arg, put() throws', function (t) {
    t.throws(
      db.put.bind(db, 'foo', 'bar', {}),
      /Error: put\(\) requires a callback argument/,
      'callback-less, 3-arg put() throws'
    )
    t.end()
  })

  testCommon.serialize && test('test _serialize object', function (t) {
    t.plan(3)
    var db = testCommon.factory()
    db._put = function (key, value, opts, callback) {
      t.ok(key)
      t.ok(value)
      process.nextTick(callback)
    }
    db.put({}, {}, function (err, val) {
      t.error(err)
    })
  })

  testCommon.serialize && test('test custom _serialize*', function (t) {
    t.plan(4)
    var db = testCommon.factory()
    db._serializeKey = db._serializeValue = function (data) { return data }
    db._put = function (key, value, options, callback) {
      t.deepEqual(key, { foo: 'bar' })
      t.deepEqual(value, { beep: 'boop' })
      process.nextTick(callback)
    }
    db.open(function () {
      db.put({ foo: 'bar' }, { beep: 'boop' }, function (err) {
        t.error(err)
        db.close(t.error.bind(t))
      })
    })
  })
}

exports.put = function (test, testCommon) {
  test('test simple put()', function (t) {
    db.put('foo', 'bar', function (err) {
      t.error(err)
      db.get('foo', function (err, value) {
        t.error(err)
        var result = value.toString()
        if (isTypedArray(value)) {
          result = String.fromCharCode.apply(null, new Uint16Array(value))
        }
        t.equal(result, 'bar')
        t.end()
      })
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
  exports.put(test, testCommon)
  exports.tearDown(test, testCommon)
}

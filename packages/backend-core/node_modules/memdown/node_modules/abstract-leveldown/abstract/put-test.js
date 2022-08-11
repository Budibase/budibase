var db
  , leveldown
  , testCommon
  , verifyNotFoundError = require('./util').verifyNotFoundError
  , isTypedArray        = require('./util').isTypedArray

module.exports.setUp = function (_leveldown, test, _testCommon) {
  test('setUp common', _testCommon.setUp)
  test('setUp db', function (t) {
    leveldown = _leveldown
    testCommon = _testCommon
    db = leveldown(testCommon.location())
    db.open(t.end.bind(t))
  })
}

module.exports.args = function (test) {
  test('test argument-less put() throws', function (t) {
    t.throws(
        db.put.bind(db)
      , { name: 'Error', message: 'put() requires a callback argument' }
      , 'no-arg put() throws'
    )
    t.end()
  })

  test('test callback-less, 1-arg, put() throws', function (t) {
    t.throws(
        db.put.bind(db, 'foo')
      , { name: 'Error', message: 'put() requires a callback argument' }
      , 'callback-less, 1-arg put() throws'
    )
    t.end()
  })

  test('test callback-less, 2-arg, put() throws', function (t) {
    t.throws(
        db.put.bind(db, 'foo', 'bar')
      , { name: 'Error', message: 'put() requires a callback argument' }
      , 'callback-less, 2-arg put() throws'
    )
    t.end()
  })

  test('test callback-less, 3-arg, put() throws', function (t) {
    t.throws(
        db.put.bind(db, 'foo', 'bar', {})
      , { name: 'Error', message: 'put() requires a callback argument' }
      , 'callback-less, 3-arg put() throws'
    )
    t.end()
  })

  test('test _serialize object', function (t) {
    t.plan(3)
    var db = leveldown(testCommon.location())
    db._put = function (key, value, opts, callback) {
      t.ok(key)
      t.ok(value)
      callback()
    }
    db.put({}, {}, function (err, val) {
      t.error(err)
    })
  })

  test('test _serialize buffer', function (t) {
    t.plan(3)
    var db = leveldown(testCommon.location())
    db._put = function (key, value, opts, callback) {
      t.same(key, Buffer('key'))
      t.same(value, Buffer('value'))
      callback()
    }
    db.put(Buffer('key'), Buffer('value'), function (err, val) {
      t.error(err)
    })
  })

  test('test custom _serialize*', function (t) {
    t.plan(3)
    var db = leveldown(testCommon.location())
    db._serializeKey = db._serializeValue = function (data) { return data }
    db._put = function (key, value, options, callback) {
      t.deepEqual(key, { foo: 'bar' })
      t.deepEqual(value, { beep: 'boop' })
      callback()
    }
    db.open(function () {
      db.put({ foo: 'bar' }, { beep: 'boop'}, function (err) {
        t.error(err)
      })
    })
  })
}

module.exports.put = function (test) {
  test('test simple put()', function (t) {
    db.put('foo', 'bar', function (err) {
      t.error(err)
      db.get('foo', function (err, value) {
        t.error(err)
        var result = value.toString()
        if (isTypedArray(value))
          result = String.fromCharCode.apply(null, new Uint16Array(value))
        t.equal(result, 'bar')
        t.end()
      })
    })
  })
  
  if (process.browser) {
    test('test object value put()', function (t) {
      db.put('dood', {pete: 'sampras'}, function (err) {
        t.error(err)
        db.get('dood', { asBuffer: false }, function (err, value) {
          t.error(err)
          t.equal(JSON.stringify(value), JSON.stringify({pete: 'sampras'}))
          t.end()
        })
      })
    })
  }

}

module.exports.sync = function (test) {
  test('sync put', function (t) {
    db.put('foo', 'bar', { sync: true }, function (err) {
      t.error(err)
      db.get('foo', function (err, value) {
        t.error(err)
        t.equal(value.toString(), 'bar')
        t.end()
      })
    })
  })
  test('sync put just before close', function (t) {
    t.plan(2)
    db.put('foo', 'bar', { sync: true }, function (err) {
      t.error(err)
    })
    db.close(function (err) {
      t.error(err)
    })
  })
}

module.exports.tearDown = function (test, testCommon) {
  test('tearDown', function (t) {
    db.close(testCommon.tearDown.bind(null, t))
  })
}

module.exports.all = function (leveldown, test, testCommon) {
  module.exports.setUp(leveldown, test, testCommon)
  module.exports.args(test)
  module.exports.put(test)
  module.exports.tearDown(test, testCommon)
}

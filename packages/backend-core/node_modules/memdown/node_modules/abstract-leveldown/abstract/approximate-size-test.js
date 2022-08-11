var db
  , leveldown
  , testCommon

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
  test('test argument-less approximateSize() throws', function (t) {
    t.throws(
        db.approximateSize.bind(db)
      , { name: 'Error', message: 'approximateSize() requires valid `start`, `end` and `callback` arguments' }
      , 'no-arg approximateSize() throws'
    )
    t.end()
  })

  test('test callback-less, 1-arg, approximateSize() throws', function (t) {
    t.throws(
        db.approximateSize.bind(db, 'foo')
      , { name: 'Error', message: 'approximateSize() requires valid `start`, `end` and `callback` arguments' }
      , 'callback-less, 1-arg approximateSize() throws'
    )
    t.end()
  })

  test('test callback-less, 2-arg, approximateSize() throws', function (t) {
    t.throws(
        db.approximateSize.bind(db, 'foo', 'bar')
      , { name: 'Error', message: 'approximateSize() requires a callback argument' }
      , 'callback-less, 2-arg approximateSize() throws'
    )
    t.end()
  })

  test('test callback-less, 3-arg, approximateSize() throws', function (t) {
    t.throws(
        db.approximateSize.bind(db, function () {})
      , { name: 'Error', message: 'approximateSize() requires valid `start`, `end` and `callback` arguments' }
      , 'callback-only approximateSize() throws'
    )
    t.end()
  })

  test('test callback-only approximateSize() throws', function (t) {
    t.throws(
        db.approximateSize.bind(db, function () {})
      , { name: 'Error', message: 'approximateSize() requires valid `start`, `end` and `callback` arguments' }
      , 'callback-only approximateSize() throws'
    )
    t.end()
  })

  test('test 1-arg + callback approximateSize() throws', function (t) {
    t.throws(
        db.approximateSize.bind(db, 'foo', function () {})
      , { name: 'Error', message: 'approximateSize() requires valid `start`, `end` and `callback` arguments' }
      , '1-arg + callback approximateSize() throws'
    )
    t.end()
  })

  test('test _serialize object', function (t) {
    t.plan(3)
    var db = leveldown(testCommon.location())
    db._approximateSize = function (start, end, callback) {
      t.equal(Buffer.isBuffer(start) ? String(start) : start, '[object Object]')
      t.equal(Buffer.isBuffer(end) ? String(end) : end, '[object Object]')
      callback()
    }
    db.approximateSize({}, {}, function (err, val) {
      t.error(err)
    })
  })

  test('test _serialize buffer', function (t) {
    t.plan(3)
    var db = leveldown(testCommon.location())
    db._approximateSize = function (start, end, callback) {
      t.same(start, Buffer('start'))
      t.same(end, Buffer('end'))
      callback()
    }
    db.approximateSize(Buffer('start'), Buffer('end'), function (err, val) {
      t.error(err)
    })
  })

  test('test custom _serialize*', function (t) {
    t.plan(3)
    var db = leveldown(testCommon.location())
    db._serializeKey = function (data) { return data }
    db._approximateSize = function (start, end, callback) {
      t.deepEqual(start, { foo: 'bar' })
      t.deepEqual(end, { beep: 'boop' })
      callback()
    }
    db.open(function () {
      db.approximateSize({ foo: 'bar' }, { beep: 'boop' }, function (err) {
        t.error(err)
      })
    })
  })
}

module.exports.approximateSize = function (test) {
  test('test approximateSize()', function (t) {
    var data = Array.apply(null, Array(10000)).map(function () {
      return 'aaaaaaaaaa'
    }).join('')

    db.batch(
        Array.apply(null, Array(10)).map(function (x, i) {
          return { type: 'put', key: 'foo' + i, value: data }
        })
      , function (err) {
          t.error(err)

          // cycle open/close to ensure a pack to .sst

          db.close(function (err) {
            t.error(err)

            db.open(function (err) {
              t.error(err)

              db.approximateSize('!', '~', function (err, size) {
                t.error(err)

                t.equal(typeof size, 'number')
                t.ok(
                    size > 40000 // account for snappy compression
                                 // original would be ~100000
                  , 'size reports a reasonable amount (' + size + ')'
                )

                db.close(function (err) {
                  t.error(err)
                  t.end()
                })
              })
            })
          })
        }
    )
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
  module.exports.approximateSize(test)
  module.exports.tearDown(test, testCommon)
}

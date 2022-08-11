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
  test('test callback-less, 2-arg, batch() throws', function (t) {
    t.throws(
      db.batch.bind(db, 'foo', {}),
      /Error: batch\(array\) requires a callback argument/,
      'callback-less, 2-arg batch() throws'
    )
    t.end()
  })

  test('test batch() with missing `value`', function (t) {
    db.batch([{ type: 'put', key: 'foo1' }], function (err) {
      t.is(err.message, 'value cannot be `null` or `undefined`', 'correct error message')
      t.end()
    })
  })

  test('test batch() with null or undefined `value`', function (t) {
    var illegalValues = [null, undefined]

    t.plan(illegalValues.length)

    illegalValues.forEach(function (value) {
      db.batch([{ type: 'put', key: 'foo1', value: value }], function (err) {
        t.is(err.message, 'value cannot be `null` or `undefined`', 'correct error message')
      })
    })
  })

  test('test batch() with missing `key`', function (t) {
    var async = false

    db.batch([{ type: 'put', value: 'foo1' }], function (err) {
      t.ok(err, 'got error')
      t.equal(err.message, 'key cannot be `null` or `undefined`', 'correct error message')
      t.ok(async, 'callback is asynchronous')
      t.end()
    })

    async = true
  })

  test('test batch() with null or undefined `key`', function (t) {
    var illegalKeys = [null, undefined]

    t.plan(illegalKeys.length * 3)

    illegalKeys.forEach(function (key) {
      var async = false

      db.batch([{ type: 'put', key: key, value: 'foo1' }], function (err) {
        t.ok(err, 'got error')
        t.equal(err.message, 'key cannot be `null` or `undefined`', 'correct error message')
        t.ok(async, 'callback is asynchronous')
      })

      async = true
    })
  })

  test('test batch() with empty `key`', function (t) {
    var illegalKeys = [
      { type: 'String', key: '' },
      { type: 'Buffer', key: Buffer.alloc(0) },
      { type: 'Array', key: [] }
    ]

    t.plan(illegalKeys.length * 3)

    illegalKeys.forEach(function (item) {
      var async = false

      db.batch([{ type: 'put', key: item.key, value: 'foo1' }], function (err) {
        t.ok(err, 'got error')
        t.equal(err.message, 'key cannot be an empty ' + item.type, 'correct error message')
        t.ok(async, 'callback is asynchronous')
      })

      async = true
    })
  })

  test('test batch() with missing `key` and `value`', function (t) {
    var async = false

    db.batch([{ type: 'put' }], function (err) {
      t.ok(err, 'got error')
      t.equal(err.message, 'key cannot be `null` or `undefined`', 'correct error message')
      t.ok(async, 'callback is asynchronous')
      t.end()
    })

    async = true
  })

  test('test batch() with missing `type`', function (t) {
    var async = false

    db.batch([{ key: 'key', value: 'value' }], function (err) {
      t.ok(err, 'got error')
      t.equal(err.message, "`type` must be 'put' or 'del'", 'correct error message')
      t.ok(async, 'callback is asynchronous')
      t.end()
    })

    async = true
  })

  test('test batch() with wrong `type`', function (t) {
    var async = false

    db.batch([{ key: 'key', value: 'value', type: 'foo' }], function (err) {
      t.ok(err, 'got error')
      t.equal(err.message, "`type` must be 'put' or 'del'", 'correct error message')
      t.ok(async, 'callback is asynchronous')
      t.end()
    })

    async = true
  })

  test('test batch() with missing array', function (t) {
    var async = false

    db.batch(function (err) {
      t.ok(err, 'got error')
      t.equal(err.message, 'batch(array) requires an array argument', 'correct error message')
      t.ok(async, 'callback is asynchronous')
      t.end()
    })

    async = true
  })

  test('test batch() with undefined array', function (t) {
    var async = false

    db.batch(undefined, function (err) {
      t.ok(err, 'got error')
      t.equal(err.message, 'batch(array) requires an array argument', 'correct error message')
      t.ok(async, 'callback is asynchronous')
      t.end()
    })

    async = true
  })

  test('test batch() with null array', function (t) {
    var async = false

    db.batch(null, function (err) {
      t.ok(err, 'got error')
      t.equal(err.message, 'batch(array) requires an array argument', 'correct error message')
      t.ok(async, 'callback is asynchronous')
      t.end()
    })

    async = true
  })

  test('test batch() with null options', function (t) {
    db.batch([], null, function (err) {
      t.error(err)
      t.end()
    })
  })

  ;[null, undefined, 1, true].forEach(function (element) {
    var type = element === null ? 'null' : typeof element

    test('test batch() with ' + type + ' element', function (t) {
      var async = false

      db.batch([element], function (err) {
        t.ok(err, 'got error')
        t.equal(err.message, 'batch(array) element must be an object and not `null`', 'correct error message')
        t.ok(async, 'callback is asynchronous')
        t.end()
      })

      async = true
    })
  })

  test('test batch() with empty array', function (t) {
    var async = false

    db.batch([], function (err) {
      t.error(err, 'no error from batch()')
      t.ok(async, 'callback is asynchronous')
      t.end()
    })

    async = true
  })
}

exports.batch = function (test, testCommon) {
  test('test simple batch()', function (t) {
    db.batch([{ type: 'put', key: 'foo', value: 'bar' }], function (err) {
      t.error(err)

      db.get('foo', function (err, value) {
        t.error(err)
        var result
        if (isTypedArray(value)) {
          result = String.fromCharCode.apply(null, new Uint16Array(value))
        } else {
          t.ok(typeof Buffer !== 'undefined' && value instanceof Buffer)
          result = value.toString()
        }
        t.equal(result, 'bar')
        t.end()
      })
    })
  })

  test('test multiple batch()', function (t) {
    db.batch([
      { type: 'put', key: 'foobatch1', value: 'bar1' },
      { type: 'put', key: 'foobatch2', value: 'bar2' },
      { type: 'put', key: 'foobatch3', value: 'bar3' },
      { type: 'del', key: 'foobatch2' }
    ], function (err) {
      t.error(err)

      var r = 0
      var done = function () {
        if (++r === 3) { t.end() }
      }

      db.get('foobatch1', function (err, value) {
        t.error(err)
        var result
        if (isTypedArray(value)) {
          result = String.fromCharCode.apply(null, new Uint16Array(value))
        } else {
          t.ok(typeof Buffer !== 'undefined' && value instanceof Buffer)
          result = value.toString()
        }
        t.equal(result, 'bar1')
        done()
      })

      db.get('foobatch2', function (err, value) {
        t.ok(err, 'entry not found')
        t.ok(typeof value === 'undefined', 'value is undefined')
        t.ok(verifyNotFoundError(err), 'NotFound error')
        done()
      })

      db.get('foobatch3', function (err, value) {
        t.error(err)
        var result
        if (isTypedArray(value)) {
          result = String.fromCharCode.apply(null, new Uint16Array(value))
        } else {
          t.ok(typeof Buffer !== 'undefined' && value instanceof Buffer)
          result = value.toString()
        }
        t.equal(result, 'bar3')
        done()
      })
    })
  })
}

exports.atomic = function (test, testCommon) {
  test('test multiple batch()', function (t) {
    t.plan(4)

    var async = false

    db.batch([
      { type: 'put', key: 'foobah1', value: 'bar1' },
      { type: 'put', value: 'bar2' },
      { type: 'put', key: 'foobah3', value: 'bar3' }
    ], function (err) {
      t.ok(err, 'should error')
      t.ok(async, 'callback is asynchronous')

      db.get('foobah1', function (err) {
        t.ok(err, 'should not be found')
      })
      db.get('foobah3', function (err) {
        t.ok(err, 'should not be found')
      })
    })

    async = true
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
  exports.batch(test, testCommon)
  exports.atomic(test, testCommon)
  exports.tearDown(test, testCommon)
}

var collectEntries = require('level-concat-iterator')

var db

function collectBatchOps (batch) {
  var _put = batch._put
  var _del = batch._del
  var _operations = []

  if (typeof _put !== 'function' || typeof _del !== 'function') {
    return batch._operations
  }

  batch._put = function (key, value) {
    _operations.push({ type: 'put', key: key, value: value })
    return _put.apply(this, arguments)
  }

  batch._del = function (key) {
    _operations.push({ type: 'del', key: key })
    return _del.apply(this, arguments)
  }

  return _operations
}

exports.setUp = function (test, testCommon) {
  test('setUp common', testCommon.setUp)
  test('setUp db', function (t) {
    db = testCommon.factory()
    db.open(t.end.bind(t))
  })
}

exports.args = function (test, testCommon) {
  test('test batch has db reference', function (t) {
    t.ok(db.batch().db === db)
    t.end()
  })

  test('test batch#put() with missing `value`', function (t) {
    t.plan(1)

    try {
      db.batch().put('foo1')
    } catch (err) {
      t.is(err.message, 'value cannot be `null` or `undefined`', 'correct error message')
    }
  })

  test('test batch#put() with missing `key`', function (t) {
    try {
      db.batch().put(undefined, 'foo1')
    } catch (err) {
      t.equal(err.message, 'key cannot be `null` or `undefined`', 'correct error message')
      return t.end()
    }
    t.fail('should have thrown')
    t.end()
  })

  test('test batch#put() with null `key`', function (t) {
    try {
      db.batch().put(null, 'foo1')
    } catch (err) {
      t.equal(err.message, 'key cannot be `null` or `undefined`', 'correct error message')
      return t.end()
    }
    t.fail('should have thrown')
    t.end()
  })

  test('test batch#put() with missing `key` and `value`', function (t) {
    try {
      db.batch().put()
    } catch (err) {
      t.equal(err.message, 'key cannot be `null` or `undefined`', 'correct error message')
      return t.end()
    }
    t.fail('should have thrown')
    t.end()
  })

  test('test batch#put() with null or undefined `value`', function (t) {
    var illegalValues = [null, undefined]
    t.plan(illegalValues.length)

    illegalValues.forEach(function (value) {
      try {
        db.batch().put('key', value)
      } catch (err) {
        t.is(err.message, 'value cannot be `null` or `undefined`', 'correct error message')
      }
    })
  })

  test('test batch#del() with missing `key`', function (t) {
    try {
      db.batch().del()
    } catch (err) {
      t.equal(err.message, 'key cannot be `null` or `undefined`', 'correct error message')
      return t.end()
    }
    t.fail('should have thrown')
    t.end()
  })

  test('test batch#del() with null or undefined `key`', function (t) {
    var illegalKeys = [null, undefined]
    t.plan(illegalKeys.length)

    illegalKeys.forEach(function (key) {
      try {
        db.batch().del(key)
      } catch (err) {
        t.equal(err.message, 'key cannot be `null` or `undefined`', 'correct error message')
      }
    })
  })

  test('test batch#clear() doesn\'t throw', function (t) {
    db.batch().clear()
    t.end()
  })

  test('test batch#write() with no callback', function (t) {
    try {
      db.batch().write()
    } catch (err) {
      t.equal(err.message, 'write() requires a callback argument', 'correct error message')
      return t.end()
    }
    t.fail('should have thrown')
    t.end()
  })

  test('test batch#put() after write()', function (t) {
    var batch = db.batch().put('foo', 'bar')
    batch.write(function () {})
    try {
      batch.put('boom', 'bang')
    } catch (err) {
      t.equal(err.message, 'write() already called on this batch', 'correct error message')
      return t.end()
    }
    t.fail('should have thrown')
    t.end()
  })

  test('test batch#del() after write()', function (t) {
    var batch = db.batch().put('foo', 'bar')
    batch.write(function () {})
    try {
      batch.del('foo')
    } catch (err) {
      t.equal(err.message, 'write() already called on this batch', 'correct error message')
      return t.end()
    }
    t.fail('should have thrown')
    t.end()
  })

  test('test batch#clear() after write()', function (t) {
    var batch = db.batch().put('foo', 'bar')
    batch.write(function () {})
    try {
      batch.clear()
    } catch (err) {
      t.equal(err.message, 'write() already called on this batch', 'correct error message')
      return t.end()
    }
    t.fail('should have thrown')
    t.end()
  })

  test('test batch#write() after write()', function (t) {
    var batch = db.batch().put('foo', 'bar')
    batch.write(function () {})
    try {
      batch.write(function () {})
    } catch (err) {
      t.equal(err.message, 'write() already called on this batch', 'correct error message')
      return t.end()
    }
    t.fail('should have thrown')
    t.end()
  })

  test('test serialize object', function (t) {
    var batch = db.batch()
    var ops = collectBatchOps(batch)

    batch
      .put({ foo: 'bar' }, { beep: 'boop' })
      .del({ bar: 'baz' })
    ops.forEach(function (op) {
      t.ok(op.key, '.key is set for .put and .del operations')
      if (op.type === 'put') {
        t.ok(op.value, '.value is set for .put operation')
      }
    })
    t.end()
  })

  test('test custom _serialize*', function (t) {
    t.plan(4)

    var _db = Object.create(db)
    var batch = _db.batch()
    var ops = collectBatchOps(batch)

    _db._serializeKey = function (key) {
      t.same(key, { foo: 'bar' })
      return 'key1'
    }

    _db._serializeValue = function (value) {
      t.same(value, { beep: 'boop' })
      return 'value1'
    }

    batch.put({ foo: 'bar' }, { beep: 'boop' })

    _db._serializeKey = function (key) {
      t.same(key, { bar: 'baz' })
      return 'key2'
    }

    batch.del({ bar: 'baz' })

    t.deepEqual(ops, [
      { type: 'put', key: 'key1', value: 'value1' },
      { type: 'del', key: 'key2' }
    ])
  })

  test('test batch#write() with no operations', function (t) {
    var async = false

    db.batch().write(function (err) {
      t.ifError(err, 'no error from write()')
      t.ok(async, 'callback is asynchronous')
      t.end()
    })

    async = true
  })
}

exports.batch = function (test, testCommon) {
  test('test basic batch', function (t) {
    db.batch([
      { type: 'put', key: 'one', value: '1' },
      { type: 'put', key: 'two', value: '2' },
      { type: 'put', key: 'three', value: '3' }
    ], function (err) {
      t.error(err)
      db.batch()
        .put('1', 'one')
        .del('2', 'two')
        .put('3', 'three')
        .clear()
        .put('one', 'I')
        .put('two', 'II')
        .del('three')
        .put('foo', 'bar')
        .write(function (err) {
          t.error(err)
          collectEntries(
            db.iterator({ keyAsBuffer: false, valueAsBuffer: false }), function (err, data) {
              t.error(err)
              t.equal(data.length, 3, 'correct number of entries')
              var expected = [
                { key: 'foo', value: 'bar' },
                { key: 'one', value: 'I' },
                { key: 'two', value: 'II' }
              ]
              t.deepEqual(data, expected)
              t.end()
            }
          )
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
  exports.batch(test, testCommon)
  exports.tearDown(test, testCommon)
}

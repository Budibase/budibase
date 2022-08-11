var db

function collectBatchOps (batch) {
  var _put        = batch._put
    , _del        = batch._del
    , _operations = []

  if (typeof _put !== 'function' || typeof _del !== 'function')
    return batch._operations

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

module.exports.setUp = function (leveldown, test, testCommon) {
  test('setUp common', testCommon.setUp)
  test('setUp db', function (t) {
    db = leveldown(testCommon.location())
    db.open(t.end.bind(t))
  })
}

module.exports.args = function (test) {
  test('test batch#put() with missing `value`', function (t) {
    db.batch().put('foo1')
    t.end()
  })

  test('test batch#put() with null `value`', function (t) {
    db.batch().put('foo1', null)
    t.end()
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

  test('test batch#del() with null `key`', function (t) {
    try {
      db.batch().del(null)
    } catch (err) {
      t.equal(err.message, 'key cannot be `null` or `undefined`', 'correct error message')
      return t.end()
    }
    t.fail('should have thrown')
    t.end()
  })

  test('test batch#del() with null `key`', function (t) {
    try {
      db.batch().del(null)
    } catch (err) {
      t.equal(err.message, 'key cannot be `null` or `undefined`', 'correct error message')
      return t.end()
    }
    t.fail('should have thrown')
    t.end()
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
      batch.write(function (err) {})
    } catch (err) {
      t.equal(err.message, 'write() already called on this batch', 'correct error message')
      return t.end()
    }
    t.fail('should have thrown')
    t.end()
  })

  test('test serialize object', function (t) {
    var batch = db.batch()
      , ops   = collectBatchOps(batch)

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

  test('test serialize buffer', function (t) {
    var batch = db.batch()
      , ops   = collectBatchOps(batch)

    batch
      .put(Buffer('foo'), Buffer('bar'))
      .del(Buffer('baz'))
    t.equal(ops[0].key.toString(), 'foo')
    t.equal(ops[0].value.toString(), 'bar')
    t.equal(ops[1].key.toString(), 'baz')
    t.end()
  })

  test('test custom _serialize*', function (t) {
    var _db = Object.create(db)
    _db._serializeKey = _db._serializeValue = function (data) { return data }

    var batch = _db.batch()
      , ops   = collectBatchOps(batch)

    batch
      .put({ foo: 'bar' }, { beep: 'boop' })
      .del({ bar: 'baz' })

    t.deepEqual(ops, [
        { type: 'put', key: { foo: 'bar' }, value: { beep: 'boop' } }
      , { type: 'del', key: { bar: 'baz' } }
    ])

    t.end()
  })
}

module.exports.batch = function (test, testCommon) {
  test('test basic batch', function (t) {
    db.batch(
        [
            { type: 'put', key: 'one', value: '1' }
          , { type: 'put', key: 'two', value: '2' }
          , { type: 'put', key: 'three', value: '3' }
        ]
      , function (err) {
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
              testCommon.collectEntries(
                  db.iterator({ keyAsBuffer: false, valueAsBuffer: false })
                , function (err, data) {
                    t.error(err)
                    t.equal(data.length, 3, 'correct number of entries')
                    var expected = [
                        { key: 'foo', value: 'bar' }
                      , { key: 'one', value: 'I' }
                      , { key: 'two', value: 'II' }
                    ]
                    t.deepEqual(data, expected)
                    t.end()
                  }
              )
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
  module.exports.batch(test, testCommon)
  module.exports.tearDown(test, testCommon)
}

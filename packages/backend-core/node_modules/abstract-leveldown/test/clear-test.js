var concat = require('level-concat-iterator')
var db

exports.setUp = function (test, testCommon) {
  test('setUp common', testCommon.setUp)
  test('setUp db', function (t) {
    db = testCommon.factory()
    db.open(t.end.bind(t))
  })
}

exports.args = function (test, testCommon) {
  test('test argument-less clear() throws', function (t) {
    t.throws(
      db.clear.bind(db),
      /Error: clear\(\) requires a callback argument/,
      'no-arg clear() throws'
    )
    t.end()
  })
}

exports.clear = function (test, testCommon) {
  makeTest('string', ['a', 'b'])

  if (testCommon.bufferKeys) {
    makeTest('buffer', [Buffer.from('a'), Buffer.from('b')])
    makeTest('mixed', [Buffer.from('a'), 'b'])

    // These keys would be equal when compared as utf8 strings
    makeTest('non-utf8 buffer', [Buffer.from('80', 'hex'), Buffer.from('c0', 'hex')])
  }

  function makeTest (type, keys) {
    test('test simple clear() on ' + type + ' keys', function (t) {
      t.plan(8)

      var db = testCommon.factory()
      var ops = keys.map(function (key) {
        return { type: 'put', key: key, value: 'foo' }
      })

      db.open(function (err) {
        t.ifError(err, 'no open error')

        db.batch(ops, function (err) {
          t.ifError(err, 'no batch error')

          concat(db.iterator(), function (err, entries) {
            t.ifError(err, 'no concat error')
            t.is(entries.length, keys.length, 'has entries')

            db.clear(function (err) {
              t.ifError(err, 'no clear error')

              concat(db.iterator(), function (err, entries) {
                t.ifError(err, 'no concat error')
                t.is(entries.length, 0, 'has no entries')

                db.close(function (err) {
                  t.ifError(err, 'no close error')
                })
              })
            })
          })
        })
      })
    })
  }
}

exports.tearDown = function (test, testCommon) {
  test('tearDown', function (t) {
    db.close(testCommon.tearDown.bind(null, t))
  })
}

exports.all = function (test, testCommon) {
  exports.setUp(test, testCommon)
  exports.args(test, testCommon)
  exports.clear(test, testCommon)
  exports.tearDown(test, testCommon)
}

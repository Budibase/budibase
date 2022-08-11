var db

exports.setUp = function (test, testCommon) {
  test('setUp common', testCommon.setUp)
  test('setUp db', function (t) {
    db = testCommon.factory()
    db.open(t.end.bind(t))
  })
}

exports.args = function (test, testCommon) {
  test('test iterator has db reference', function (t) {
    var iterator = db.iterator()
    t.ok(iterator.db === db)
    iterator.end(t.end.bind(t))
  })

  test('test argument-less iterator#next() throws', function (t) {
    var iterator = db.iterator()
    t.throws(
      iterator.next.bind(iterator),
      /Error: next\(\) requires a callback argument/,
      'no-arg iterator#next() throws'
    )
    iterator.end(t.end.bind(t))
  })

  test('test argument-less iterator#end() after next() throws', function (t) {
    var iterator = db.iterator()
    iterator.next(function () {
      t.throws(
        iterator.end.bind(iterator),
        /Error: end\(\) requires a callback argument/,
        'no-arg iterator#end() throws'
      )
      iterator.end(t.end.bind(t))
    })
  })

  test('test argument-less iterator#end() throws', function (t) {
    var iterator = db.iterator()
    t.throws(
      iterator.end.bind(iterator),
      /Error: end\(\) requires a callback argument/,
      'no-arg iterator#end() throws'
    )
    iterator.end(t.end.bind(t))
  })

  test('test iterator#next returns this', function (t) {
    var iterator = db.iterator()
    var self = iterator.next(function () {})
    t.ok(iterator === self)
    iterator.end(t.end.bind(t))
  })
}

exports.sequence = function (test, testCommon) {
  test('test twice iterator#end() callback with error', function (t) {
    var iterator = db.iterator()
    iterator.end(function (err) {
      t.error(err)

      var async = false

      iterator.end(function (err2) {
        t.ok(err2, 'returned error')
        t.is(err2.name, 'Error', 'correct error')
        t.is(err2.message, 'end() already called on iterator')
        t.ok(async, 'callback is asynchronous')
        t.end()
      })

      async = true
    })
  })

  test('test iterator#next after iterator#end() callback with error', function (t) {
    var iterator = db.iterator()
    iterator.end(function (err) {
      t.error(err)

      var async = false

      iterator.next(function (err2) {
        t.ok(err2, 'returned error')
        t.is(err2.name, 'Error', 'correct error')
        t.is(err2.message, 'cannot call next() after end()', 'correct message')
        t.ok(async, 'callback is asynchronous')
        t.end()
      })

      async = true
    })
  })

  test('test twice iterator#next() throws', function (t) {
    var iterator = db.iterator()
    iterator.next(function (err) {
      t.error(err)
      iterator.end(function (err) {
        t.error(err)
        t.end()
      })
    })

    var async = false

    iterator.next(function (err) {
      t.ok(err, 'returned error')
      t.is(err.name, 'Error', 'correct error')
      t.is(err.message, 'cannot call next() before previous next() has completed')
      t.ok(async, 'callback is asynchronous')
    })

    async = true
  })
}

exports.iterator = function (test, testCommon) {
  test('test simple iterator()', function (t) {
    var data = [
      { type: 'put', key: 'foobatch1', value: 'bar1' },
      { type: 'put', key: 'foobatch2', value: 'bar2' },
      { type: 'put', key: 'foobatch3', value: 'bar3' }
    ]
    var idx = 0

    db.batch(data, function (err) {
      t.error(err)
      var iterator = db.iterator()
      var fn = function (err, key, value) {
        t.error(err)
        if (key && value) {
          t.ok(Buffer.isBuffer(key), 'key argument is a Buffer')
          t.ok(Buffer.isBuffer(value), 'value argument is a Buffer')
          t.is(key.toString(), data[idx].key, 'correct key')
          t.is(value.toString(), data[idx].value, 'correct value')
          process.nextTick(next)
          idx++
        } else { // end
          t.ok(typeof err === 'undefined', 'err argument is undefined')
          t.ok(typeof key === 'undefined', 'key argument is undefined')
          t.ok(typeof value === 'undefined', 'value argument is undefined')
          t.is(idx, data.length, 'correct number of entries')
          iterator.end(function () {
            t.end()
          })
        }
      }
      var next = function () {
        iterator.next(fn)
      }

      next()
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
  exports.sequence(test, testCommon)
  exports.iterator(test, testCommon)
  exports.tearDown(test, testCommon)
}

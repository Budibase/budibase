var concat = require('level-concat-iterator')

var data = (function () {
  var d = []
  var i = 0
  var k
  for (; i < 100; i++) {
    k = (i < 10 ? '0' : '') + i
    d.push({
      key: k,
      value: String(Math.random())
    })
  }
  return d
}())

exports.setUp = function (test, testCommon) {
  test('setUp common', testCommon.setUp)
}

exports.range = function (test, testCommon) {
  function rangeTest (name, opts, expected) {
    test('db#clear() with ' + name, function (t) {
      prepare(t, function (db) {
        db.clear(opts, function (err) {
          t.ifError(err, 'no clear error')
          verify(t, db, expected)
        })
      })
    })
  }

  function prepare (t, callback) {
    var db = testCommon.factory()

    db.open(function (err) {
      t.ifError(err, 'no open error')

      db.batch(data.map(function (d) {
        return {
          type: 'put',
          key: d.key,
          value: d.value
        }
      }), function (err) {
        t.ifError(err, 'no batch error')
        callback(db)
      })
    })
  }

  function verify (t, db, expected) {
    var it = db.iterator({ keyAsBuffer: false, valueAsBuffer: false })

    concat(it, function (err, result) {
      t.ifError(err, 'no concat error')
      t.is(result.length, expected.length, 'correct number of entries')
      t.same(result, expected)

      db.close(t.end.bind(t))
    })
  }

  function exclude (data, start, end, expectedLength) {
    data = data.slice()
    var removed = data.splice(start, end - start + 1) // Inclusive
    if (expectedLength != null) checkLength(removed, expectedLength)
    return data
  }

  // For sanity checks on test arguments
  function checkLength (arr, length) {
    if (arr.length !== length) {
      throw new RangeError('Expected ' + length + ' elements, got ' + arr.length)
    }

    return arr
  }

  rangeTest('full range', {}, [])

  // Reversing has no effect without limit
  rangeTest('reverse=true', {
    reverse: true
  }, [])

  rangeTest('gte=00', {
    gte: '00'
  }, [])

  rangeTest('gte=50', {
    gte: '50'
  }, data.slice(0, 50))

  rangeTest('lte=50 and reverse=true', {
    lte: '50',
    reverse: true
  }, data.slice(51))

  rangeTest('gte=49.5 (midway)', {
    gte: '49.5'
  }, data.slice(0, 50))

  rangeTest('gte=49999 (midway)', {
    gte: '49999'
  }, data.slice(0, 50))

  rangeTest('lte=49.5 (midway) and reverse=true', {
    lte: '49.5',
    reverse: true
  }, data.slice(50))

  rangeTest('lt=49.5 (midway) and reverse=true', {
    lt: '49.5',
    reverse: true
  }, data.slice(50))

  rangeTest('lt=50 and reverse=true', {
    lt: '50',
    reverse: true
  }, data.slice(50))

  rangeTest('lte=50', {
    lte: '50'
  }, data.slice(51))

  rangeTest('lte=50.5 (midway)', {
    lte: '50.5'
  }, data.slice(51))

  rangeTest('lte=50555 (midway)', {
    lte: '50555'
  }, data.slice(51))

  rangeTest('lt=50555 (midway)', {
    lt: '50555'
  }, data.slice(51))

  rangeTest('gte=50.5 (midway) and reverse=true', {
    gte: '50.5',
    reverse: true
  }, data.slice(0, 51))

  rangeTest('gt=50.5 (midway) and reverse=true', {
    gt: '50.5',
    reverse: true
  }, data.slice(0, 51))

  rangeTest('gt=50 and reverse=true', {
    gt: '50',
    reverse: true
  }, data.slice(0, 51))

  // Starting key is actually '00' so it should avoid it
  rangeTest('lte=0', {
    lte: '0'
  }, data)

  // Starting key is actually '00' so it should avoid it
  rangeTest('lt=0', {
    lt: '0'
  }, data)

  rangeTest('gte=30 and lte=70', {
    gte: '30',
    lte: '70'
  }, exclude(data, 30, 70))

  rangeTest('gt=29 and lt=71', {
    gt: '29',
    lt: '71'
  }, exclude(data, 30, 70))

  rangeTest('gte=30 and lte=70 and reverse=true', {
    lte: '70',
    gte: '30',
    reverse: true
  }, exclude(data, 30, 70))

  rangeTest('gt=29 and lt=71 and reverse=true', {
    lt: '71',
    gt: '29',
    reverse: true
  }, exclude(data, 30, 70))

  rangeTest('limit=20', {
    limit: 20
  }, data.slice(20))

  rangeTest('limit=20 and gte=20', {
    limit: 20,
    gte: '20'
  }, exclude(data, 20, 39, 20))

  rangeTest('limit=20 and reverse=true', {
    limit: 20,
    reverse: true
  }, data.slice(0, -20))

  rangeTest('limit=20 and lte=79 and reverse=true', {
    limit: 20,
    lte: '79',
    reverse: true
  }, exclude(data, 60, 79, 20))

  rangeTest('limit=-1 should clear whole database', {
    limit: -1
  }, [])

  rangeTest('limit=0 should not clear anything', {
    limit: 0
  }, data)

  rangeTest('lte after limit', {
    limit: 20,
    lte: '50'
  }, data.slice(20))

  rangeTest('lte before limit', {
    limit: 50,
    lte: '19'
  }, data.slice(20))

  rangeTest('gte after database end', {
    gte: '9a'
  }, data)

  rangeTest('gt after database end', {
    gt: '9a'
  }, data)

  rangeTest('lte after database end and reverse=true', {
    lte: '9a',
    reverse: true
  }, [])

  rangeTest('lte and gte after database and reverse=true', {
    lte: '9b',
    gte: '9a',
    reverse: true
  }, data)

  rangeTest('lt and gt after database and reverse=true', {
    lt: '9b',
    gt: '9a',
    reverse: true
  }, data)
}

exports.tearDown = function (test, testCommon) {
  test('tearDown', testCommon.tearDown)
}

exports.all = function (test, testCommon) {
  exports.setUp(test, testCommon)
  exports.range(test, testCommon)
  exports.tearDown(test, testCommon)
}

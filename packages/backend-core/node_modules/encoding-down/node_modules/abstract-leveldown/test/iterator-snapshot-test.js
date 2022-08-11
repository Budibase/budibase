exports.setUp = function (test, testCommon) {
  test('setUp common', testCommon.setUp)
}

exports.snapshot = function (test, testCommon) {
  function make (run) {
    return function (t) {
      var db = testCommon.factory()

      db.open(function (err) {
        t.ifError(err, 'no open error')

        db.put('z', 'from snapshot', function (err) {
          t.ifError(err, 'no put error')

          // For this test it is important that we don't read eagerly.
          // NOTE: highWaterMark is not an abstract option atm, but
          // it is supported by leveldown, rocksdb and others.
          var it = db.iterator({ highWaterMark: 0 })

          run(t, db, it, function end (err) {
            t.ifError(err, 'no run error')

            it.end(function (err) {
              t.ifError(err, 'no iterator end error')
              db.close(t.end.bind(t))
            })
          })
        })
      })
    }
  }

  test('delete key after snapshotting', make(function (t, db, it, end) {
    db.del('z', function (err) {
      t.ifError(err, 'no del error')

      it.next(function (err, key, value) {
        t.ifError(err, 'no next error')
        t.ok(key, 'got a key')
        t.is(key.toString(), 'z', 'correct key')
        t.is(value.toString(), 'from snapshot', 'correct value')

        end()
      })
    })
  }))

  test('overwrite key after snapshotting', make(function (t, db, it, end) {
    db.put('z', 'not from snapshot', function (err) {
      t.ifError(err, 'no put error')

      it.next(function (err, key, value) {
        t.ifError(err, 'no next error')
        t.ok(key, 'got a key')
        t.is(key.toString(), 'z', 'correct key')
        t.is(value.toString(), 'from snapshot', 'correct value')

        end()
      })
    })
  }))

  test('add key after snapshotting that sorts first', make(function (t, db, it, end) {
    db.put('a', 'not from snapshot', function (err) {
      t.ifError(err, 'no put error')

      it.next(function (err, key, value) {
        t.ifError(err, 'no next error')

        t.ok(key, 'got a key')
        t.is(key.toString(), 'z', 'correct key')
        t.is(value.toString(), 'from snapshot', 'correct value')

        end()
      })
    })
  }))
}

exports.tearDown = function (test, testCommon) {
  test('tearDown', testCommon.tearDown)
}

exports.all = function (test, testCommon) {
  exports.setUp(test, testCommon)
  exports.snapshot(test, testCommon)
  exports.tearDown(test, testCommon)
}

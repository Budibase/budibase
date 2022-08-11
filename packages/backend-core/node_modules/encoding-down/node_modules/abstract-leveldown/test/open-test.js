exports.setUp = function (test, testCommon) {
  test('setUp', testCommon.setUp)
}

exports.args = function (test, testCommon) {
  testCommon.promises || test('test database open no-arg throws', function (t) {
    var db = testCommon.factory()
    t.throws(
      db.open.bind(db),
      /Error: open\(\) requires a callback argument/,
      'no-arg open() throws'
    )
    t.end()
  })

  testCommon.promises || test('test callback-less, 1-arg, open() throws', function (t) {
    var db = testCommon.factory()
    t.throws(
      db.open.bind(db, {}),
      /Error: open\(\) requires a callback argument/,
      'callback-less, 1-arg open() throws'
    )
    t.end()
  })
}

exports.open = function (test, testCommon) {
  test('test database open, no options', function (t) {
    var db = testCommon.factory()

    // default createIfMissing=true, errorIfExists=false
    db.open(function (err) {
      t.error(err)
      db.close(function () {
        t.end()
      })
    })
  })

  test('test database open, options and callback', function (t) {
    var db = testCommon.factory()

    // default createIfMissing=true, errorIfExists=false
    db.open({}, function (err) {
      t.error(err)
      db.close(function () {
        t.end()
      })
    })
  })

  test('test database open, close and open', function (t) {
    var db = testCommon.factory()

    db.open(function (err) {
      t.error(err)
      db.close(function (err) {
        t.error(err)
        db.open(function (err) {
          t.error(err)
          db.close(function () {
            t.end()
          })
        })
      })
    })
  })
}

exports.tearDown = function (test, testCommon) {
  test('tearDown', testCommon.tearDown)
}

exports.all = function (test, testCommon) {
  exports.setUp(test, testCommon)
  exports.args(test, testCommon)
  exports.open(test, testCommon)
  exports.tearDown(test, testCommon)
}

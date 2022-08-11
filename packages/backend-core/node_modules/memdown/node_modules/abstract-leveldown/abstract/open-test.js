module.exports.setUp = function (test, testCommon) {
  test('setUp', testCommon.setUp)
}

module.exports.args = function (leveldown, test, testCommon) {
  test('test database open no-arg throws', function (t) {
    var db = leveldown(testCommon.location())
    t.throws(
        db.open.bind(db)
      , { name: 'Error', message: 'open() requires a callback argument' }
      , 'no-arg open() throws'
    )
    t.end()
  })

  test('test callback-less, 1-arg, open() throws', function (t) {
    var db = leveldown(testCommon.location())
    t.throws(
        db.open.bind(db, {})
      , { name: 'Error', message: 'open() requires a callback argument' }
      , 'callback-less, 1-arg open() throws'
    )
    t.end()
  })
}

module.exports.open = function (leveldown, test, testCommon) {
  test('test database open, no options', function (t) {
    var db = leveldown(testCommon.location())

    // default createIfMissing=true, errorIfExists=false
    db.open(function (err) {
        t.error(err)
        db.close(function () {
          t.end()
        })
      })
  })

  test('test database open, options and callback', function (t) {
    var db = leveldown(testCommon.location())

    // default createIfMissing=true, errorIfExists=false
    db.open({}, function (err) {
        t.error(err)
        db.close(function () {
          t.end()
        })
      })
  })
  test('test database open, close and open', function (t) {
    var db = leveldown(testCommon.location())

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

module.exports.openAdvanced = function (leveldown, test, testCommon) {
  test('test database open createIfMissing:false', function (t) {
    var db = leveldown(testCommon.location())

    db.open({ createIfMissing: false }, function (err) {
      t.ok(err, 'error')
      t.ok(/does not exist/.test(err.message), 'error is about dir not existing')
      t.end()
    })
  })

  test('test database open errorIfExists:true', function (t) {
    var location = testCommon.location()
      , db       = leveldown(location)

    // make a valid database first, then close and dispose
    db.open({}, function (err) {
      t.error(err)
      db.close(function (err) {
        t.error(err)

        // open again with 'errorIfExists'
        db = leveldown(location)
        db.open({ createIfMissing: false, errorIfExists: true }, function (err) {
          t.ok(err, 'error')
          t.ok(/exists/.test(err.message), 'error is about already existing')
          t.end()
        })
      })
    })
  })
}

module.exports.tearDown = function (test, testCommon) {
  test('tearDown', testCommon.tearDown)
}

module.exports.all = function (leveldown, test, testCommon) {
  module.exports.setUp(test, testCommon)
  module.exports.args(leveldown, test, testCommon)
  module.exports.open(leveldown, test, testCommon)
  module.exports.openAdvanced(leveldown, test, testCommon)
  module.exports.tearDown(test, testCommon)
}
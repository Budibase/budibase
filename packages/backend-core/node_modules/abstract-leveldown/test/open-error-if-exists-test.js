exports.setUp = function (test, testCommon) {
  test('setUp', testCommon.setUp)
}

exports.errorIfExists = function (test, testCommon) {
  test('test database open errorIfExists:true', function (t) {
    var db = testCommon.factory()

    db.open({}, function (err) {
      t.error(err)
      db.close(function (err) {
        t.error(err)

        var async = false

        db.open({ createIfMissing: false, errorIfExists: true }, function (err) {
          t.ok(err, 'error')
          t.ok(/exists/.test(err.message), 'error is about already existing')
          t.ok(async, 'callback is asynchronous')
          t.end()
        })

        async = true
      })
    })
  })
}

exports.tearDown = function (test, testCommon) {
  test('tearDown', testCommon.tearDown)
}

exports.all = function (test, testCommon) {
  exports.setUp(test, testCommon)
  exports.errorIfExists(test, testCommon)
  exports.tearDown(test, testCommon)
}

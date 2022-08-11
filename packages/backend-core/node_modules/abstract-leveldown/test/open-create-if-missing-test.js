exports.setUp = function (test, testCommon) {
  test('setUp', testCommon.setUp)
}

exports.createIfMissing = function (test, testCommon) {
  test('test database open createIfMissing:false', function (t) {
    var db = testCommon.factory()
    var async = false

    db.open({ createIfMissing: false }, function (err) {
      t.ok(err, 'error')
      t.ok(/does not exist/.test(err.message), 'error is about dir not existing')
      t.ok(async, 'callback is asynchronous')
      t.end()
    })

    async = true
  })
}

exports.tearDown = function (test, testCommon) {
  test('tearDown', testCommon.tearDown)
}

exports.all = function (test, testCommon) {
  exports.setUp(test, testCommon)
  exports.createIfMissing(test, testCommon)
  exports.tearDown(test, testCommon)
}

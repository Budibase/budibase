var db

exports.setUp = function (test, testCommon) {
  test('setUp common', testCommon.setUp)
  test('setUp db', function (t) {
    db = testCommon.factory()
    db.open(t.end.bind(t))
  })
}

exports.close = function (test, testCommon) {
  test('test close()', function (t) {
    testCommon.promises || t.throws(
      db.close.bind(db),
      /Error: close\(\) requires a callback argument/,
      'no-arg close() throws'
    )
    testCommon.promises || t.throws(
      db.close.bind(db, 'foo'),
      /Error: close\(\) requires a callback argument/,
      'non-callback close() throws'
    )

    db.close(function (err) {
      t.error(err)
      t.end()
    })
  })
}

exports.tearDown = function (test, testCommon) {
  test('tearDown', testCommon.tearDown)
}

exports.all = function (test, testCommon) {
  exports.setUp(test, testCommon)
  exports.close(test, testCommon)
  exports.tearDown(test, testCommon)
}

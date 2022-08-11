var suite = require('level-supports/test')

module.exports = function (test, testCommon) {
  test('setUp common', testCommon.setUp)

  suite(test, testCommon)

  testCommon.status && test('manifest has status', function (t) {
    var db = testCommon.factory()
    t.is(db.supports.status, true)

    // The semantics of not opening or closing a new db are unclear
    // atm, so let's open it before closing, like every other test.
    db.open(function (err) {
      t.ifError(err, 'no open error')
      db.close(t.end.bind(t))
    })
  })

  test('tearDown', testCommon.tearDown)
}

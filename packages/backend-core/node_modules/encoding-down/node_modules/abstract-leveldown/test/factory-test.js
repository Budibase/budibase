var concat = require('level-concat-iterator')

module.exports = function (test, testCommon) {
  test('setUp common', testCommon.setUp)

  test('testCommon.factory() returns a unique database', function (t) {
    var db1 = testCommon.factory()
    var db2 = testCommon.factory()

    function close () {
      db1.close(function (err) {
        t.error(err, 'no error while closing db1')
        db2.close(function (err) {
          t.error(err, 'no error while closing db2')
          t.end()
        })
      })
    }

    db1.open(function (err) {
      t.error(err, 'no error while opening db1')
      db2.open(function (err) {
        t.error(err, 'no error while opening db2')
        db1.put('key', 'value', function (err) {
          t.error(err, 'put key in db1')
          concat(db2.iterator(), function (err, entries) {
            t.error(err, 'got items from db2')
            t.same(entries, [], 'db2 should be empty')
            close()
          })
        })
      })
    })
  })

  test('tearDown', testCommon.tearDown)
}

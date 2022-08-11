'use strict'

var location = require('./location')

module.exports = function (test, level) {
  test('test db open and use, level(location, options, cb) force error', function (t) {
    level(location, { errorIfExists: true }, function (err, db) {
      t.ok(err, 'got error opening existing db')
      t.notOk(db, 'no db')
      t.end()
    })
  })
}

'use strict'

var location = require('./location')

module.exports = function (test, level) {
  test('test repair', function (t) {
    t.plan(1)
    level.repair(location, function (err) {
      t.notOk(err, 'no error')
    })
  })
}

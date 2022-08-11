'use strict'

var location = require('./location')

module.exports = function (test, level, nonPersistent) {
  test('test db values', function (t) {
    var c = 0
    var db = level(location)
    var setup = nonPersistent ? function (callback) {
      db.batch([
        { type: 'put', key: 'test1', value: 'success' },
        { type: 'put', key: 'test2', value: 'success' },
        { type: 'put', key: 'test3', value: 'success' }
      ], callback)
    } : function (callback) { callback() }

    function read (err, value) {
      t.notOk(err, 'no error')
      t.equal(value, 'success')
      if (++c === 3) { db.close(t.end.bind(t)) }
    }

    setup(function (err) {
      t.notOk(err, 'no error')
      db.get('test1', read)
      db.get('test2', read)
      db.get('test3', read)
    })
  })
}

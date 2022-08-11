'use strict'

var xtend = require('xtend')
var shape = require('./shape')
var cloneable = require('./cloneable')

module.exports = function suite (test, testCommon) {
  test('db has manifest', function (t) {
    var db = testCommon.factory()
    var manifest = db.supports

    shape(t, manifest)
    cloneable(t, manifest)

    var before = xtend(manifest, {
      additionalMethods: xtend(manifest.additionalMethods)
    })

    db.open(function (err) {
      t.ifError(err, 'no open error')
      t.same(db.supports, before, 'manifest did not change after open')

      db.close(function (err) {
        t.ifError(err, 'no close error')
        t.same(db.supports, before, 'manifest did not change after close')
        t.end()
      })
    })
  })
}

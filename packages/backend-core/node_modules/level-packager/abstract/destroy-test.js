'use strict'

var fs = require('fs')
var path = require('path')
var location = require('./location')

module.exports = function (test, level) {
  test('test destroy', function (t) {
    t.plan(4)
    t.ok(fs.statSync(location).isDirectory(), 'sanity check, directory exists')
    t.ok(fs.existsSync(path.join(location, 'CURRENT')), 'sanity check, CURRENT exists')
    level.destroy(location, function (err) {
      t.notOk(err, 'no error')
      t.notOk(fs.existsSync(path.join(location, 'CURRENT')), 'db gone (mostly)')
    })
  })
}

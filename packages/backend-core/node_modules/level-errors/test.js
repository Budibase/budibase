var test = require('tape')
var errors = require('./')

test('all errors are instances of LevelUPError', function (t) {
  var LevelUPError = errors.LevelUPError
  var keys = Object.keys(errors)

  keys.forEach(function (key) {
    t.ok(new errors[key]() instanceof LevelUPError)
  })

  t.end()
})

test('NotFoundError has special properties', function (t) {
  var error = new errors.NotFoundError()
  t.equal(error.notFound, true)
  t.equal(error.status, 404)
  t.end()
})

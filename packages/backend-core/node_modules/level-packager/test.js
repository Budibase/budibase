'use strict'

var test = require('tape')
var packager = require('.')

test('Level constructor has access to levelup errors', function (t) {
  function Down () {}
  t.ok(packager(Down).errors, '.errors property set on constructor')
  t.end()
})

test('Level constructor relays .destroy and .repair if they exist', function (t) {
  t.plan(8)

  test('destroy')
  test('repair')

  function test (method) {
    function Down () {}

    Down[method] = function () {
      t.same([].slice.call(arguments), args, 'supports variadic arguments')
    }

    var level = packager(Down)
    var args = []

    for (var i = 0; i < 4; i++) {
      args.push(i)
      level[method].apply(level, args)
    }
  }
})

test('Level constructor', function (t) {
  t.plan(3)
  function Down () {
    return {
      open: function (opts, cb) {
        t.same(opts, {
          createIfMissing: true,
          errorIfExists: false,

          // This is a side effect of encoding-down (mutating options)
          keyEncoding: 'utf8',
          valueEncoding: 'utf8'
        })
      }
    }
  }
  var levelup = packager(Down)()
  t.is(levelup.options.keyEncoding, 'utf8')
  t.is(levelup.options.valueEncoding, 'utf8')
})

test('Level constructor with location', function (t) {
  t.plan(4)
  function Down (location) {
    t.is(location, 'location', 'location is correct')
    return {
      open: function (opts, cb) {
        t.same(opts, {
          createIfMissing: true,
          errorIfExists: false,
          keyEncoding: 'utf8',
          valueEncoding: 'utf8'
        })
      }
    }
  }
  var levelup = packager(Down)('location')
  t.is(levelup.options.keyEncoding, 'utf8')
  t.is(levelup.options.valueEncoding, 'utf8')
})

test('Level constructor with location & options', function (t) {
  t.plan(2)
  function Down (location, opts) {
    t.is(location, 'location', 'location is correct')
    t.same(opts, {
      prefix: 'foo'
    })
    return {
      open: function (opts, cb) {
        cb()
      }
    }
  }
  packager(Down)('location', { prefix: 'foo' })
})

test('Level constructor with callback', function (t) {
  t.plan(3)
  function Down () {
    return {
      open: function (opts, cb) {
        t.same(opts, {
          createIfMissing: true,
          errorIfExists: false,
          keyEncoding: 'utf8',
          valueEncoding: 'utf8'
        })
        process.nextTick(cb)
      }
    }
  }
  packager(Down)(function (err, db) {
    t.error(err)
    t.ok(db, 'db set in callback')
  })
})

test('Level constructor with location & callback', function (t) {
  t.plan(4)
  function Down (location) {
    t.is(location, 'location', 'location is correct')
    return {
      open: function (opts, cb) {
        t.same(opts, {
          createIfMissing: true,
          errorIfExists: false,
          keyEncoding: 'utf8',
          valueEncoding: 'utf8'
        })
        process.nextTick(cb)
      }
    }
  }
  packager(Down)('location', function (err, db) {
    t.error(err)
    t.ok(db, 'db set in callback')
  })
})

test('Level constructor with location & options passed to levelup', function (t) {
  t.plan(4)
  var Down = function (location) {
    t.is(location, 'location', 'location is correct')
    return {
      open: function (opts, cb) {
        t.same(opts, {
          createIfMissing: true,
          errorIfExists: false,
          keyEncoding: 'binary',
          valueEncoding: 'binary'
        })
      }
    }
  }
  var levelup = packager(Down)('location', {
    keyEncoding: 'binary',
    valueEncoding: 'binary'
  })
  t.is(levelup.options.keyEncoding, 'binary')
  t.is(levelup.options.valueEncoding, 'binary')
})

test('Level constructor with options passed to levelup', function (t) {
  t.plan(3)
  var Down = function () {
    return {
      open: function (opts, cb) {
        t.same(opts, {
          createIfMissing: true,
          errorIfExists: false,
          keyEncoding: 'binary',
          valueEncoding: 'binary'
        })
      }
    }
  }
  var levelup = packager(Down)({
    keyEncoding: 'binary',
    valueEncoding: 'binary'
  })
  t.is(levelup.options.keyEncoding, 'binary')
  t.is(levelup.options.valueEncoding, 'binary')
})

test('Level constructor with options & callback passed to levelup', function (t) {
  t.plan(5)
  var Down = function () {
    return {
      open: function (opts, cb) {
        t.same(opts, {
          createIfMissing: true,
          errorIfExists: false,
          keyEncoding: 'binary',
          valueEncoding: 'binary'
        })
        process.nextTick(cb)
      }
    }
  }
  var levelup = packager(Down)({
    keyEncoding: 'binary',
    valueEncoding: 'binary'
  }, function (err, db) {
    t.error(err)
    t.ok(db, 'db set in callback')
  })
  t.is(levelup.options.keyEncoding, 'binary')
  t.is(levelup.options.valueEncoding, 'binary')
})

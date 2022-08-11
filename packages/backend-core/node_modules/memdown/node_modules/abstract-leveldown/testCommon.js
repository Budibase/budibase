var path      = require('path')
  , fs        = !process.browser && require('fs')
  , rimraf    = !process.browser && require('rimraf')

var dbidx = 0

  , location = function () {
      return path.join(__dirname, '_leveldown_test_db_' + dbidx++)
    }

  , lastLocation = function () {
      return path.join(__dirname, '_leveldown_test_db_' + dbidx)
    }

  , cleanup = function (callback) {
      if (process.browser)
        return callback()

      fs.readdir(__dirname, function (err, list) {
        if (err) return callback(err)

        list = list.filter(function (f) {
          return (/^_leveldown_test_db_/).test(f)
        })

        if (!list.length)
          return callback()

        var ret = 0

        list.forEach(function (f) {
          rimraf(path.join(__dirname, f), function (err) {
            if (++ret == list.length)
              callback()
          })
        })
      })
    }

  , setUp = function (t) {
      cleanup(function (err) {
        t.error(err, 'cleanup returned an error')
        t.end()
      })
    }

  , tearDown = function (t) {
      setUp(t) // same cleanup!
    }

  , collectEntries = function (iterator, callback) {
      var data = []
        , next = function () {
            iterator.next(function (err, key, value) {
              if (err) return callback(err)
              if (!arguments.length) {
                return iterator.end(function (err) {
                  callback(err, data)
                })
              }
              data.push({ key: key, value: value })
              setTimeout(next, 0)
            })
          }
      next()
    }

module.exports = {
    location       : location
  , cleanup        : cleanup
  , lastLocation   : lastLocation
  , setUp          : setUp
  , tearDown       : tearDown
  , collectEntries : collectEntries
}

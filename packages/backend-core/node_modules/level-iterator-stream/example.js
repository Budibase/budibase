var iteratorStream = require('./')
var leveldown = require('leveldown')
var path = require('path')

var db = leveldown(path.join(__dirname, 'db'))
db.open(function (err) {
  if (err) throw err

  var ops = []
  for (var i = 0; i < 1000; i++) {
    ops.push({
      type: 'put',
      key: String(Math.random()),
      value: String(Math.random())
    })
  }

  db.batch(ops, function (err) {
    if (err) throw err

    var stream = iteratorStream(db.iterator())
    stream.on('data', function (kv) {
      console.log('%s -> %s', kv.key, kv.value)
    })
  })
})

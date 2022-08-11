var test = require('tape')
var Codec = require('..')

test('codec', function (t) {
  var codec = new Codec({ keyEncoding: 'hex' })
  t.ok(codec.keyAsBuffer())
  codec = new Codec()
  t.notOk(codec.keyAsBuffer())
  t.end()
})

test('codec, new not needed', function (t) {
  var codec = Codec({ keyEncoding: 'hex' })
  t.ok(codec.keyAsBuffer())
  codec = Codec()
  t.notOk(codec.keyAsBuffer())
  t.end()
})

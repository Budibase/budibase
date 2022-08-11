var test = require('tape')
var Codec = require('..')

test('batch', function (t) {
  var codec = new Codec({})
  var ops = [
    { type: 'put', key: 'string', value: 'string', valueEncoding: 'utf8' },
    { type: 'put', key: 'json', value: {} }
  ]
  var opsSerialized = JSON.stringify(ops)

  var encoded = codec.encodeBatch(ops, { valueEncoding: 'json' })

  t.equal(opsSerialized, JSON.stringify(ops), 'ops not changed')

  t.deepEqual(encoded, [
    { type: 'put', key: 'string', value: 'string' },
    { type: 'put', key: 'json', value: '{}' }
  ])

  encoded = codec.encodeBatch(ops)
  t.deepEqual(encoded, [
    { type: 'put', key: 'string', value: 'string' },
    { type: 'put', key: 'json', value: {} }
  ])

  t.end()
})

test('batch - legacy', function (t) {
  var codec = new Codec({})
  var ops = [
    { type: 'put', key: 'string', value: 'string', encoding: 'utf8' },
    { type: 'put', key: 'json', value: {} }
  ]
  var opsSerialized = JSON.stringify(ops)

  var encoded = codec.encodeBatch(ops, { encoding: 'json' })

  t.equal(opsSerialized, JSON.stringify(ops), 'ops not changed')

  t.deepEqual(encoded, [
    { type: 'put', key: 'string', value: 'string' },
    { type: 'put', key: 'json', value: '{}' }
  ])

  encoded = codec.encodeBatch(ops)
  t.deepEqual(encoded, [
    { type: 'put', key: 'string', value: 'string' },
    { type: 'put', key: 'json', value: {} }
  ])

  t.end()
})

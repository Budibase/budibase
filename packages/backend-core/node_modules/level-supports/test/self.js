'use strict'

var test = require('tape')
var supports = require('..')
var shape = require('./shape')
var cloneable = require('./cloneable')

test('no options', function (t) {
  shape(t, supports())
  cloneable(t, supports())
  t.end()
})

test('falsy options', function (t) {
  ;[null, false, undefined, 0, ''].forEach(function (value) {
    var manifest = supports({
      bufferKeys: value,
      additionalMethods: {
        foo: value
      }
    })

    shape(t, manifest)
    t.is(manifest.bufferKeys, false)
  })

  t.end()
})

test('truthy options', function (t) {
  ;[true, {}, 'yes', 1, []].forEach(function (value) {
    var manifest = supports({
      streams: value,
      additionalMethods: {
        foo: value
      }
    })

    shape(t, manifest)
    t.same(manifest.streams, value)
    t.same(manifest.additionalMethods.foo, value)
  })

  t.end()
})

test('merges input objects without mutating them', function (t) {
  var input1 = { bufferKeys: null, streams: false }
  var input2 = { streams: true, additionalMethods: {} }
  var manifest = supports(input1, input2)

  manifest.foobar = true
  manifest.additionalMethods.baz = true

  t.same(input1, { bufferKeys: null, streams: false })
  t.same(input2, { streams: true, additionalMethods: {} })
  t.is(manifest.bufferKeys, false)
  t.is(manifest.streams, true)
  shape(t, manifest)
  t.end()
})

test('inherits additionalMethods', function (t) {
  var manifest = supports({ additionalMethods: { foo: true } }, {})
  t.same(manifest.additionalMethods, { foo: true })
  t.end()
})

test('does not merge additionalMethods', function (t) {
  var input1 = { additionalMethods: { foo: true } }
  var input2 = { additionalMethods: { bar: true } }
  var manifest = supports(input1, input2)
  t.same(manifest.additionalMethods, { bar: true })
  t.end()
})

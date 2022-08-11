'use strict'

var supports = require('..')

// Every object in a manifest must have a unique identity, to avoid accidental
// mutation. In supports() we only shallowly clone the manifest object itself
// and additionalMethods. If in the future we add more objects to manifests,
// this test will break and we'll know to start performing a deep clone.
module.exports = function cloneable (t, manifest) {
  var copy = supports(manifest)
  verifyUnique(t, 'manifest', manifest, copy)
}

function verifyUnique (t, path, a, b) {
  if (isObject(a) && isObject(b)) {
    t.ok(a !== b, path + ' has unique identity')

    Object.keys(a).forEach(function (key) {
      verifyUnique(t, path + '.' + key, a[key], b[key])
    })
  }
}

function isObject (o) {
  return typeof o === 'object' && o !== null
}

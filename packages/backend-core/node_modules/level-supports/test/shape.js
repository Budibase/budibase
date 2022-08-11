'use strict'

var hasOwnProperty = Object.prototype.hasOwnProperty

module.exports = function shape (t, manifest) {
  t.ok(isObject(manifest), 'manifest is object')
  t.ok(isObject(manifest.additionalMethods), 'additionalMethods is object')

  for (var k in manifest) {
    if (!hasOwnProperty.call(manifest, k)) continue

    if (manifest[k]) {
      t.ok(manifest[k], 'truthy: ' + k)
    } else {
      t.is(manifest[k], false, 'false: ' + k)
    }
  }
}

function isObject (o) {
  return typeof o === 'object' && o !== null
}

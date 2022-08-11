/* global IDBKeyRange */

'use strict'

var ltgt = require('ltgt')
var NONE = {}

module.exports = function createKeyRange (options) {
  var lower = ltgt.lowerBound(options, NONE)
  var upper = ltgt.upperBound(options, NONE)
  var lowerOpen = ltgt.lowerBoundExclusive(options, NONE)
  var upperOpen = ltgt.upperBoundExclusive(options, NONE)

  if (lower !== NONE && upper !== NONE) {
    return IDBKeyRange.bound(lower, upper, lowerOpen, upperOpen)
  } else if (lower !== NONE) {
    return IDBKeyRange.lowerBound(lower, lowerOpen)
  } else if (upper !== NONE) {
    return IDBKeyRange.upperBound(upper, upperOpen)
  } else {
    return null
  }
}

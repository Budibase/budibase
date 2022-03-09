'use strict';
var $ = require('../internals/export');
var global = require('../internals/global');
var arrayToReversed = require('../internals/array-to-reversed');
var toIndexedObject = require('../internals/to-indexed-object');
var addToUnscopables = require('../internals/add-to-unscopables');

var Array = global.Array;

// `Array.prototype.toReversed` method
// https://tc39.es/proposal-change-array-by-copy/#sec-array.prototype.toReversed
$({ target: 'Array', proto: true, forced: true }, {
  toReversed: function toReversed() {
    return arrayToReversed(toIndexedObject(this), Array);
  }
});

addToUnscopables('toReversed');

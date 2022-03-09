'use strict';
var $ = require('../internals/export');
var global = require('../internals/global');
var arrayWith = require('../internals/array-with');
var toIndexedObject = require('../internals/to-indexed-object');

var Array = global.Array;

// `Array.prototype.with` method
// https://tc39.es/proposal-change-array-by-copy/#sec-array.prototype.with
$({ target: 'Array', proto: true, forced: true }, {
  'with': function (index, value) {
    return arrayWith(toIndexedObject(this), Array, index, value);
  }
});

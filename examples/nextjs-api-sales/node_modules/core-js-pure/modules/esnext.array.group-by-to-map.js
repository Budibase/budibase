'use strict';
var $ = require('../internals/export');
var getBuiltIn = require('../internals/get-built-in');
var bind = require('../internals/function-bind-context');
var uncurryThis = require('../internals/function-uncurry-this');
var IndexedObject = require('../internals/indexed-object');
var toObject = require('../internals/to-object');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var arrayMethodIsStrict = require('../internals/array-method-is-strict');
var addToUnscopables = require('../internals/add-to-unscopables');

var Map = getBuiltIn('Map');
var MapPrototype = Map.prototype;
var mapGet = uncurryThis(MapPrototype.get);
var mapHas = uncurryThis(MapPrototype.has);
var mapSet = uncurryThis(MapPrototype.set);
var push = uncurryThis([].push);

// `Array.prototype.groupByToMap` method
// https://github.com/tc39/proposal-array-grouping
// https://bugs.webkit.org/show_bug.cgi?id=236541
$({ target: 'Array', proto: true, forced: !arrayMethodIsStrict('groupByToMap') }, {
  groupByToMap: function groupByToMap(callbackfn /* , thisArg */) {
    var O = toObject(this);
    var self = IndexedObject(O);
    var boundFunction = bind(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    var map = new Map();
    var length = lengthOfArrayLike(self);
    var index = 0;
    var key, value;
    for (;length > index; index++) {
      value = self[index];
      key = boundFunction(value, index, O);
      if (mapHas(map, key)) push(mapGet(map, key), value);
      else mapSet(map, key, [value]);
    } return map;
  }
});

addToUnscopables('groupByToMap');

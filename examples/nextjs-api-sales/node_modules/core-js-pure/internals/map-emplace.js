'use strict';
var call = require('../internals/function-call');
var aCallable = require('../internals/a-callable');
var anObject = require('../internals/an-object');

// `Map.prototype.emplace` method
// https://github.com/thumbsupep/proposal-upsert
module.exports = function emplace(key, handler) {
  var map = anObject(this);
  var get = aCallable(map.get);
  var has = aCallable(map.has);
  var set = aCallable(map.set);
  var value = (call(has, map, key) && 'update' in handler)
    ? handler.update(call(get, map, key), key, map)
    : handler.insert(key, map);
  call(set, map, key, value);
  return value;
};

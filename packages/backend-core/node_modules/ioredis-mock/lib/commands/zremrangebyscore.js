"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.zremrangebyscore = zremrangebyscore;

var _index = require("./index");

function zremrangebyscore(key, inputMin, inputMax) {
  const vals = _index.zrevrangebyscore.call(this, key, inputMax, inputMin);

  if (!this.data.has(key)) {
    return 0; // Short circuit.
  }

  const map = this.data.get(key);
  vals.forEach(val => {
    map.delete(val);
  });
  this.data.set(key, map);
  return vals.length;
}
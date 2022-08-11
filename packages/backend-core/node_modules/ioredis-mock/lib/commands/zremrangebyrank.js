"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.zremrangebyrank = zremrangebyrank;

var _index = require("./index");

function zremrangebyrank(key, s, e) {
  const vals = _index.zrange.call(this, key, s, e);

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
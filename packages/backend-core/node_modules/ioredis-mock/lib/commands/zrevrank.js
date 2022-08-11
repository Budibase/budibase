"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.zrevrank = zrevrank;

var _zrevrange = require("./zrevrange");

function zrevrank(key, member) {
  const vals = _zrevrange.zrevrange.call(this, key, 0, -1);

  const idx = vals.indexOf(member);
  return idx >= 0 ? idx : null;
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.zrank = zrank;

var _zrange = require("./zrange");

function zrank(key, member) {
  const vals = _zrange.zrange.call(this, key, 0, -1);

  const idx = vals.indexOf(member);
  return idx >= 0 ? idx : null;
}
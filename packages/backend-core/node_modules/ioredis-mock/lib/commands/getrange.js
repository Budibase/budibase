"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getrange = getrange;

function getrange(key, s, e) {
  const val = this.data.get(key);
  const start = parseInt(s, 10);
  const end = parseInt(e, 10);

  if (end === -1) {
    return val.slice(start);
  }

  return val.slice(start, end + 1);
}
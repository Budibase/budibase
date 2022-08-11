"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.zrem = zrem;

function zrem(key, ...vals) {
  const map = this.data.get(key);
  if (!map) return 0;
  let removed = 0;
  vals.forEach(val => {
    if (map.delete(val)) {
      removed++;
    }
  });
  this.data.set(key, map);
  return removed;
}
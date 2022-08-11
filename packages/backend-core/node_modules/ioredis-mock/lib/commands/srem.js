"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.srem = srem;

function srem(key, ...vals) {
  if (!this.data.has(key)) {
    return 0;
  }

  let removed = 0;
  const set = this.data.get(key);
  vals.forEach(val => {
    if (set.has(val)) {
      removed++;
    }

    set.delete(val);
  });

  if (set.size === 0) {
    this.data.delete(key);
  } else {
    this.data.set(key, set);
  }

  return removed;
}
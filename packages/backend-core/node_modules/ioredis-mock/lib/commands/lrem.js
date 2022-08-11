"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lrem = lrem;

function lrem(key, c, value) {
  if (this.data.has(key) && !(this.data.get(key) instanceof Array)) {
    return 0;
  }

  const count = parseInt(c, 10);
  const list = [...(this.data.get(key) || [])];
  const indexFun = (count < 0 ? [].lastIndexOf : [].indexOf).bind(list);
  const max = count === 0 ? list.length : Math.abs(count);
  let removed = 0;
  let idx = indexFun(value);

  while (idx !== -1 && removed < max) {
    removed++;
    list.splice(idx, 1);
    idx = indexFun(value);
  }

  this.data.set(key, list);
  return removed;
}
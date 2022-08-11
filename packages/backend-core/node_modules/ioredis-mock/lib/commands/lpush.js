"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lpush = lpush;

function lpush(key, ...values) {
  if (this.data.has(key) && !(this.data.get(key) instanceof Array)) {
    throw new Error(`Key ${key} does not contain a list`);
  }

  const list = this.data.get(key) || [];
  const length = list.unshift(...values.reverse());
  this.data.set(key, list);
  return length;
}
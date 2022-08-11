"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rpush = rpush;

function rpush(key, ...values) {
  if (this.data.has(key) && !(this.data.get(key) instanceof Array)) {
    throw new Error(`Key ${key} does not contain a list`);
  }

  const list = this.data.get(key) || [];
  const length = list.push(...values);
  this.data.set(key, list);
  return length;
}
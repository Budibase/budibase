"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rpop = rpop;

function rpop(key) {
  if (this.data.has(key) && !(this.data.get(key) instanceof Array)) {
    throw new Error(`Key ${key} does not contain a list`);
  }

  const list = this.data.get(key) || [];
  const item = list.length > 0 ? list.pop() : null;
  this.data.set(key, list);
  return item;
}
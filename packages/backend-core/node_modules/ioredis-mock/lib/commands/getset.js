"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getset = getset;

function getset(key, val) {
  const old = this.data.has(key) ? this.data.get(key) : null;
  this.data.set(key, val);
  this.expires.delete(key);
  return old;
}
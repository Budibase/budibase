"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ltrim = ltrim;

function ltrim(key, s, e) {
  if (this.data.has(key) && !(this.data.get(key) instanceof Array)) {
    throw new Error(`Key ${key} does not contain a list`);
  }

  const start = parseInt(s, 10);
  const end = parseInt(e, 10);
  const list = this.data.get(key) || [];
  this.data.set(key, list.slice(start, end + 1 || undefined));
  return 'OK';
}
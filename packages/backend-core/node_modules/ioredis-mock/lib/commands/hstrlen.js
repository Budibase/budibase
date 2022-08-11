"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hstrlen = hstrlen;

function hstrlen(key, field) {
  return this.data.has(key) && {}.hasOwnProperty.call(this.data.get(key), field) ? this.data.get(key)[field].length : 0;
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hlen = hlen;

function hlen(key) {
  return this.data.has(key) ? Object.keys(this.data.get(key)).length : 0;
}
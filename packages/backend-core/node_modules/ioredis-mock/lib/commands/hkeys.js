"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hkeys = hkeys;

function hkeys(key) {
  return this.data.has(key) ? Object.keys(this.data.get(key)) : [];
}
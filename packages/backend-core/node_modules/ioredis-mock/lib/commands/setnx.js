"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setnx = setnx;

function setnx(key, val) {
  if (!this.data.has(key)) {
    this.data.set(key, val);
    return 1;
  }

  return 0;
}
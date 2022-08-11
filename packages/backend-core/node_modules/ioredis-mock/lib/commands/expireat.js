"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.expireat = expireat;

function expireat(key, at) {
  if (!this.data.has(key)) {
    return 0;
  }

  this.expires.set(key, at * 1000);
  return 1;
}
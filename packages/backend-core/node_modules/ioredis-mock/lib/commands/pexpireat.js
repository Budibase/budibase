"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pexpireat = pexpireat;

function pexpireat(key, at) {
  if (!this.data.has(key)) {
    return 0;
  }

  this.expires.set(key, at);
  return 1;
}
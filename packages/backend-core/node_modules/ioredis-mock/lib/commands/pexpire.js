"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pexpire = pexpire;

function pexpire(key, milliseconds) {
  if (!this.data.has(key)) {
    return 0;
  }

  this.expires.set(key, +milliseconds + Date.now());
  return 1;
}
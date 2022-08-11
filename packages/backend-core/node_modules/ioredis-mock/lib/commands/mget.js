"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mget = mget;

function mget(...keys) {
  return keys.map(key => this.data.has(key) ? this.data.get(key) : null);
}
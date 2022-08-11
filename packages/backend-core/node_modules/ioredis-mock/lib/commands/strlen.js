"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.strlen = strlen;

function strlen(key) {
  return this.data.has(key) ? this.data.get(key).length : 0;
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = get;

function get(key) {
  return this.data.has(key) ? this.data.get(key) : null;
}
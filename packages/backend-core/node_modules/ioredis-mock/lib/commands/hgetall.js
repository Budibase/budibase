"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hgetall = hgetall;

function hgetall(key) {
  return this.data.get(key) || {};
}
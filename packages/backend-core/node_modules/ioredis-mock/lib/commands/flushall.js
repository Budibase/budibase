"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.flushall = flushall;

function flushall() {
  this.data.clear();
  return 'OK';
}
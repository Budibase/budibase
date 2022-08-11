"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.flushdb = flushdb;

function flushdb() {
  this.data.clear();
  return 'OK';
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.xlen = xlen;

function xlen(stream) {
  return (this.data.get(stream) || []).length;
}
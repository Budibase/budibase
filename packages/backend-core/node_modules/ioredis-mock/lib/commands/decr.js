"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decr = decr;

function decr(key) {
  if (!this.data.has(key)) {
    this.data.set(key, '0');
  }

  const curVal = Number(this.data.get(key));
  const nextVal = curVal - 1;
  this.data.set(key, nextVal.toString());
  return nextVal;
}
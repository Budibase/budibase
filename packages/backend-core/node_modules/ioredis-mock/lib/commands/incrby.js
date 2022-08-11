"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.incrby = incrby;

function incrby(key, increment = 0) {
  if (!this.data.has(key)) {
    this.data.set(key, '0');
  }

  const curVal = Number(this.data.get(key));
  const nextVal = curVal + parseInt(increment, 10);
  this.data.set(key, nextVal.toString());
  return nextVal;
}
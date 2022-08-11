"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decrby = decrby;

function decrby(key, decrement = 0) {
  if (!this.data.has(key)) {
    this.data.set(key, '0');
  }

  const curVal = Number(this.data.get(key));
  const nextVal = curVal - parseInt(decrement, 10);
  this.data.set(key, nextVal.toString());
  return nextVal;
}
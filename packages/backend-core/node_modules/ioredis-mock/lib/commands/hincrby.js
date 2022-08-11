"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hincrby = hincrby;

function hincrby(key, field, increment = 0) {
  if (!this.data.has(key)) {
    this.data.set(key, {
      [field]: '0'
    });
  }

  const hash = this.data.get(key);

  if (!{}.hasOwnProperty.call(hash, field)) {
    hash[field] = '0';
  }

  const curVal = Number(hash[field]);
  const nextVal = curVal + parseInt(increment, 10);
  hash[field] = nextVal.toString();
  this.data.set(key, hash);
  return nextVal;
}
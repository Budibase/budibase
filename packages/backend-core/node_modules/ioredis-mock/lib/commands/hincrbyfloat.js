"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hincrbyfloat = hincrbyfloat;

function hincrbyfloat(key, field, increment) {
  if (!this.data.has(key)) {
    this.data.set(key, {
      [field]: '0'
    });
  }

  const hash = this.data.get(key);

  if (!{}.hasOwnProperty.call(hash, field)) {
    hash[field] = '0';
  }

  const curVal = parseFloat(hash[field]);
  hash[field] = (curVal + parseFloat(increment)).toString();
  this.data.set(key, hash);
  return hash[field];
}
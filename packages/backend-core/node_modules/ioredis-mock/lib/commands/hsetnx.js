"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hsetnx = hsetnx;

function hsetnx(key, hashKey, hashVal) {
  if (!this.data.has(key)) {
    this.data.set(key, {});
  }

  if (!{}.hasOwnProperty.call(this.data.get(key), hashKey)) {
    const hash = this.data.get(key);
    hash[hashKey] = hashVal;
    this.data.set(key, hash);
    return 1;
  }

  return 0;
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hdel = hdel;

function hdel(key, ...fields) {
  const value = this.data.get(key);

  if (!value) {
    return 0;
  }

  const numDeleted = fields.filter(field => {
    if ({}.hasOwnProperty.call(value, field)) {
      delete value[field];
      return true;
    }

    return false;
  }).length;
  const numLeft = Object.getOwnPropertyNames(value).length;

  if (numLeft > 0) {
    this.data.set(key, value);
  } else {
    this.data.delete(key);
  }

  return numDeleted;
}
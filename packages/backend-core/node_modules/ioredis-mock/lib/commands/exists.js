"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exists = exists;

function exists(...keys) {
  return keys.reduce((totalExists, key) => {
    if (this.data.has(key)) {
      return totalExists + 1;
    }

    return totalExists;
  }, 0);
}
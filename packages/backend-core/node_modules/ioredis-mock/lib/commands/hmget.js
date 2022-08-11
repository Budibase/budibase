"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hmget = hmget;

function hmget(key, ...fields) {
  const hash = this.data.get(key);
  return fields.map(field => {
    if (!hash || hash[field] === undefined) {
      return null;
    }

    return hash[field];
  });
}
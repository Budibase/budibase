"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hset = hset;

function hset(key, ...keyValuePairs) {
  if (!this.data.has(key)) {
    this.data.set(key, {});
  }

  const hash = this.data.get(key);
  let reply = 0;

  for (let i = 0; i < keyValuePairs.length; i += 2) {
    const field = keyValuePairs[i];
    const value = keyValuePairs[i + 1];

    if (!{}.hasOwnProperty.call(hash, field)) {
      reply++;
    }

    hash[field] = value;
  }

  this.data.set(key, hash);
  return reply;
}
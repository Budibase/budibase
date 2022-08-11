"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hmset = hmset;

function hmset(key, ...args) {
  if (!this.data.has(key)) {
    this.data.set(key, {});
  }

  const hash = this.data.get(key);

  for (let i = 0; i < args.length; i += 2) {
    hash[args[i]] = args[i + 1];
  }

  this.data.set(key, hash);
  return 'OK';
}
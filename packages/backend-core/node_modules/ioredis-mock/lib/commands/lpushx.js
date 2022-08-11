"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lpushx = lpushx;

var _index = require("./index");

function lpushx(key, value) {
  if (!this.data.has(key)) {
    return 0;
  }

  return _index.lpush.call(this, key, value);
}
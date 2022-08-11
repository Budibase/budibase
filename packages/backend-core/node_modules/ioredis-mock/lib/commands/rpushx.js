"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rpushx = rpushx;

var _index = require("./index");

function rpushx(key, value) {
  if (!this.data.has(key)) {
    return 0;
  }

  return _index.rpush.call(this, key, value);
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renamenx = renamenx;

var _index = require("./index");

function renamenx(key, newKey) {
  if (this.data.has(newKey)) {
    return 0;
  }

  _index.rename.call(this, key, newKey);

  return 1;
}
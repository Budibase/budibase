"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unlink = unlink;

var _del = require("./del");

function unlink(...keys) {
  const removeKeys = _del.del.bind(this);

  return removeKeys(...keys);
}
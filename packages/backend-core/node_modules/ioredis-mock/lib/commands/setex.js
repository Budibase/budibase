"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setex = setex;

var _index = require("./index");

function setex(key, seconds, value) {
  _index.set.call(this, key, value);

  _index.expire.call(this, key, seconds);

  return 'OK';
}
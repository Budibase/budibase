"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.psetex = psetex;

var _index = require("./index");

function psetex(key, milliseconds, value) {
  _index.set.call(this, key, value);

  _index.pexpire.call(this, key, milliseconds);

  return 'OK';
}
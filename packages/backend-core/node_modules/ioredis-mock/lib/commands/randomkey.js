"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.randomkey = randomkey;

var _lodash = require("lodash");

function randomkey() {
  const keys = this.data.keys();
  return keys.length > 0 ? keys[(0, _lodash.random)(0, keys.length - 1)] : null;
}
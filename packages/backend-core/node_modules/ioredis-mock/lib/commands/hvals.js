"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hvals = hvals;

var _lodash = require("lodash");

function hvals(key) {
  return (0, _lodash.values)(this.data.get(key));
}
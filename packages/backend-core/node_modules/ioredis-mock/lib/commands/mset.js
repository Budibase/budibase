"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mset = mset;

var _index = require("./index");

function mset(...msetData) {
  for (let i = 0; i < msetData.length; i += 2) {
    _index.set.call(this, msetData[i], msetData[i + 1]);
  }

  return 'OK';
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rpopBuffer = rpopBuffer;

var _rpop = require("./rpop");

function rpopBuffer(key) {
  return _rpop.rpop.apply(this, [key]);
}
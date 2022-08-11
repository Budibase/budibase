"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rpoplpushBuffer = rpoplpushBuffer;

var _rpoplpush = require("./rpoplpush");

function rpoplpushBuffer(source, destination) {
  return _rpoplpush.rpoplpush.apply(this, [source, destination]);
}
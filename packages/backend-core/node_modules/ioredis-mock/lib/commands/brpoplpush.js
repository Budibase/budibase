"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.brpoplpush = brpoplpush;

function brpoplpush(source, destination) {
  return this.rpoplpush(source, destination);
}
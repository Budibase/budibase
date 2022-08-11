"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lastsave = lastsave;

function lastsave() {
  return Math.floor(new Date().getTime() / 1000);
}
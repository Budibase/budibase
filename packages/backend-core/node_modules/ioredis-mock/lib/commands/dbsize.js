"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dbsize = dbsize;

function dbsize() {
  return this.data.keys().length;
}
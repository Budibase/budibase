"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.discard = discard;

function discard() {
  if (!this.batch) {
    throw new Error('ERR DISCARD without MULTI');
  }

  this.batch = undefined;
  return 'OK';
}
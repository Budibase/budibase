"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hscan = hscan;

var _scanCommand = require("../commands-utils/scan-command.common");

function hscan(key, cursor, ...args) {
  if (!this.data.has(key)) {
    return ['0', []];
  }

  const hKeys = Object.keys(this.data.get(key));
  return (0, _scanCommand.scanHelper)(hKeys, 1, cursor, ...args);
}
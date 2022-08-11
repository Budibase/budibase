"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sscan = sscan;

var _scanCommand = require("../commands-utils/scan-command.common");

function sscan(key, cursor, ...args) {
  if (!this.data.has(key)) {
    return ['0', []];
  }

  const setKeys = [];
  this.data.get(key).forEach(value => setKeys.push(value));
  return (0, _scanCommand.scanHelper)(setKeys, 1, cursor, ...args);
}
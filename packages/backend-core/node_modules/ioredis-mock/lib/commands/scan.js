"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scan = scan;

var _scanCommand = require("../commands-utils/scan-command.common");

function scan(cursor, opt1, opt1val, opt2, opt2val) {
  const allKeys = this.data.keys();
  return (0, _scanCommand.scanHelper)(allKeys, 1, cursor, opt1, opt1val, opt2, opt2val);
}
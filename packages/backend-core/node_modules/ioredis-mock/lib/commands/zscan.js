"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.zscan = zscan;

var _lodash = require("lodash");

var _scanCommand = require("../commands-utils/scan-command.common");

function zscan(key, cursor, ...args) {
  if (!this.data.has(key)) {
    return ['0', []];
  }

  const zKeys = [];
  this.data.get(key).forEach(({
    score,
    value
  }) => {
    zKeys.push([value, score.toString()]);
  });
  const [offset, keys] = (0, _scanCommand.scanHelper)(zKeys, 1, cursor, ...args);
  return [offset, (0, _lodash.flatten)(keys)];
}
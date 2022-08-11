"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sscanStream = sscanStream;

var _readableScan = _interopRequireDefault(require("../commands-utils/readable-scan"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sscanStream(key, opt = {}) {
  const options = opt instanceof Object ? opt : {};
  options.key = key;
  return new _readableScan.default(this.sscan, options);
}
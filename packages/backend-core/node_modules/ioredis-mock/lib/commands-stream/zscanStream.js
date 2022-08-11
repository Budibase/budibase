"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.zscanStream = zscanStream;

var _readableScan = _interopRequireDefault(require("../commands-utils/readable-scan"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function zscanStream(key, opt = {}) {
  const options = opt instanceof Object ? opt : {};
  options.key = key;
  return new _readableScan.default(this.zscan, options);
}
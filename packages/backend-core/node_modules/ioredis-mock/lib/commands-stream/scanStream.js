"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scanStream = scanStream;

var _readableScan = _interopRequireDefault(require("../commands-utils/readable-scan"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function scanStream(opt) {
  return new _readableScan.default(this.scan, opt);
}
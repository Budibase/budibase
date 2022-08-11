"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connect = connect;

var _emitConnectEvent = _interopRequireDefault(require("../commands-utils/emitConnectEvent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function connect() {
  if (this.connected) {
    throw new Error('Redis is already connecting/connected');
  }

  this.connected = true;
  (0, _emitConnectEvent.default)(this);
  return undefined;
}
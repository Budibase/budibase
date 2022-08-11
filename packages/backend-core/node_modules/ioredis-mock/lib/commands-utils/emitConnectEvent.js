"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = emitConnectEvent;

function emitConnectEvent(redisMock) {
  process.nextTick(() => {
    redisMock.emit('connect');
    redisMock.emit('ready');
  });
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.expire = expire;

var _keyspaceNotifications = require("../keyspace-notifications");

function expire(key, seconds) {
  if (!this.data.has(key)) {
    return 0;
  }

  this.expires.set(key, seconds * 1000 + Date.now());
  (0, _keyspaceNotifications.emitNotification)(this, 'g', key, 'expire');
  return 1;
}
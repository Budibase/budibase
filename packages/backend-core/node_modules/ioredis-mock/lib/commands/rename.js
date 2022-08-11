"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rename = rename;

var _keyspaceNotifications = require("../keyspace-notifications");

function rename(key, newKey) {
  const value = this.data.get(key);

  if (this.expires.has(key)) {
    const expire = this.expires.get(key);
    this.expires.delete(key);
    this.expires.set(newKey, expire);
  }

  this.data.set(newKey, value);
  this.data.delete(key);
  (0, _keyspaceNotifications.emitNotification)(this, 'g', key, 'rename_from');
  (0, _keyspaceNotifications.emitNotification)(this, 'g', newKey, 'rename_to');
  return 'OK';
}
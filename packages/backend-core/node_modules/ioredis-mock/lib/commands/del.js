"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.del = del;

var _keyspaceNotifications = require("../keyspace-notifications");

function del(...keys) {
  let deleted = 0;
  keys.forEach(key => {
    if (this.data.has(key)) {
      deleted++;
      (0, _keyspaceNotifications.emitNotification)(this, 'g', key, 'del');
    }

    this.data.delete(key);
  });
  return deleted;
}
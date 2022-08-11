"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createExpires;

function createExpires(keyPrefix = '') {
  const expires = {};

  function createInstance(prefix) {
    return {
      get(key) {
        return expires[`${prefix}${key}`];
      },

      set(key, timestamp) {
        expires[`${prefix}${key}`] = +timestamp;
      },

      has(key) {
        return {}.hasOwnProperty.call(expires, `${prefix}${key}`);
      },

      isExpired(key) {
        return expires[`${prefix}${key}`] <= Date.now();
      },

      delete(key) {
        delete expires[`${prefix}${key}`];
      },

      withKeyPrefix(newPrefix) {
        if (newPrefix === prefix) return this;
        return createInstance(newPrefix);
      }

    };
  }

  return createInstance(keyPrefix);
}
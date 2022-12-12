"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertToHeadersObject = convertToHeadersObject;

var _undici = require("undici");

function convertToHeadersObject(_headers) {
  const headers = {};

  if (Array.isArray(_headers)) {
    if (_headers.length % 2 !== 0) {
      throw new _undici.errors.InvalidArgumentError('headers array must be even');
    }

    for (let idx = 0; idx < _headers.length; idx += 2) {
      const key = _headers[idx];
      const value = _headers[idx + 1];

      if (key != null && value != null) {
        const keyStr = (Buffer.isBuffer(key) ? key.toString('utf-8') : key).toLowerCase();
        const valueStr = Buffer.isBuffer(value) ? value.toString('utf-8') : value;

        if (keyStr === 'set-cookie') {
          headers[keyStr] = [...(headers[keyStr] ?? []), valueStr];
        } else {
          headers[keyStr] = valueStr;
        }
      }
    }
  } else if (_headers != null) {
    for (const [key, value] of Object.entries(_headers)) {
      headers[key.toLowerCase()] = value;
    }
  }

  return headers;
}
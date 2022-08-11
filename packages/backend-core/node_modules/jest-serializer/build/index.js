'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = void 0;
exports.deserialize = deserialize;
exports.readFileSync = readFileSync;
exports.serialize = serialize;
exports.writeFileSync = writeFileSync;

function _v() {
  const data = require('v8');

  _v = function () {
    return data;
  };

  return data;
}

function fs() {
  const data = _interopRequireWildcard(require('graceful-fs'));

  fs = function () {
    return data;
  };

  return data;
}

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== 'function') return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }
  if (obj === null || (typeof obj !== 'object' && typeof obj !== 'function')) {
    return {default: obj};
  }
  var cache = _getRequireWildcardCache(nodeInterop);
  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }
  var newObj = {};
  var hasPropertyDescriptor =
    Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var key in obj) {
    if (key !== 'default' && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor
        ? Object.getOwnPropertyDescriptor(obj, key)
        : null;
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  newObj.default = obj;
  if (cache) {
    cache.set(obj, newObj);
  }
  return newObj;
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// TODO: Remove this
/// <reference path="../v8.d.ts" />
// JSON and V8 serializers are both stable when it comes to compatibility. The
// current JSON specification is well defined in RFC 8259, and V8 ensures that
// the versions are compatible by encoding the serialization version in the own
// generated buffer.
// In memory functions.
function deserialize(buffer) {
  return (0, _v().deserialize)(buffer);
}

function serialize(content) {
  return (0, _v().serialize)(content);
} // Synchronous filesystem functions.

function readFileSync(filePath) {
  return (0, _v().deserialize)(fs().readFileSync(filePath));
}

function writeFileSync(filePath, content) {
  return fs().writeFileSync(filePath, (0, _v().serialize)(content));
}

var _default = {
  deserialize,
  readFileSync,
  serialize,
  writeFileSync
};
exports.default = _default;

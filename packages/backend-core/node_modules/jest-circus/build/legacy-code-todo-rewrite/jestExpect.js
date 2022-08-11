'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = jestExpect;

var _expect = _interopRequireDefault(require('expect'));

var _jestSnapshot = require('jest-snapshot');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function jestExpect(config) {
  _expect.default.setState({
    expand: config.expand
  });

  _expect.default.extend({
    toMatchInlineSnapshot: _jestSnapshot.toMatchInlineSnapshot,
    toMatchSnapshot: _jestSnapshot.toMatchSnapshot,
    toThrowErrorMatchingInlineSnapshot:
      _jestSnapshot.toThrowErrorMatchingInlineSnapshot,
    toThrowErrorMatchingSnapshot: _jestSnapshot.toThrowErrorMatchingSnapshot
  });

  _expect.default.addSnapshotSerializer = _jestSnapshot.addSerializer;
  return _expect.default;
}
